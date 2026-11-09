/**
 * Repetición espaciada: variante del algoritmo SM-2 (P. Woźniak, SuperMemo, 1987;
 * https://super-memory.com/english/ol/sm2.htm).
 *
 * Calidad de respuesta (0–5): 5 perfecto, 4 correcto con duda, 3 correcto con pistas,
 * 2 incorrecto pero cercano, 1 incorrecto, 0 en blanco.
 */

export interface ReviewCard {
  conceptId: string;
  /** Factor de facilidad (≥ 1.3). */
  ease: number;
  /** Intervalo actual en días. */
  intervalDays: number;
  repetitions: number;
  /** Fecha de próxima revisión (ms epoch). */
  dueAt: number;
}

const DAY = 24 * 60 * 60 * 1000;

export function newCard(conceptId: string, now: number): ReviewCard {
  return { conceptId, ease: 2.5, intervalDays: 0, repetitions: 0, dueAt: now };
}

export function review(card: ReviewCard, quality: number, now: number): ReviewCard {
  const qv = Math.max(0, Math.min(5, Math.round(quality)));
  let { ease, intervalDays, repetitions } = card;
  if (qv < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.round(intervalDays * ease);
  }
  ease = Math.max(1.3, ease + (0.1 - (5 - qv) * (0.08 + (5 - qv) * 0.02)));
  return { ...card, ease, intervalDays, repetitions, dueAt: now + intervalDays * DAY };
}

export function qualityFromAttempt(correct: boolean, hintsUsed: number): number {
  if (!correct) return hintsUsed > 0 ? 1 : 2;
  if (hintsUsed === 0) return 5;
  return hintsUsed === 1 ? 4 : 3;
}

export function dueCards(cards: ReviewCard[], now: number): ReviewCard[] {
  return cards.filter((c) => c.dueAt <= now).sort((a, b) => a.dueAt - b.dueAt);
}
