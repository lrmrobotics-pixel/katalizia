import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { KataStyle } from '@/core/pet/animation';
import { decay, feed, play, type PetStats } from '@/core/pet/wellbeing';

import { persistStorage, STORE_KEYS } from './storage';

export interface PetState extends PetStats {
  name: string;
  /** Estilo visual de Kata. Cambiarlo no toca progreso, accesorios ni bienestar. */
  style: KataStyle;
  feed: () => void;
  play: () => void;
  refresh: () => void;
  rename: (name: string) => void;
  setStyle: (style: KataStyle) => void;
}

const stats = (s: PetStats): PetStats => ({ energy: s.energy, joy: s.joy, updatedAt: s.updatedAt });

export const usePet = create<PetState>()(
  persist(
    (set, get) => ({
      name: 'Kata',
      style: 'pixel',
      energy: 80,
      joy: 80,
      updatedAt: Date.now(),
      feed: () => set(feed(stats(get()), Date.now())),
      play: () => set(play(stats(get()), Date.now())),
      refresh: () => set(decay(stats(get()), Date.now())),
      rename: (name) => set({ name: name.trim().slice(0, 16) || 'Kata' }),
      setStyle: (style) => set({ style }),
    }),
    {
      name: STORE_KEYS.pet,
      storage: persistStorage,
      version: 2,
      // v1 → v2: añade el estilo visual (por defecto el pixel art original).
      migrate: (persisted, version) => {
        const old = (persisted ?? {}) as Partial<PetState>;
        return (version < 2 ? { ...old, style: 'pixel' } : old) as PetState;
      },
    },
  ),
);
