import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { decay, feed, play, type PetStats } from '@/core/pet/wellbeing';

import { persistStorage, STORE_KEYS } from './storage';

export interface PetState extends PetStats {
  name: string;
  feed: () => void;
  play: () => void;
  refresh: () => void;
  rename: (name: string) => void;
}

const stats = (s: PetStats): PetStats => ({ energy: s.energy, joy: s.joy, updatedAt: s.updatedAt });

export const usePet = create<PetState>()(
  persist(
    (set, get) => ({
      name: 'Kata',
      energy: 80,
      joy: 80,
      updatedAt: Date.now(),
      feed: () => set(feed(stats(get()), Date.now())),
      play: () => set(play(stats(get()), Date.now())),
      refresh: () => set(decay(stats(get()), Date.now())),
      rename: (name) => set({ name: name.trim().slice(0, 16) || 'Kata' }),
    }),
    { name: STORE_KEYS.pet, storage: persistStorage, version: 1 },
  ),
);
