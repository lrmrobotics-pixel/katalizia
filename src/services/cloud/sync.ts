/**
 * Sincronización del progreso con Supabase (tabla `progress`, una fila por usuaria).
 * Local-first: la app funciona igual sin conexión; al sincronizar se fusionan los datos
 * con `mergeSnapshots` (nunca se pierde progreso académico).
 */
import { AppState } from 'react-native';

import { ACCESSORIES } from '@/components/pet/catSprite';
import { cardsFromAttempts, isSnapshot, mergeSnapshots, SNAPSHOT_VERSION, type Snapshot } from '@/core/sync/merge';
import { useLearning } from '@/state/learning';
import { usePet } from '@/state/pet';
import { useProfile, type StudyGoal } from '@/state/profile';
import { useRewards } from '@/state/rewards';
import { useSettings, type ExplanationStyle } from '@/state/settings';
import { useSync } from '@/state/sync';

import { cloudConfigured, getSupabase } from './client';

const priceOf = (id: string) => ACCESSORIES.find((a) => a.id === id)?.price ?? 0;

export function buildLocalSnapshot(): Snapshot {
  const p = useProfile.getState();
  const l = useLearning.getState();
  const r = useRewards.getState();
  const pet = usePet.getState();
  const s = useSettings.getState();
  return {
    v: SNAPSHOT_VERSION,
    updatedAt: useSync.getState().lastLocalChange,
    profile: {
      displayName: p.displayName,
      goals: p.goals,
      onboardingDone: p.onboardingDone,
      diagnosticDone: p.diagnosticDone,
      diagnostic: p.diagnostic,
      createdAt: p.createdAt,
    },
    learning: { attempts: l.attempts, completedUnits: l.completedUnits, lastUnitId: l.lastUnitId },
    rewards: {
      xp: r.xp,
      coins: r.coins,
      badges: r.badges,
      inventory: r.inventory,
      equipped: r.equipped,
      activeDays: r.activeDays,
      discovered: r.discovered,
      favorites: r.favorites,
      log: r.log,
      counts: r.counts,
      claimed: r.claimed,
      studyMs: r.studyMs,
      bestScores: r.bestScores,
    },
    pet: { name: pet.name, energy: pet.energy, joy: pet.joy, updatedAt: pet.updatedAt },
    prefs: { weeklyGoalDays: s.weeklyGoalDays, masteryThreshold: s.masteryThreshold, explanationStyle: s.explanationStyle },
  };
}

let applying = false;

export function applySnapshot(snap: Snapshot) {
  applying = true;
  try {
    useProfile.setState({ ...snap.profile, goals: snap.profile.goals as StudyGoal[] });
    useLearning.setState({ ...snap.learning, cards: cardsFromAttempts(snap.learning.attempts) });
    useRewards.setState(snap.rewards);
    usePet.setState(snap.pet);
    useSettings.getState().set({
      weeklyGoalDays: snap.prefs.weeklyGoalDays,
      masteryThreshold: snap.prefs.masteryThreshold,
      explanationStyle: snap.prefs.explanationStyle as ExplanationStyle,
    });
    useSync.getState().touch(snap.updatedAt);
  } finally {
    applying = false;
  }
}

const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

/** Descarga, fusiona, aplica y sube. Devuelve false si no hay sesión o falla. */
export async function syncNow(): Promise<boolean> {
  const sb = getSupabase();
  const sync = useSync.getState();
  if (!sb || !useSettings.getState().cloudSync) return false;
  const { data: auth } = await sb.auth.getSession();
  const user = auth.session?.user;
  if (!user) {
    sync.setStatus('idle');
    return false;
  }
  sync.setStatus('syncing');
  try {
    const { data: row, error } = await sb.from('progress').select('data').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    const local = buildLocalSnapshot();
    const merged = row && isSnapshot(row.data) ? mergeSnapshots(local, row.data, priceOf) : local;
    applySnapshot(merged);
    const { error: upErr } = await sb
      .from('progress')
      .upsert({ user_id: user.id, data: merged, updated_at: new Date().toISOString() });
    if (upErr) throw upErr;
    useSync.getState().setSynced(Date.now());
    return true;
  } catch (e) {
    const msg = message(e);
    useSync.getState().setStatus(/network|fetch/i.test(msg) ? 'offline' : 'error', msg);
    return false;
  }
}

// ── Sesión por código de un solo uso enviado al correo ───────────────────

export async function sendLoginCode(email: string): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return 'La sincronización no está configurada en esta versión.';
  const { error } = await sb.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
  return error ? error.message : null;
}

export async function verifyLoginCode(email: string, code: string): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return 'La sincronización no está configurada en esta versión.';
  const { data, error } = await sb.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' });
  if (error) return error.message;
  useSync.getState().setEmail(data.user?.email ?? email.trim());
  useSettings.getState().set({ cloudSync: true });
  await syncNow();
  return null;
}

export async function signOut() {
  const sb = getSupabase();
  if (sb) await sb.auth.signOut();
  useSync.getState().setEmail(null);
  useSync.getState().setStatus('idle');
  useSettings.getState().set({ cloudSync: false });
}

// ── Sincronización automática ────────────────────────────────────────────

let started = false;

/** Marca cambios locales y sincroniza al abrir la app y al pasarla a segundo plano. */
export function startAutoSync() {
  if (started || !cloudConfigured) return;
  started = true;
  const mark = () => {
    if (!applying) useSync.getState().touch();
  };
  [useProfile, useLearning, useRewards, usePet].forEach((store) => store.subscribe(mark));
  void syncNow();
  AppState.addEventListener('change', (st) => {
    if (st === 'background' || st === 'active') void syncNow();
  });
}
