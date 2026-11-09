/**
 * Experiencia, niveles, monedas y continuidad flexible.
 *
 * Principio: motivar sin culpa. La continuidad se mide en semanas que cumplen una meta
 * de días elegida por la estudiante; perder un día nunca reinicia nada dentro de la semana,
 * y una semana sin meta solo pausa el contador (no borra recompensas ni progreso académico).
 */

export const XP_REWARDS = {
  lessonCompleted: 50,
  exerciseCorrect: 10,
  exerciseCorrectWithHints: 5,
  /** Intentarlo también cuenta. */
  exerciseAttempted: 2,
  assessmentPassed: 100,
  reviewCompleted: 20,
  missionCompleted: 30,
  elementDiscovered: 5,
  minigamePlayed: 15,
  labExperiment: 10,
} as const;

export type XpEvent = keyof typeof XP_REWARDS;

/** XP total necesaria para alcanzar el nivel `level` (nivel 1 = 0 XP). */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  // Curva suave: 100·(n−1)^1.5, redondeada a decenas.
  return Math.round((100 * (level - 1) ** 1.5) / 10) * 10;
}

export function levelFromXp(xp: number): { level: number; current: number; next: number; progress: number } {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  const current = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return { level, current, next, progress: (xp - current) / (next - current) };
}

/** Monedas = 1 por cada 5 XP ganada, redondeo hacia abajo. */
export const coinsForXp = (xp: number) => Math.floor(xp / 5);

/** Clave local del día (YYYY-MM-DD) en la zona horaria del dispositivo. */
export function dayKey(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Clave de semana: lunes de esa semana (YYYY-MM-DD). */
export function weekKey(ts: number): string {
  const d = new Date(ts);
  const dow = (d.getDay() + 6) % 7; // 0 = lunes
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - dow);
  return dayKey(d.getTime());
}

export interface Consistency {
  /** Días activos en la semana actual. */
  daysThisWeek: number;
  weeklyGoal: number;
  /** Semanas consecutivas (completadas) que cumplieron la meta. */
  weekStreak: number;
  /** Total histórico de días activos: nunca baja. */
  totalActiveDays: number;
}

/**
 * @param activeDays claves de día (YYYY-MM-DD) con actividad de estudio.
 * @param weeklyGoal días por semana elegidos (1–7).
 */
export function computeConsistency(activeDays: string[], weeklyGoal: number, now: number): Consistency {
  const unique = [...new Set(activeDays)];
  const perWeek = new Map<string, number>();
  for (const day of unique) {
    const [y, m, d] = day.split('-').map(Number);
    const wk = weekKey(new Date(y, m - 1, d, 12).getTime());
    perWeek.set(wk, (perWeek.get(wk) ?? 0) + 1);
  }
  const thisWeek = weekKey(now);
  let weekStreak = 0;
  const cursor = new Date(now);
  cursor.setHours(12, 0, 0, 0);
  cursor.setDate(cursor.getDate() - 7);
  while ((perWeek.get(weekKey(cursor.getTime())) ?? 0) >= weeklyGoal) {
    weekStreak++;
    cursor.setDate(cursor.getDate() - 7);
  }
  // La semana en curso suma en cuanto se cumple la meta, nunca resta antes de terminar.
  const daysThisWeek = perWeek.get(thisWeek) ?? 0;
  if (daysThisWeek >= weeklyGoal) weekStreak++;
  return { daysThisWeek, weeklyGoal, weekStreak, totalActiveDays: unique.length };
}
