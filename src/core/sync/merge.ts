/**
 * Instantánea del progreso y fusión entre dispositivos (pura, sin red).
 *
 * Reglas:
 * - Progreso académico (intentos) = unión sin duplicados → nunca se pierde una respuesta.
 *   Las tarjetas de repaso se recalculan a partir de los intentos fusionados.
 * - Conjuntos (unidades completadas, elementos, inventario, insignias, días activos) = unión.
 * - Contadores y récords = máximo. Límite conocido: si se estudia sin conexión en dos
 *   dispositivos a la vez, la XP de ese periodo puede contarse solo una vez (nunca se pierde progreso académico).
 * - Preferencias, perfil, mascota y equipamiento = gana la instantánea modificada más tarde.
 */
import type { ActivityEvent } from '@/core/gamification/missions';
import { coinsForXp, type XpEvent } from '@/core/gamification/progress';
import { newCard, qualityFromAttempt, review, type ReviewCard } from '@/core/learning/spacedRepetition';
import type { Attempt } from '@/core/learning/types';

export const SNAPSHOT_VERSION = 1;

export interface Snapshot {
  v: number;
  /** Última modificación local (ms). */
  updatedAt: number;
  profile: {
    displayName: string;
    goals: string[];
    onboardingDone: boolean;
    diagnosticDone: boolean;
    diagnostic: Record<string, number> | null;
    createdAt: number | null;
  };
  learning: { attempts: Attempt[]; completedUnits: string[]; lastUnitId: string | null };
  rewards: {
    xp: number;
    coins: number;
    badges: string[];
    inventory: string[];
    equipped: Record<string, string>;
    activeDays: string[];
    discovered: number[];
    favorites: number[];
    log: ActivityEvent[];
    counts: Partial<Record<XpEvent, number>>;
    claimed: string[];
    studyMs: Record<string, number>;
    bestScores: Record<string, number>;
  };
  pet: { name: string; energy: number; joy: number; updatedAt: number };
  prefs: { weeklyGoalDays: number; masteryThreshold: number; explanationStyle: string };
}

const union = <T>(a: T[], b: T[]) => [...new Set([...a, ...b])];

function maxRecord<K extends string>(a: Partial<Record<K, number>>, b: Partial<Record<K, number>>) {
  const out: Partial<Record<K, number>> = { ...a };
  for (const k of Object.keys(b) as K[]) out[k] = Math.max(out[k] ?? 0, b[k] ?? 0);
  return out;
}

export function mergeAttempts(a: Attempt[], b: Attempt[]): Attempt[] {
  const seen = new Map<string, Attempt>();
  for (const at of [...a, ...b]) seen.set(`${at.questionId}|${at.at}`, at);
  return [...seen.values()].sort((x, y) => x.at - y.at);
}

/** Reconstruye las tarjetas SM-2 aplicando los intentos en orden cronológico. */
export function cardsFromAttempts(attempts: Attempt[]): Record<string, ReviewCard> {
  const cards: Record<string, ReviewCard> = {};
  for (const a of attempts) {
    const card = cards[a.conceptId] ?? newCard(a.conceptId, a.at);
    cards[a.conceptId] = review(card, qualityFromAttempt(a.correct, a.hintsUsed), a.at);
  }
  return cards;
}

function mergeLog(a: ActivityEvent[], b: ActivityEvent[]): ActivityEvent[] {
  const seen = new Map<string, ActivityEvent>();
  for (const ev of [...a, ...b]) seen.set(`${ev.e}|${ev.at}`, ev);
  return [...seen.values()].sort((x, y) => x.at - y.at);
}

/**
 * Fusiona dos instantáneas. `priceOf` da el precio de un artículo del inventario,
 * para recalcular las monedas: monedas = monedas ganadas por XP − gastadas.
 */
export function mergeSnapshots(local: Snapshot, remote: Snapshot, priceOf: (itemId: string) => number): Snapshot {
  const newer = remote.updatedAt > local.updatedAt ? remote : local;
  const attempts = mergeAttempts(local.learning.attempts, remote.learning.attempts);
  const inventory = union(local.rewards.inventory, remote.rewards.inventory);
  const xp = Math.max(local.rewards.xp, remote.rewards.xp);
  const spent = inventory.reduce((sum, id) => sum + priceOf(id), 0);
  const equipped = Object.fromEntries(
    Object.entries(newer.rewards.equipped).filter(([, item]) => inventory.includes(item)),
  );
  return {
    v: SNAPSHOT_VERSION,
    updatedAt: Math.max(local.updatedAt, remote.updatedAt),
    profile: {
      ...newer.profile,
      // Completar onboarding o diagnóstico en un dispositivo cuenta para todos.
      onboardingDone: local.profile.onboardingDone || remote.profile.onboardingDone,
      diagnosticDone: local.profile.diagnosticDone || remote.profile.diagnosticDone,
      diagnostic: newer.profile.diagnostic ?? local.profile.diagnostic ?? remote.profile.diagnostic,
      createdAt:
        Math.min(local.profile.createdAt ?? Infinity, remote.profile.createdAt ?? Infinity) === Infinity
          ? null
          : Math.min(local.profile.createdAt ?? Infinity, remote.profile.createdAt ?? Infinity),
    },
    learning: {
      attempts,
      completedUnits: union(local.learning.completedUnits, remote.learning.completedUnits),
      lastUnitId: newer.learning.lastUnitId ?? local.learning.lastUnitId ?? remote.learning.lastUnitId,
    },
    rewards: {
      xp,
      coins: Math.max(0, coinsForXp(xp) - spent),
      badges: union(local.rewards.badges, remote.rewards.badges),
      inventory,
      equipped,
      activeDays: union(local.rewards.activeDays, remote.rewards.activeDays).sort(),
      discovered: union(local.rewards.discovered, remote.rewards.discovered).sort((x, y) => x - y),
      favorites: newer.rewards.favorites,
      log: mergeLog(local.rewards.log, remote.rewards.log),
      counts: maxRecord(local.rewards.counts, remote.rewards.counts),
      claimed: union(local.rewards.claimed, remote.rewards.claimed),
      studyMs: maxRecord(local.rewards.studyMs, remote.rewards.studyMs) as Record<string, number>,
      bestScores: maxRecord(local.rewards.bestScores, remote.rewards.bestScores) as Record<string, number>,
    },
    pet: remote.pet.updatedAt > local.pet.updatedAt ? remote.pet : local.pet,
    prefs: newer.prefs,
  };
}

/** Valida la forma mínima de una instantánea recibida de la red. */
export function isSnapshot(x: unknown): x is Snapshot {
  const s = x as Snapshot;
  return (
    !!s &&
    typeof s === 'object' &&
    typeof s.v === 'number' &&
    typeof s.updatedAt === 'number' &&
    Array.isArray(s.learning?.attempts) &&
    typeof s.rewards?.xp === 'number' &&
    typeof s.pet?.updatedAt === 'number'
  );
}
