import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage, STORE_KEYS } from './storage';

export type StudyGoal = 'medicina' | 'bases' | 'examen' | 'curiosidad';

export interface ProfileState {
  /** Nombre o apodo elegido; nunca se envía a servicios externos sin consentimiento. */
  displayName: string;
  goals: StudyGoal[];
  onboardingDone: boolean;
  diagnosticDone: boolean;
  /** Aciertos por área (0–1) de la evaluación diagnóstica. */
  diagnostic: Record<string, number> | null;
  createdAt: number | null;
  completeOnboarding: (data: { displayName: string; goals: StudyGoal[] }) => void;
  markDiagnosticDone: (byArea: Record<string, number>) => void;
  rename: (name: string) => void;
  reset: () => void;
}

const INITIAL = {
  displayName: '',
  goals: [] as StudyGoal[],
  onboardingDone: false,
  diagnosticDone: false,
  diagnostic: null as Record<string, number> | null,
  createdAt: null as number | null,
};

export const sanitizeName = (name: string) => name.replace(/\s+/g, ' ').trim().slice(0, 24);

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      ...INITIAL,
      completeOnboarding: ({ displayName, goals }) =>
        set({ displayName: sanitizeName(displayName), goals, onboardingDone: true, createdAt: Date.now() }),
      markDiagnosticDone: (byArea) => set({ diagnosticDone: true, diagnostic: byArea }),
      // Sin trim mientras se escribe, para permitir espacios entre palabras.
      rename: (name) => set({ displayName: name.replace(/\s+/g, ' ').slice(0, 24) }),
      reset: () => set(INITIAL),
    }),
    { name: STORE_KEYS.profile, storage: persistStorage, version: 1 },
  ),
);
