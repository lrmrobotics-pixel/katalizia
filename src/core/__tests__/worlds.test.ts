/** Comprueba que las respuestas numéricas de los mundos 2–12 coinciden con el núcleo de cálculo. */
import { findUnit, WORLDS } from '@/content/curriculum';

import { balanceEquation } from '../chemistry/balance';
import { strongAcidPH, strongBasePH, bufferPH } from '../chemistry/acidBase';
import { molarMass } from '../chemistry/formula';
import { AVOGADRO, dilution } from '../chemistry/stoichiometry';
import { grade, parseNumber } from '../learning/grading';
import type { NumericQuestion } from '../learning/types';

const numeric = (unitId: string, qId: string) => {
  const q = findUnit(unitId)!.unit.questions.find((x) => x.id === qId)!;
  if (q.type !== 'numeric') throw new Error(`${qId} no es numérica`);
  return q as NumericQuestion;
};

/** La respuesta guardada debe aceptar el valor calculado con el núcleo. */
const expectAccepts = (q: NumericQuestion, computed: number) =>
  expect(grade(q, { type: 'numeric', value: String(computed) }).correct).toBe(true);

describe('mundos 2–12', () => {
  it('todos los mundos tienen contenido', () => {
    WORLDS.forEach((w) => expect(w.modules.flatMap((m) => m.units).length).toBeGreaterThan(0));
  });

  it('ids de pregunta únicos en todo el currículo', () => {
    const ids = WORLDS.flatMap((w) => w.modules.flatMap((m) => m.units.flatMap((u) => u.questions.map((q) => q.id))));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada concepto tiene al menos 3 preguntas (mínimo de intentos para dominio)', () => {
    for (const w of WORLDS.slice(1))
      for (const u of w.modules.flatMap((m) => m.units))
        for (const c of u.concepts) expect(u.questions.filter((q) => q.conceptId === c.id).length).toBeGreaterThanOrEqual(3);
  });

  it('Mundo 2: masa atómica promedio del cloro', () => {
    expectAccepts(numeric('w2-u1-particulas', 'w2u1-q6'), 0.7576 * 34.969 + 0.2424 * 36.966);
  });

  it('Mundo 5: coeficientes de balanceo', () => {
    expect(balanceEquation('Al + O2 -> Al2O3').text).toBe('4Al + 3O2 → 2Al2O3');
    expect(balanceEquation('C6H12O6 + O2 -> CO2 + H2O').text).toBe('C6H12O6 + 6O2 → 6CO2 + 6H2O');
    expect(numeric('w5-u1-ecuaciones', 'w5u1-q5').answer).toBe(3);
    expect(numeric('w5-u1-ecuaciones', 'w5u1-q6').answer).toBe(6);
  });

  it('Mundo 6: masas molares, moles y diluciones', () => {
    expectAccepts(numeric('w6-u1-mol', 'w6u1-q4'), molarMass('NaCl'));
    expectAccepts(numeric('w6-u1-mol', 'w6u1-q5'), molarMass('C6H12O6'));
    expectAccepts(numeric('w6-u1-mol', 'w6u1-q6'), 117 / molarMass('NaCl'));
    expectAccepts(numeric('w6-u1-mol', 'w6u1-q1'), 0.5 * AVOGADRO);
    expectAccepts(numeric('w6-u2-estequiometria', 'w6u2-q5'), 5.844 / molarMass('NaCl') / 0.5);
    expectAccepts(numeric('w6-u2-estequiometria', 'w6u2-q6'), dilution({ c1: 1, v1: null, c2: 0.2, v2: 250 }));
  });

  it('Mundo 7: pH', () => {
    expectAccepts(numeric('w7-u2-ph', 'w7u2-q1'), strongAcidPH(0.01));
    expectAccepts(numeric('w7-u2-ph', 'w7u2-q2'), strongBasePH(0.001));
    expectAccepts(numeric('w7-u2-ph', 'w7u2-q6'), bufferPH(4.76, 0.1, 0.1));
  });

  it('Mundo 11: osmolaridad y pH sanguíneo', () => {
    expectAccepts(numeric('w11-u1-liquidos', 'w11u1-q2'), (9 / molarMass('NaCl')) * 2 * 1000);
    expectAccepts(numeric('w11-u2-sangre-farmacos', 'w11u2-q3'), bufferPH(6.1, 20, 1));
  });

  it('Mundo 12: problemas integradores', () => {
    expectAccepts(numeric('w12-u1-datos', 'w12u1-q4'), 0.1 * 0.25 * molarMass('NaOH'));
    expectAccepts(numeric('w12-u1-datos', 'w12u1-q5'), (16.0 / molarMass('CH4')) * molarMass('CO2'));
    expectAccepts(numeric('w12-u1-datos', 'w12u1-q6'), (0.4 / molarMass('NaOH') / 0.2) * 1000);
    expectAccepts(numeric('w12-u2-casos', 'w12u2-q1'), 900 / molarMass('C6H12O6'));
  });

  it('acepta signo menos tipográfico y unidades con %', () => {
    expect(parseNumber('−40,4')).toBeCloseTo(-40.4);
    expect(parseNumber('80 %')).toBe(80);
  });
});
