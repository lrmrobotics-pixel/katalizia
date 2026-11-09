/**
 * Bienestar de la mascota sin culpa:
 * - Los indicadores bajan muy despacio y nunca de un piso amable (PET_FLOOR).
 * - Nunca afectan al progreso académico, XP, monedas ni inventario.
 * - Al volver tras días sin entrar, el gato saluda contento (no triste ni enfermo).
 */

export const PET_FLOOR = 40;
const DECAY_PER_HOUR = 1;

export interface PetStats {
  energy: number;
  joy: number;
  updatedAt: number;
}

const clamp = (v: number) => Math.max(PET_FLOOR, Math.min(100, v));

export function decay(stats: PetStats, now: number): PetStats {
  const hours = Math.max(0, (now - stats.updatedAt) / 3_600_000);
  return {
    energy: clamp(stats.energy - hours * DECAY_PER_HOUR),
    joy: clamp(stats.joy - hours * DECAY_PER_HOUR),
    updatedAt: now,
  };
}

export const feed = (s: PetStats, now: number): PetStats => {
  const d = decay(s, now);
  return { ...d, energy: Math.min(100, d.energy + 25) };
};

export const play = (s: PetStats, now: number): PetStats => {
  const d = decay(s, now);
  return { ...d, joy: Math.min(100, d.joy + 25) };
};

export type CatMood = 'feliz' | 'pensativo' | 'sorprendido' | 'confundido' | 'celebrando' | 'explicando' | 'durmiendo' | 'experimentando';

/** Estado de ánimo por defecto según bienestar; siempre positivo o neutro. */
export function idleMood(s: PetStats, hour: number): CatMood {
  if (hour >= 23 || hour < 6) return 'durmiendo';
  if (s.joy >= 70) return 'feliz';
  return 'pensativo';
}
