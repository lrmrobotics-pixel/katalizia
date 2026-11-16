/**
 * Mensajes de Kata según el estado real de la estudiante. Nunca culpan ni presionan:
 * si no hay nada pendiente, invitan a explorar; descansar siempre está bien.
 */
import type { CatMood } from './wellbeing';

export interface GreetingInput {
  hour: number;
  diagnosticDone: boolean;
  dueReviews: number;
  missionsLeft: number;
  daysThisWeek: number;
  weeklyGoal: number;
  /** Días desde la última actividad (0 = hoy, null = nunca). */
  daysAway: number | null;
}

export function timeGreeting(hour: number): string {
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function kataMessage(g: GreetingInput): { text: string; mood: CatMood } {
  if (g.hour >= 23 || g.hour < 6) return { text: 'Es tarde: dormir también consolida lo aprendido. Mañana seguimos.', mood: 'durmiendo' };
  if (!g.diagnosticDone) return { text: 'Hagamos un diagnóstico rápido para trazar tu ruta. Sin nota, lo prometo.', mood: 'curioso' };
  if (g.daysAway !== null && g.daysAway >= 3) return { text: '¡Qué alegría verte! Todo tu progreso sigue aquí, intacto.', mood: 'celebrando' };
  if (g.dueReviews > 0) {
    return {
      text: `Tienes ${g.dueReviews} concepto${g.dueReviews === 1 ? '' : 's'} listo${g.dueReviews === 1 ? '' : 's'} para repasar: es el momento justo para fijarlo${g.dueReviews === 1 ? '' : 's'}.`,
      mood: 'pensativo',
    };
  }
  if (g.daysThisWeek >= g.weeklyGoal) return { text: '¡Meta semanal cumplida! Lo que hagas hoy es pura curiosidad.', mood: 'celebrando' };
  if (g.missionsLeft > 0) return { text: `Te quedan ${g.missionsLeft} misión${g.missionsLeft === 1 ? '' : 'es'} de hoy. ¿Empezamos por una?`, mood: 'explicando' };
  return { text: 'Misiones del día completas. ¿Un experimento en el laboratorio?', mood: 'experimentando' };
}

/** Dificultad orientativa del mundo según su posición en la ruta (1–12). */
export function worldDifficulty(order: number): 'Básico' | 'Intermedio' | 'Avanzado' {
  if (order <= 4) return 'Básico';
  if (order <= 8) return 'Intermedio';
  return 'Avanzado';
}
