import { WORLDS } from '@/content/curriculum';

import { buildReviewSession, dueConcepts } from '../learning/review';
import { newCard, review } from '../learning/spacedRepetition';
import type { Attempt } from '../learning/types';

const units = WORLDS.flatMap((w) => w.modules.flatMap((m) => m.units));
const T0 = Date.UTC(2026, 0, 5);
const DAY = 86_400_000;

describe('repaso espaciado', () => {
  it('sin tarjetas vencidas no hay repaso', () => {
    const cards = { 'w1.materia': review(newCard('w1.materia', T0), 5, T0) };
    expect(buildReviewSession(units, cards, [], T0)).toHaveLength(0);
  });

  it('incluye conceptos vencidos y prioriza preguntas falladas', () => {
    const cards = {
      'w1.materia': review(newCard('w1.materia', T0), 5, T0),
      'w1.cambios': review(newCard('w1.cambios', T0), 2, T0),
    };
    const attempts: Attempt[] = [
      { questionId: 'w1u1-q6', conceptId: 'w1.cambios', kind: 'problem', correct: false, hintsUsed: 0, at: T0 },
    ];
    expect(dueConcepts(cards, T0 + 2 * DAY).sort()).toEqual(['w1.cambios', 'w1.materia']);
    const s = buildReviewSession(units, cards, attempts, T0 + 2 * DAY);
    expect(s.length).toBe(4);
    const cambios = s.filter((q) => q.conceptId === 'w1.cambios');
    expect(cambios[0].id).toBe('w1u1-q6');
  });

  it('respeta el máximo de preguntas', () => {
    const cards = Object.fromEntries(
      units.flatMap((u) => u.concepts).map((c) => [c.id, newCard(c.id, T0)]),
    );
    expect(buildReviewSession(units, cards, [], T0, 5)).toHaveLength(5);
  });
});
