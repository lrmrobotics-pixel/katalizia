import { balanceEquation } from '../chemistry/balance';
import { parseFormula } from '../chemistry/formula';
import {
  checkCoefficients,
  checkMolecule,
  EQUATIONS,
  makeRushRound,
  MAX_COEFFICIENT,
  moleculePalette,
  MOLECULES,
  rushPoints,
  RUSH_POOL_MAX_Z,
  seededRng,
} from '../games';

describe('Periodic Rush', () => {
  it('genera 4 opciones únicas con la respuesta incluida', () => {
    const rand = seededRng(42);
    for (let i = 0; i < 200; i++) {
      const r = makeRushRound(rand, 'medio');
      expect(r.options).toHaveLength(4);
      expect(new Set(r.options).size).toBe(4);
      expect(r.options).toContain(r.answer);
      expect(r.element.z).toBeLessThanOrEqual(RUSH_POOL_MAX_Z.medio);
      expect(r.answer).toBe(r.mode === 'symbol' ? r.element.symbol : r.element.name);
    }
  });
  it('fallar no resta puntos y la racha da bonificación limitada', () => {
    expect(rushPoints(false, 9)).toBe(0);
    expect(rushPoints(true, 0)).toBe(10);
    expect(rushPoints(true, 50)).toBe(20);
  });
});

describe('Molecular Lab', () => {
  it('todas las fórmulas objetivo son válidas', () => {
    MOLECULES.forEach((m) => expect(Object.keys(parseFormula(m.formula)).length).toBeGreaterThan(0));
  });
  it('la paleta contiene todos los átomos necesarios', () => {
    const rand = seededRng(7);
    for (const m of MOLECULES) {
      const pal = moleculePalette(m, rand);
      Object.keys(parseFormula(m.formula)).forEach((el) => expect(pal).toContain(el));
    }
  });
  it('comprueba la composición y explica la diferencia', () => {
    expect(checkMolecule({ H: 2, O: 1 }, 'H2O').correct).toBe(true);
    const r = checkMolecule({ H: 1, O: 2 }, 'H2O');
    expect(r.correct).toBe(false);
    expect(r.diff).toEqual({ H: 1, O: -1 });
  });
});

describe('Balance Express', () => {
  it('cada ecuación tiene solución con coeficientes ≤ MAX_COEFFICIENT', () => {
    for (const eq of EQUATIONS) {
      const b = balanceEquation(eq);
      [...b.reactantCoefficients, ...b.productCoefficients].forEach((c) => expect(c).toBeLessThanOrEqual(MAX_COEFFICIENT));
      expect(checkCoefficients(eq, b.reactantCoefficients, b.productCoefficients)).toEqual({ balanced: true, minimal: true });
    }
  });
  it('acepta múltiplos pero indica que no son mínimos; rechaza ceros', () => {
    expect(checkCoefficients('H2 + O2 -> H2O', [4, 2], [4])).toEqual({ balanced: true, minimal: false });
    expect(checkCoefficients('H2 + O2 -> H2O', [1, 1], [1]).balanced).toBe(false);
    expect(checkCoefficients('H2 + O2 -> H2O', [0, 0], [0]).balanced).toBe(false);
  });
});
