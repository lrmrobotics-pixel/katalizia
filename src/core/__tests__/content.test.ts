import { WORLDS, findUnit } from '@/content/curriculum';

import { grade, parseNumber } from '../learning/grading';
import type { Question } from '../learning/types';

const allUnits = WORLDS.flatMap((w) => w.modules.flatMap((m) => m.units));

describe('integridad del contenido', () => {
  it('el Mundo 1 tiene unidades', () => {
    expect(allUnits.length).toBeGreaterThanOrEqual(3);
  });

  it.each(allUnits.map((u) => [u.id, u] as const))('%s: estructura válida', (_id, u) => {
    const qIds = new Set(u.questions.map((q) => q.id));
    const conceptIds = new Set(u.concepts.map((c) => c.id));
    expect(qIds.size).toBe(u.questions.length);
    expect(u.sources.length).toBeGreaterThan(0);
    expect(u.objectives.length).toBeGreaterThan(0);
    // Los 10 pasos pedagógicos en orden.
    expect(u.steps.map((s) => s.kind)).toEqual([
      'intro', 'simple', 'everyday-example', 'visual', 'formal', 'worked-example',
      'guided-practice', 'independent-practice', 'quiz', 'error-review',
    ]);
    for (const s of u.steps) for (const id of s.questionIds ?? []) expect(qIds.has(id)).toBe(true);
    for (const q of u.questions) {
      expect(conceptIds.has(q.conceptId)).toBe(true);
      expect(q.hints.length).toBeGreaterThan(0);
      expect(q.explanation.length).toBeGreaterThan(10);
      if (q.type === 'single-choice' || q.type === 'multi-choice') {
        const opts = new Set(q.options.map((o) => o.id));
        q.correct.forEach((c) => expect(opts.has(c)).toBe(true));
        if (q.type === 'single-choice') expect(q.correct).toHaveLength(1);
        // Cada distractor explica su error conceptual.
        q.options.filter((o) => !q.correct.includes(o.id)).forEach((o) => expect(o.misconception).toBeTruthy());
      }
      if (q.type === 'match') {
        const rights = new Set(q.right.map((r) => r.id));
        q.left.forEach((l) => expect(rights.has(q.pairs[l.id])).toBe(true));
      }
      if (q.type === 'order') expect([...q.correctOrder].sort()).toEqual(q.items.map((i) => i.id).sort());
    }
    // Cada concepto se evalúa con al menos 2 tipos de evidencia (requisito de dominio).
    for (const c of u.concepts) {
      const kinds = new Set(u.questions.filter((q) => q.conceptId === c.id).map((q) => q.kind));
      expect(kinds.size).toBeGreaterThanOrEqual(2);
    }
  });

  it('los prerrequisitos apuntan a conceptos existentes', () => {
    const all = new Set(allUnits.flatMap((u) => u.concepts.map((c) => c.id)));
    allUnits.forEach((u) => u.concepts.forEach((c) => c.prerequisites.forEach((p) => expect(all.has(p)).toBe(true))));
  });

  it('las respuestas numéricas son coherentes con el núcleo de cálculo', () => {
    const q = findUnit('w1-u3-medida')!.unit.questions.find((x) => x.id === 'w1u3-q6')!;
    expect(q.type === 'numeric' && q.answer).toBeCloseTo(39.5 / 50.0, 3);
  });
});

describe('corrección', () => {
  const num: Question = {
    id: 'n', conceptId: 'c', type: 'numeric', kind: 'application', difficulty: 1, prompt: '', hints: [], explanation: '',
    answer: 0.25, tolerance: 0.01,
  };
  it('lee números con coma, punto, unidad y notación científica', () => {
    expect(parseNumber('0,25')).toBe(0.25);
    expect(parseNumber('0.25 g')).toBe(0.25);
    expect(parseNumber('2.5e-1')).toBeCloseTo(0.25);
    expect(parseNumber('2,5 × 10^-1')).toBeCloseTo(0.25);
    expect(parseNumber('abc')).toBeNull();
  });
  it('corrige numéricas con tolerancia y detecta error de potencia de 10', () => {
    expect(grade(num, { type: 'numeric', value: '0.251' }).correct).toBe(true);
    const r = grade(num, { type: 'numeric', value: '250' });
    expect(r.correct).toBe(false);
    expect(r.misconceptions[0]).toMatch(/potencia de 10/);
    expect(grade(num, { type: 'numeric', value: '' }).invalid).toBe(true);
  });
  it('corrige selección múltiple y devuelve errores conceptuales', () => {
    const q = findUnit('w1-u1-materia')!.unit.questions.find((x) => x.id === 'w1u1-q5')!;
    expect(grade(q, { type: 'multi-choice', selected: ['a', 'c', 'e'] }).correct).toBe(true);
    const r = grade(q, { type: 'multi-choice', selected: ['a', 'b'] });
    expect(r.correct).toBe(false);
    expect(r.misconceptions).toHaveLength(1);
  });
  it('corrige ordenar y emparejar', () => {
    const o = findUnit('w1-u1-materia')!.unit.questions.find((x) => x.id === 'w1u1-q7')!;
    expect(grade(o, { type: 'order', order: ['g', 'l', 's'] }).correct).toBe(true);
    expect(grade(o, { type: 'order', order: ['s', 'l', 'g'] }).correct).toBe(false);
    const m = findUnit('w1-u1-materia')!.unit.questions.find((x) => x.id === 'w1u1-q3')!;
    expect(grade(m, { type: 'match', pairs: { s: 'r1', l: 'r2', g: 'r3' } }).correct).toBe(true);
    expect(grade(m, { type: 'match', pairs: { s: 'r2', l: 'r1', g: 'r3' } }).correct).toBe(false);
  });
});
