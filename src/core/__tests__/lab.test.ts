import {
  ATOM_CHALLENGES,
  atomInfo,
  BUILD_TARGETS,
  checkAtom,
  cycleBond,
  evaluateMolecule,
  hillFormula,
  indicatorColor,
  INDICATORS,
  rateRatio,
  relativeSpeed,
  shellsFor,
  type BuildAtom,
  type Bond,
} from '@/core/lab';
import { parseFormula } from '@/core/chemistry/formula';

describe('constructor de átomos', () => {
  it('identifica elemento, número másico y carga', () => {
    const c = atomInfo(6, 6, 6);
    expect(c.element?.symbol).toBe('C');
    expect(c.massNumber).toBe(12);
    expect(c.kind).toBe('átomo neutro');
    expect(c.notation).toBe('¹²C');
    const na = atomInfo(11, 12, 10);
    expect(na.kind).toBe('catión');
    expect(na.notation).toBe('²³Na⁺');
    expect(atomInfo(8, 8, 10).notation).toBe('¹⁶O²⁻');
    expect(atomInfo(0, 2, 0).kind).toBe('vacío');
  });

  it('reparte electrones en capas como en el libro (2, 8, 8, 2…)', () => {
    expect(shellsFor(11)).toEqual([2, 8, 1]);
    expect(shellsFor(18)).toEqual([2, 8, 8]);
    expect(shellsFor(20)).toEqual([2, 8, 8, 2]);
    expect(shellsFor(26)).toEqual([2, 8, 14, 2]); // Fe: [Ar] 3d6 4s2
    expect(shellsFor(0)).toEqual([]);
  });

  it('los retos tienen solución consistente y la comprobación da pistas', () => {
    for (const ch of ATOM_CHALLENGES) {
      expect(checkAtom(ch, ch.protons, ch.neutrons, ch.electrons).correct).toBe(true);
      expect(atomInfo(ch.protons, ch.neutrons, ch.electrons).element).not.toBeNull();
    }
    const r = checkAtom(ATOM_CHALLENGES[2], 6, 6, 7);
    expect(r.correct).toBe(false);
    expect(r.hints).toHaveLength(1);
  });
});

describe('constructor de moléculas', () => {
  const at = (id: number, el: string): BuildAtom => ({ id, el, x: 0, y: 0 });

  it('construye agua con dos enlaces simples', () => {
    const atoms = [at(1, 'O'), at(2, 'H'), at(3, 'H')];
    let bonds: Bond[] = [];
    bonds = cycleBond(atoms, bonds, 1, 2);
    bonds = cycleBond(atoms, bonds, 1, 3);
    const s = evaluateMolecule(atoms, bonds);
    expect(s.kind).toBe('valid');
    if (s.kind === 'valid') expect(s.known?.name).toBe('Agua');
  });

  it('no permite superar la valencia (el H solo forma un enlace)', () => {
    const atoms = [at(1, 'H'), at(2, 'H'), at(3, 'H')];
    let bonds = cycleBond(atoms, [], 1, 2);
    bonds = cycleBond(atoms, bonds, 1, 3);
    expect(bonds).toHaveLength(1);
    // Volver a tocar H–H: el doble enlace no cabe, así que se quita.
    expect(cycleBond(atoms, bonds, 1, 2)).toHaveLength(0);
  });

  it('CO₂ necesita dos dobles enlaces y N₂ un triple', () => {
    const co2 = [at(1, 'C'), at(2, 'O'), at(3, 'O')];
    let b = cycleBond(co2, [], 1, 2);
    b = cycleBond(co2, b, 1, 2);
    b = cycleBond(co2, b, 1, 3);
    expect(evaluateMolecule(co2, b).kind).toBe('incomplete');
    b = cycleBond(co2, b, 1, 3);
    expect(evaluateMolecule(co2, b)).toMatchObject({ kind: 'valid', formula: 'CO2' });
    const n2 = [at(1, 'N'), at(2, 'N')];
    let c = cycleBond(n2, [], 1, 2);
    c = cycleBond(n2, c, 1, 2);
    c = cycleBond(n2, c, 1, 2);
    expect(c[0].order).toBe(3);
    expect(evaluateMolecule(n2, c).kind).toBe('valid');
  });

  it('dos moléculas separadas no cuentan como una', () => {
    const atoms = [at(1, 'H'), at(2, 'H'), at(3, 'H'), at(4, 'H')];
    let b = cycleBond(atoms, [], 1, 2);
    b = cycleBond(atoms, b, 3, 4);
    expect(evaluateMolecule(atoms, b).kind).toBe('disconnected');
  });

  it('la fórmula de Hill coincide con la de los objetivos', () => {
    expect(hillFormula([at(1, 'H'), at(2, 'N'), at(3, 'H'), at(4, 'H')])).toBe('H3N');
    expect(hillFormula([at(1, 'O'), at(2, 'C'), at(3, 'H')])).toBe('CHO');
    for (const t of BUILD_TARGETS) expect(() => parseFormula(t.formula)).not.toThrow();
  });
});

describe('indicadores y energía', () => {
  it('cada indicador cambia de color solo en su intervalo de viraje', () => {
    for (const ind of INDICATORS) {
      expect(indicatorColor(ind, ind.from - 1).zone).toBe('ácida');
      expect(indicatorColor(ind, (ind.from + ind.to) / 2).zone).toBe('viraje');
      expect(indicatorColor(ind, ind.to + 1).zone).toBe('básica');
      expect(indicatorColor(ind, 0).color).toBe(indicatorColor(ind, ind.from - 0.5).color);
    }
    const fenol = INDICATORS.find((i) => i.id === 'fenolftaleina')!;
    expect(indicatorColor(fenol, 7).opacity).toBeLessThan(0.2); // incolora en medio neutro
  });

  it('Arrhenius: con Ea ≈ 50 kJ/mol, +10 °C casi duplica la velocidad', () => {
    const r = rateRatio(50, 308);
    expect(r).toBeGreaterThan(1.8);
    expect(r).toBeLessThan(2.1);
    expect(rateRatio(80, 298)).toBeCloseTo(1);
    // A mayor energía de activación, la temperatura influye más.
    expect(rateRatio(100, 320)).toBeGreaterThan(rateRatio(40, 320));
  });

  it('la rapidez molecular crece con la raíz de T', () => {
    expect(relativeSpeed(4 * 298)).toBeCloseTo(2);
  });
});
