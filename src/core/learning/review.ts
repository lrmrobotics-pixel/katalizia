/**
 * Construye una sesión de repaso adaptativo:
 * 1. Conceptos con tarjeta SM-2 vencida (repetición espaciada).
 * 2. Dentro de cada concepto, prioriza preguntas falladas antes (recuperación de errores)
 *    y después las menos practicadas.
 */
import type { ReviewCard } from './spacedRepetition';
import type { Attempt, Question, Unit } from './types';

export function dueConcepts(cards: Record<string, ReviewCard>, now: number): string[] {
  return Object.values(cards)
    .filter((c) => c.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt)
    .map((c) => c.conceptId);
}

export function buildReviewSession(
  units: Unit[],
  cards: Record<string, ReviewCard>,
  attempts: Attempt[],
  now: number,
  max = 8,
  perConcept = 2,
): Question[] {
  const due = dueConcepts(cards, now);
  const questions = units.flatMap((u) => u.questions);
  const stats = new Map<string, { wrong: number; total: number; last: number }>();
  for (const a of attempts) {
    const s = stats.get(a.questionId) ?? { wrong: 0, total: 0, last: 0 };
    s.total++;
    if (!a.correct) s.wrong++;
    s.last = Math.max(s.last, a.at);
    stats.set(a.questionId, s);
  }
  const session: Question[] = [];
  for (const conceptId of due) {
    const pool = questions
      .filter((q) => q.conceptId === conceptId)
      .sort((a, b) => {
        const sa = stats.get(a.id) ?? { wrong: 0, total: 0, last: 0 };
        const sb = stats.get(b.id) ?? { wrong: 0, total: 0, last: 0 };
        return sb.wrong - sa.wrong || sa.total - sb.total || sa.last - sb.last;
      });
    session.push(...pool.slice(0, perConcept));
    if (session.length >= max) break;
  }
  return session.slice(0, max);
}
