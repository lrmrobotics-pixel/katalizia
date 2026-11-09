import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { computeMastery, DEFAULT_MASTERY, type ConceptMastery } from '@/core/learning/mastery';
import { newCard, qualityFromAttempt, review, type ReviewCard } from '@/core/learning/spacedRepetition';
import type { Attempt } from '@/core/learning/types';

import { persistStorage, STORE_KEYS } from './storage';

export interface LearningState {
  attempts: Attempt[];
  cards: Record<string, ReviewCard>;
  completedUnits: string[];
  /** Último punto de estudio, para "Continuar aprendiendo". */
  lastUnitId: string | null;
  recordAttempt: (a: Omit<Attempt, 'at'> & { at?: number }) => void;
  completeUnit: (unitId: string) => void;
  setLastUnit: (unitId: string) => void;
  masteryOf: (conceptId: string, threshold?: number) => ConceptMastery;
  reset: () => void;
}

const INITIAL = {
  attempts: [] as Attempt[],
  cards: {} as Record<string, ReviewCard>,
  completedUnits: [] as string[],
  lastUnitId: null as string | null,
};

export const useLearning = create<LearningState>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      recordAttempt: (input) => {
        const at = input.at ?? Date.now();
        const attempt: Attempt = { ...input, at };
        const card = get().cards[attempt.conceptId] ?? newCard(attempt.conceptId, at);
        set((s) => ({
          attempts: [...s.attempts, attempt],
          cards: {
            ...s.cards,
            [attempt.conceptId]: review(card, qualityFromAttempt(attempt.correct, attempt.hintsUsed), at),
          },
        }));
      },
      completeUnit: (unitId) =>
        set((s) => (s.completedUnits.includes(unitId) ? s : { completedUnits: [...s.completedUnits, unitId] })),
      setLastUnit: (unitId) => set({ lastUnitId: unitId }),
      masteryOf: (conceptId, threshold = DEFAULT_MASTERY.threshold) =>
        computeMastery(conceptId, get().attempts, { ...DEFAULT_MASTERY, threshold }),
      reset: () => set(INITIAL),
    }),
    { name: STORE_KEYS.learning, storage: persistStorage, version: 1 },
  ),
);
