import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { pruneLog, type ActivityEvent } from '@/core/gamification/missions';
import { coinsForXp, dayKey, XP_REWARDS, type XpEvent } from '@/core/gamification/progress';

import { persistStorage, STORE_KEYS } from './storage';

/** Máximo de minutos que se registran por sesión (evita contar la app abierta y olvidada). */
const MAX_SESSION_MS = 60 * 60 * 1000;

export interface RewardsState {
  xp: number;
  coins: number;
  badges: string[];
  inventory: string[];
  equipped: Record<string, string>;
  activeDays: string[];
  /** Elementos consultados al menos una vez (Z). */
  discovered: number[];
  favorites: number[];
  /** Actividad reciente (≈ 2 semanas) para calcular misiones. */
  log: ActivityEvent[];
  /** Totales históricos por evento; nunca bajan (insignias y estadísticas). */
  counts: Partial<Record<XpEvent, number>>;
  /** Claves `misión@periodo` ya reclamadas. */
  claimed: string[];
  /** Tiempo de estudio por día (YYYY-MM-DD → ms). */
  studyMs: Record<string, number>;
  /** Mejores puntuaciones por minijuego. */
  bestScores: Record<string, number>;
  /** Marca un elemento como descubierto; da XP solo la primera vez. */
  discover: (z: number) => void;
  toggleFavorite: (z: number) => void;
  /** Registra una acción de estudio: suma XP, monedas y marca el día como activo. */
  award: (event: XpEvent, now?: number) => number;
  grantBadge: (id: string) => void;
  /** Reclama una misión cumplida; devuelve false si ya estaba reclamada. */
  claimMission: (key: string, now?: number) => boolean;
  addStudyTime: (ms: number, now?: number) => void;
  /** Guarda la puntuación si es récord; devuelve true si lo es. */
  submitScore: (gameId: string, score: number) => boolean;
  /** Compra un cosmético; devuelve false si no hay monedas suficientes o ya lo tiene. */
  buy: (itemId: string, price: number) => boolean;
  equip: (slot: string, itemId: string | null) => void;
  reset: () => void;
}

const INITIAL = {
  xp: 0,
  coins: 0,
  badges: [] as string[],
  inventory: [] as string[],
  equipped: {} as Record<string, string>,
  activeDays: [] as string[],
  discovered: [] as number[],
  favorites: [] as number[],
  log: [] as ActivityEvent[],
  counts: {} as Partial<Record<XpEvent, number>>,
  claimed: [] as string[],
  studyMs: {} as Record<string, number>,
  bestScores: {} as Record<string, number>,
};

export const useRewards = create<RewardsState>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      award: (event, now = Date.now()) => {
        const gained = XP_REWARDS[event];
        const { xp, coins, activeDays, log, counts } = get();
        const today = dayKey(now);
        set({
          xp: xp + gained,
          coins: coins + (coinsForXp(xp + gained) - coinsForXp(xp)),
          // Reclamar una misión no cuenta como "día de estudio".
          activeDays: event === 'missionCompleted' || activeDays.includes(today) ? activeDays : [...activeDays, today],
          log: [...pruneLog(log, now), { e: event, at: now }],
          counts: { ...counts, [event]: (counts[event] ?? 0) + 1 },
        });
        return gained;
      },
      discover: (z) => {
        if (get().discovered.includes(z)) return;
        set((s) => ({ discovered: [...s.discovered, z] }));
        get().award('elementDiscovered');
      },
      toggleFavorite: (z) =>
        set((s) => ({
          favorites: s.favorites.includes(z) ? s.favorites.filter((x) => x !== z) : [...s.favorites, z],
        })),
      grantBadge: (id) => set((s) => (s.badges.includes(id) ? s : { badges: [...s.badges, id] })),
      claimMission: (key, now = Date.now()) => {
        if (get().claimed.includes(key)) return false;
        // Solo hacen falta las claves recientes; las antiguas no pueden repetirse (incluyen la fecha).
        set((s) => ({ claimed: [...s.claimed.slice(-60), key] }));
        get().award('missionCompleted', now);
        return true;
      },
      addStudyTime: (ms, now = Date.now()) => {
        if (!(ms > 0)) return;
        const day = dayKey(now);
        set((s) => ({ studyMs: { ...s.studyMs, [day]: (s.studyMs[day] ?? 0) + Math.min(ms, MAX_SESSION_MS) } }));
      },
      submitScore: (gameId, score) => {
        const best = get().bestScores[gameId] ?? 0;
        if (score <= best) return false;
        set((s) => ({ bestScores: { ...s.bestScores, [gameId]: score } }));
        return true;
      },
      buy: (itemId, price) => {
        const s = get();
        if (s.inventory.includes(itemId) || s.coins < price || price < 0) return false;
        set({ coins: s.coins - price, inventory: [...s.inventory, itemId] });
        return true;
      },
      equip: (slot, itemId) =>
        set((s) => {
          const equipped = { ...s.equipped };
          if (itemId === null) delete equipped[slot];
          else if (s.inventory.includes(itemId)) equipped[slot] = itemId;
          return { equipped };
        }),
      reset: () => set(INITIAL),
    }),
    {
      name: STORE_KEYS.rewards,
      storage: persistStorage,
      version: 2,
      // v1 → v2: añade registro de actividad, contadores, misiones, tiempo de estudio y récords.
      migrate: (persisted, version) => {
        const old = (persisted ?? {}) as Partial<RewardsState>;
        if (version < 2) return { ...INITIAL, ...old };
        return old as RewardsState;
      },
    },
  ),
);
