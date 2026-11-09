import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { coinsForXp, dayKey, XP_REWARDS, type XpEvent } from '@/core/gamification/progress';

import { persistStorage, STORE_KEYS } from './storage';

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
  /** Marca un elemento como descubierto; da XP solo la primera vez. */
  discover: (z: number) => void;
  toggleFavorite: (z: number) => void;
  /** Registra una acción de estudio: suma XP, monedas y marca el día como activo. */
  award: (event: XpEvent, now?: number) => number;
  grantBadge: (id: string) => void;
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
};

export const useRewards = create<RewardsState>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      award: (event, now = Date.now()) => {
        const gained = XP_REWARDS[event];
        const { xp, coins, activeDays } = get();
        const today = dayKey(now);
        set({
          xp: xp + gained,
          coins: coins + (coinsForXp(xp + gained) - coinsForXp(xp)),
          activeDays: activeDays.includes(today) ? activeDays : [...activeDays, today],
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
    { name: STORE_KEYS.rewards, storage: persistStorage, version: 1 },
  ),
);
