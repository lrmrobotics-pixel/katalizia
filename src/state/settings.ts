import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { PaletteId } from '@/theme/tokens';

import { persistStorage, STORE_KEYS } from './storage';

export type ThemePreference = 'system' | 'dark' | 'light';
export type ExplanationStyle = 'sencilla' | 'formal' | 'chisme';

export interface SettingsState {
  theme: ThemePreference;
  palette: PaletteId;
  highContrast: boolean;
  reduceMotion: boolean;
  /** Multiplicador de tamaño de texto (1 = normal). */
  textScale: number;
  explanationStyle: ExplanationStyle;
  /** Umbral de dominio configurable (0.5–0.95). */
  masteryThreshold: number;
  weeklyGoalDays: number;
  set: (patch: Partial<Omit<SettingsState, 'set' | 'reset'>>) => void;
  reset: () => void;
}

export const DEFAULT_SETTINGS = {
  theme: 'dark' as ThemePreference,
  palette: 'katalizia' as PaletteId,
  highContrast: false,
  reduceMotion: false,
  textScale: 1,
  explanationStyle: 'sencilla' as ExplanationStyle,
  masteryThreshold: 0.8,
  weeklyGoalDays: 4,
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      set: (patch) =>
        set((s) => ({
          ...patch,
          textScale: clamp(patch.textScale ?? s.textScale, 0.85, 1.4),
          masteryThreshold: clamp(patch.masteryThreshold ?? s.masteryThreshold, 0.5, 0.95),
          weeklyGoalDays: clamp(Math.round(patch.weeklyGoalDays ?? s.weeklyGoalDays), 1, 7),
        })),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    { name: STORE_KEYS.settings, storage: persistStorage, version: 1 },
  ),
);
