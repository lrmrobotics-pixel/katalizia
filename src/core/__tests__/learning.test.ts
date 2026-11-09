import { computeConsistency, coinsForXp, dayKey, levelFromXp, xpForLevel } from '../gamification/progress';
import { bktUpdate, computeMastery, DEFAULT_MASTERY } from '../learning/mastery';
import { dueCards, newCard, qualityFromAttempt, review } from '../learning/spacedRepetition';
import type { Attempt, World } from '../learning/types';
import { isUnitUnlocked, isWorldUnlocked } from '../learning/unlock';
import { decay, feed, PET_FLOOR } from '../pet/wellbeing';
import { WORLDS } from '@/content/curriculum';

const H = 3_600_000;
const DAY = 24 * H;
const T0 = new Date(2026, 0, 5, 10).getTime(); // lunes

const att = (over: Partial<Attempt>): Attempt => ({
  questionId: 'q',
  conceptId: 'c1',
  kind: 'concept',
  correct: true,
  hintsUsed: 0,
  at: T0,
  ...over,
});

describe('BKT', () => {
  it('sube con aciertos y baja con errores', () => {
    expect(bktUpdate(0.3, true)).toBeGreaterThan(0.3);
    expect(bktUpdate(0.9, false)).toBeLessThan(0.9);
  });
  it('se mantiene en [0, 1]', () => {
    let p = 0.1;
    for (let i = 0; i < 50; i++) p = bktUpdate(p, true);
    expect(p).toBeLessThanOrEqual(1);
    expect(p).toBeGreaterThan(0.99);
  });
});

describe('dominio', () => {
  it('una sola respuesta correcta no da dominio', () => {
    const m = computeMastery('c1', [att({})]);
    expect(m.status).toBe('learning');
  });

  it('muchos aciertos de un solo tipo no bastan (requiere variedad)', () => {
    const list = Array.from({ length: 8 }, (_, i) => att({ at: T0 + i * DAY }));
    expect(computeMastery('c1', list).status).not.toBe('mastered');
  });

  it('aciertos variados el mismo día → pendiente de retención', () => {
    const list = [
      att({ at: T0 }),
      att({ at: T0 + 1, kind: 'application' }),
      att({ at: T0 + 2 }),
      att({ at: T0 + 3, kind: 'application' }),
      att({ at: T0 + 4, kind: 'problem' }),
    ];
    expect(computeMastery('c1', list).status).toBe('needs-retention');
  });

  it('con retención espaciada → dominado', () => {
    const list = [
      att({ at: T0 }),
      att({ at: T0 + 1, kind: 'application' }),
      att({ at: T0 + 2 }),
      att({ at: T0 + 3, kind: 'application' }),
      att({ at: T0 + DAY, kind: 'retention' }),
    ];
    const m = computeMastery('c1', list);
    expect(m.status).toBe('mastered');
    expect(m.retentionPassed).toBe(true);
  });

  it('aciertos con pistas pesan menos', () => {
    const clean = computeMastery('c1', [att({}), att({ at: T0 + 1 })]).pKnown;
    const hinted = computeMastery('c1', [att({ hintsUsed: 2 }), att({ at: T0 + 1, hintsUsed: 2 })]).pKnown;
    expect(hinted).toBeLessThan(clean);
  });

  it('el umbral es configurable', () => {
    const list = [att({}), att({ at: T0 + 1, kind: 'application' }), att({ at: T0 + 2 }), att({ at: T0 + 3, kind: 'application' })];
    const strict = computeMastery('c1', list, { ...DEFAULT_MASTERY, threshold: 0.999 });
    expect(strict.status).toBe('learning');
  });
});

describe('repetición espaciada', () => {
  it('intervalos 1 → 6 → ~15 días con respuestas perfectas', () => {
    let c = newCard('c1', T0);
    c = review(c, 5, T0);
    expect(c.intervalDays).toBe(1);
    c = review(c, 5, T0);
    expect(c.intervalDays).toBe(6);
    c = review(c, 5, T0);
    expect(c.intervalDays).toBeGreaterThanOrEqual(15);
  });
  it('un fallo reinicia el intervalo y la facilidad nunca baja de 1.3', () => {
    let c = newCard('c1', T0);
    for (let i = 0; i < 10; i++) c = review(c, 0, T0);
    expect(c.intervalDays).toBe(1);
    expect(c.ease).toBeGreaterThanOrEqual(1.3);
  });
  it('calidad según pistas y tarjetas pendientes', () => {
    expect(qualityFromAttempt(true, 0)).toBe(5);
    expect(qualityFromAttempt(false, 0)).toBe(2);
    const a = review(newCard('a', T0), 5, T0);
    expect(dueCards([a], T0)).toHaveLength(0);
    expect(dueCards([a], T0 + 2 * DAY)).toHaveLength(1);
  });
});

describe('desbloqueo', () => {
  it('solo el Mundo 1 está abierto al empezar', () => {
    const open = WORLDS.filter((w) => isWorldUnlocked(w, WORLDS, () => undefined));
    expect(open.map((w) => w.id)).toEqual(['m1-materia']);
  });

  it('un mundo se abre cuando el requerido está dominado', () => {
    const a: World = {
      id: 'a', order: 1, title: '', subtitle: '', color: '', objectives: [], requires: [],
      modules: [{ id: 'mod', title: '', units: [{ id: 'u', title: '', objectives: [], steps: [], questions: [], sources: [], concepts: [{ id: 'x', name: '', prerequisites: [] }] }] }],
    };
    const b: World = { ...a, id: 'b', requires: ['a'] };
    const mastered = computeMastery('x', [
      att({ conceptId: 'x' }), att({ conceptId: 'x', at: T0 + 1, kind: 'application' }),
      att({ conceptId: 'x', at: T0 + 2 }), att({ conceptId: 'x', at: T0 + 3, kind: 'application' }),
      att({ conceptId: 'x', at: T0 + DAY }),
    ]);
    expect(isWorldUnlocked(b, [a, b], () => undefined)).toBe(false);
    expect(isWorldUnlocked(b, [a, b], (id) => (id === 'x' ? mastered : undefined))).toBe(true);
  });

  it('una unidad exige sus prerrequisitos externos', () => {
    const unit = { id: 'u2', title: '', objectives: [], steps: [], questions: [], sources: [], concepts: [{ id: 'y', name: '', prerequisites: ['x'] }] };
    expect(isUnitUnlocked(unit, () => undefined)).toBe(false);
  });
});

describe('gamificación', () => {
  it('niveles y monedas', () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(100);
    expect(levelFromXp(0).level).toBe(1);
    expect(levelFromXp(100).level).toBe(2);
    expect(levelFromXp(99).level).toBe(1);
    expect(coinsForXp(14)).toBe(2);
  });

  it('la continuidad semanal no castiga días sueltos', () => {
    const days = [0, 2, 4, 7, 9, 11, 14].map((d) => dayKey(T0 + d * DAY)); // 3 semanas
    const c = computeConsistency(days, 3, T0 + 14 * DAY);
    expect(c.weekStreak).toBe(2); // semanas 1 y 2 cumplidas; la actual aún en curso
    expect(c.daysThisWeek).toBe(1);
    expect(c.totalActiveDays).toBe(7);
  });

  it('una semana sin meta pausa la racha pero no borra días totales', () => {
    const days = [0, 1, 2, 14].map((d) => dayKey(T0 + d * DAY));
    const c = computeConsistency(days, 3, T0 + 14 * DAY);
    expect(c.weekStreak).toBe(0);
    expect(c.totalActiveDays).toBe(4);
  });
});

describe('mascota sin culpa', () => {
  it('nunca baja del piso aunque pasen meses', () => {
    const s = decay({ energy: 100, joy: 100, updatedAt: T0 }, T0 + 90 * DAY);
    expect(s.energy).toBe(PET_FLOOR);
    expect(s.joy).toBe(PET_FLOOR);
  });
  it('alimentar sube energía sin pasar de 100', () => {
    expect(feed({ energy: 90, joy: 50, updatedAt: T0 }, T0).energy).toBe(100);
  });
});
