import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DEFAULT_REMINDERS, type ReminderPrefs } from '@/core/notifications/schedule';
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
  /** Recordatorios locales de estudio y bienestar (desactivados por defecto). */
  reminders: ReminderPrefs;
  /** Sincronizar el progreso con la nube (requiere sesión iniciada). */
  cloudSync: boolean;
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
  reminders: DEFAULT_REMINDERS,
  cloudSync: false,
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
    {
      name: STORE_KEYS.settings,
      storage: persistStorage,
      version: 2,
      // v1 → v2: añade recordatorios y sincronización (desactivados).
      migrate: (persisted, version) => {
        const old = (persisted ?? {}) as Partial<SettingsState>;
        return (version < 2 ? { ...DEFAULT_SETTINGS, ...old } : old) as SettingsState;
      },
    },
  ),
);
