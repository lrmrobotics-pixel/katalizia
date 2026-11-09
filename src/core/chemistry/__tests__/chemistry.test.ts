import { bufferPH, classifyPH, strongAcidPH, strongBasePH, weakAcidPH } from '../acidBase';
import { balanceEquation, BalanceError, isBalanced } from '../balance';
import { fullConfiguration, shorthandConfiguration, valenceElectronsForGroup } from '../electronConfig';
import { FormulaError, massPercent, molarMass, parseFormula } from '../formula';
import { gridPosition, searchElements } from '../periodicLayout';
import {
  AVOGADRO,
  density,
  dilution,
  gramsToMoles,
  limitingReagent,
  molarity,
  molarityFromMass,
  molesToGrams,
  molesToParticles,
  percentYield,
} from '../stoichiometry';
import { celsiusToKelvin, convert, countSigFigs, formatScientific, toScientific } from '../units';
import { ELEMENTS } from '@/data/elements';

describe('tabla de elementos', () => {
  it('contiene 118 elementos con Z consecutivo y símbolos únicos', () => {
    expect(ELEMENTS).toHaveLength(118);
    ELEMENTS.forEach((e, i) => expect(e.z).toBe(i + 1));
    expect(new Set(ELEMENTS.map((e) => e.symbol)).size).toBe(118);
  });

  it('las masas crecen en general con Z (salvo inversiones conocidas)', () => {
    // Inversiones reales: Ar/K, Co/Ni, Te/I, Th/Pa, U/Np y entre transactínidos por isótopos.
    const inversions = ELEMENTS.slice(1).filter((e, i) => e.mass < ELEMENTS[i].mass).map((e) => e.symbol);
    expect(inversions).toEqual(expect.arrayContaining(['K', 'Ni', 'I']));
    expect(inversions.length).toBeLessThan(10);
  });

  it('no hay dos elementos en la misma celda de la tabla', () => {
    const cells = ELEMENTS.map((e) => {
      const p = gridPosition(e);
      return `${p.row}-${p.col}`;
    });
    expect(new Set(cells).size).toBe(118);
  });

  it('búsqueda por nombre sin tildes, símbolo y Z', () => {
    expect(searchElements('Fe')[0].name).toBe('Hierro');
    expect(searchElements('26')[0].symbol).toBe('Fe');
    expect(searchElements('oxigeno')[0].symbol).toBe('O');
    expect(searchElements('zzz')).toHaveLength(0);
  });
});

describe('fórmulas y masa molar', () => {
  it.each([
    ['H2O', 18.015],
    ['CO2', 44.009],
    ['NaCl', 58.44],
    ['C6H12O6', 180.156],
    ['Ca(OH)2', 74.092],
    ['H₂SO₄', 98.07],
    ['CuSO4·5H2O', 249.68],
    ['K4[Fe(CN)6]', 368.35],
  ])('M(%s) ≈ %f g/mol', (formula, expected) => {
    expect(molarMass(formula)).toBeCloseTo(expected, 1);
  });

  it('desglosa paréntesis e hidratos', () => {
    expect(parseFormula('Al2(SO4)3')).toEqual({ Al: 2, S: 3, O: 12 });
    expect(parseFormula('CuSO4·5H2O')).toEqual({ Cu: 1, S: 1, O: 9, H: 10 });
  });

  it('rechaza fórmulas inválidas', () => {
    expect(() => parseFormula('Xx2')).toThrow(FormulaError);
    expect(() => parseFormula('Ca(OH')).toThrow(FormulaError);
    expect(() => parseFormula('')).toThrow(FormulaError);
    expect(() => parseFormula('h2o')).toThrow(FormulaError);
  });

  it('composición porcentual del agua', () => {
    const p = massPercent('H2O');
    expect(p.O).toBeCloseTo(88.81, 1);
    expect(p.H + p.O).toBeCloseTo(100, 6);
  });
});

describe('mol y estequiometría', () => {
  it('gramos ↔ moles', () => {
    expect(gramsToMoles(36.03, 'H2O')).toBeCloseTo(2, 2);
    expect(molesToGrams(0.5, 'NaCl')).toBeCloseTo(29.22, 2);
    expect(molesToParticles(1)).toBe(AVOGADRO);
  });

  it('valida entradas', () => {
    expect(() => gramsToMoles(-1, 'H2O')).toThrow(RangeError);
    expect(() => molarity(1, 0)).toThrow(RangeError);
  });

  it('molaridad: 58.44 g de NaCl en 2 L → 0.5 M', () => {
    expect(molarityFromMass(58.44, 'NaCl', 2)).toBeCloseTo(0.5, 3);
  });

  it('dilución C1V1 = C2V2', () => {
    expect(dilution({ c1: 2, v1: 0.05, c2: null, v2: 0.5 })).toBeCloseTo(0.2);
    expect(dilution({ c1: 12, v1: null, c2: 1, v2: 1 })).toBeCloseTo(1 / 12);
    expect(() => dilution({ c1: null, v1: null, c2: 1, v2: 1 })).toThrow();
  });

  it('densidad', () => {
    expect(density(19.3, 1)).toBe(19.3);
  });

  it('reactivo limitante: 2H2 + O2 → 2H2O con 4 g H2 y 16 g O2', () => {
    const r = limitingReagent('H2 + O2 -> H2O', { H2: 4, O2: 16 });
    expect(r.limiting).toBe('O2');
    expect(r.theoreticalGrams.H2O).toBeCloseTo(18.01, 1);
    expect(r.excessGrams.H2).toBeCloseTo(2.0, 1);
  });

  it('rendimiento porcentual', () => {
    expect(percentYield(15, 20)).toBe(75);
    expect(() => percentYield(1, 0)).toThrow(RangeError);
  });
});

describe('balanceo', () => {
  it.each([
    ['H2 + O2 -> H2O', '2H2 + O2 → 2H2O'],
    ['CH4 + O2 -> CO2 + H2O', 'CH4 + 2O2 → CO2 + 2H2O'],
    ['Fe + O2 -> Fe2O3', '4Fe + 3O2 → 2Fe2O3'],
    ['C3H8 + O2 → CO2 + H2O', 'C3H8 + 5O2 → 3CO2 + 4H2O'],
    ['Al + HCl = AlCl3 + H2', '2Al + 6HCl → 2AlCl3 + 3H2'],
    ['C6H12O6 + O2 -> CO2 + H2O', 'C6H12O6 + 6O2 → 6CO2 + 6H2O'],
    ['KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2', '2KMnO4 + 16HCl → 2KCl + 2MnCl2 + 8H2O + 5Cl2'],
  ])('%s', (input, expected) => {
    expect(balanceEquation(input).text).toBe(expected);
  });

  it('ignora coeficientes escritos por la estudiante', () => {
    expect(balanceEquation('3H2 + 7O2 -> H2O').text).toBe('2H2 + O2 → 2H2O');
  });

  it('detecta ecuaciones imposibles', () => {
    expect(() => balanceEquation('H2 -> O2')).toThrow(BalanceError);
    expect(() => balanceEquation('H2 + O2')).toThrow(BalanceError);
  });

  it('verifica coeficientes propuestos', () => {
    expect(isBalanced(['H2', 'O2'], [2, 1], ['H2O'], [2])).toBe(true);
    expect(isBalanced(['H2', 'O2'], [1, 1], ['H2O'], [1])).toBe(false);
  });
});

describe('pH', () => {
  it('ácido fuerte 0.01 M → pH 2', () => {
    expect(strongAcidPH(0.01)).toBeCloseTo(2, 4);
  });
  it('ácido fuerte muy diluido no da pH > 7', () => {
    expect(strongAcidPH(1e-8)).toBeLessThan(7);
    expect(strongAcidPH(1e-8)).toBeCloseTo(6.98, 2);
  });
  it('base fuerte 0.001 M → pH 11', () => {
    expect(strongBasePH(0.001)).toBeCloseTo(11, 4);
  });
  it('ácido acético 0.1 M (Ka 1.8e-5) → pH ≈ 2.88 (cuadrática exacta)', () => {
    expect(weakAcidPH(0.1, 1.8e-5)).toBeCloseTo(2.875, 2);
  });
  it('amortiguador equimolar → pH = pKa', () => {
    expect(bufferPH(4.74, 0.1, 0.1)).toBeCloseTo(4.74, 6);
    expect(bufferPH(6.1, 24, 1.2)).toBeCloseTo(7.4, 1); // bicarbonato sanguíneo
  });
  it('clasifica', () => {
    expect(classifyPH(3)).toBe('ácida');
    expect(classifyPH(7)).toBe('neutra');
    expect(classifyPH(9)).toBe('básica');
  });
});

describe('unidades y notación científica', () => {
  it('convierte', () => {
    expect(convert(250, 'mL', 'L')).toBeCloseTo(0.25);
    expect(convert(1.5, 'kg', 'g')).toBeCloseTo(1500);
    expect(convert(1, 'cm3', 'mL')).toBeCloseTo(1);
    expect(convert(2, 'h', 'min')).toBeCloseTo(120);
    expect(convert(5, 'µg', 'mg')).toBeCloseTo(0.005);
    expect(() => convert(1, 'g', 'L')).toThrow();
  });
  it('temperatura', () => {
    expect(celsiusToKelvin(25)).toBeCloseTo(298.15);
  });
  it('notación científica', () => {
    expect(toScientific(1000)).toEqual({ mantissa: 1, exponent: 3 });
    expect(formatScientific(0.000123, 2)).toBe('1.2 × 10⁻⁴');
    expect(formatScientific(6.02214076e23, 3)).toBe('6.02 × 10²³');
  });
  it('cifras significativas', () => {
    expect(countSigFigs('0.00450')).toBe(3);
    expect(countSigFigs('1500')).toBe(2);
    expect(countSigFigs('1500.')).toBe(4);
    expect(countSigFigs('101')).toBe(3);
  });
});

describe('configuración electrónica', () => {
  it.each([
    [1, '1s1'],
    [8, '[He] 2s2 2p4'],
    [11, '[Ne] 3s1'],
    [24, '[Ar] 3d5 4s1'],
    [26, '[Ar] 3d6 4s2'],
    [29, '[Ar] 3d10 4s1'],
    [35, '[Ar] 3d10 4s2 4p5'],
    [46, '[Kr] 4d10'],
    [57, '[Xe] 5d1 6s2'],
    [79, '[Xe] 4f14 5d10 6s1'],
    [92, '[Rn] 5f3 6d1 7s2'],
  ])('Z=%i → %s', (z, expected) => {
    expect(shorthandConfiguration(z)).toBe(expected);
  });

  it('la suma de electrones es Z para los 118', () => {
    for (let z = 1; z <= 118; z++) {
      const total = fullConfiguration(z)
        .split(' ')
        .reduce((s, o) => s + Number(o.slice(2)), 0);
      expect(total).toBe(z);
    }
  });

  it('electrones de valencia de grupos principales', () => {
    expect(valenceElectronsForGroup(6, 14)).toBe(4);
    expect(valenceElectronsForGroup(2, 18)).toBe(2);
    expect(valenceElectronsForGroup(10, 18)).toBe(8);
    expect(valenceElectronsForGroup(26, 8)).toBeNull();
  });
});
