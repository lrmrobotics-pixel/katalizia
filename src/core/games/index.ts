/**
 * Lógica pura de los minijuegos (sin React). Los datos químicos vienen del núcleo
 * (`data/elements`, `core/chemistry`), así que las respuestas se comprueban, no se memorizan.
 */
import { isBalanced, parseEquation } from '@/core/chemistry/balance';
import { parseFormula, type Composition } from '@/core/chemistry/formula';
import { ELEMENTS, type ChemicalElement } from '@/data/elements';

export type Rng = () => number;

/** Generador determinista (para pruebas y para partidas reproducibles). */
export function seededRng(seed: number): Rng {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

function shuffle<T>(xs: T[], rand: Rng): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Periodic Rush ───────────────────────────────────────────────────────

export type RushLevel = 'facil' | 'medio' | 'dificil';

export const RUSH_POOL_MAX_Z: Record<RushLevel, number> = { facil: 20, medio: 36, dificil: 86 };
export const RUSH_SECONDS = 60;

export interface RushRound {
  element: ChemicalElement;
  /** 'symbol': se muestra el nombre y se elige el símbolo; 'name': al revés. */
  mode: 'symbol' | 'name';
  options: string[];
  answer: string;
}

export function makeRushRound(rand: Rng, level: RushLevel): RushRound {
  const pool = ELEMENTS.filter((e) => e.z <= RUSH_POOL_MAX_Z[level]);
  const element = pool[Math.floor(rand() * pool.length)];
  const mode = rand() < 0.5 ? 'symbol' : 'name';
  const key = (e: ChemicalElement) => (mode === 'symbol' ? e.symbol : e.name);
  // Distractores: preferir símbolos que empiecen igual (Ca/C/Cl…), que son la confusión típica.
  const similar = pool.filter((e) => e.z !== element.z && e.symbol[0] === element.symbol[0]);
  const others = shuffle(pool.filter((e) => e.z !== element.z && !similar.includes(e)), rand);
  const distractors = [...shuffle(similar, rand).slice(0, 2), ...others].slice(0, 3).map(key);
  return { element, mode, options: shuffle([key(element), ...distractors], rand), answer: key(element) };
}

/** Puntos por acierto: 10 + bonificación por racha (máx. +10). Fallar no resta. */
export function rushPoints(correct: boolean, streak: number): number {
  return correct ? 10 + Math.min(streak, 5) * 2 : 0;
}

// ── Molecular Lab ───────────────────────────────────────────────────────

export interface MoleculeTarget {
  formula: string;
  name: string;
  /** Dato breve y verificable sobre la molécula. */
  fact: string;
}

/** Moléculas objetivo. Datos: OpenStax Chemistry 2e y Biology 2e. */
export const MOLECULES: MoleculeTarget[] = [
  { formula: 'H2O', name: 'Agua', fact: 'Molécula angular (≈104,5°) que forma puentes de hidrógeno.' },
  { formula: 'CO2', name: 'Dióxido de carbono', fact: 'Lineal y apolar; producto de la respiración celular.' },
  { formula: 'O2', name: 'Oxígeno', fact: 'Aceptor final de electrones en la respiración celular.' },
  { formula: 'NH3', name: 'Amoníaco', fact: 'Piramidal; base débil de Brønsted-Lowry.' },
  { formula: 'CH4', name: 'Metano', fact: 'Tetraédrico (109,5°); principal componente del gas natural.' },
  { formula: 'NaCl', name: 'Cloruro de sodio', fact: 'Compuesto iónico; al 0,9 % m/v es el suero fisiológico.' },
  { formula: 'HCl', name: 'Cloruro de hidrógeno', fact: 'En agua es ácido clorhídrico, un ácido fuerte del jugo gástrico.' },
  { formula: 'C2H6O', name: 'Etanol', fact: 'Alcohol: tiene un grupo –OH y forma puentes de hidrógeno.' },
  { formula: 'H2O2', name: 'Peróxido de hidrógeno', fact: 'Agua oxigenada; se descompone en H₂O y O₂.' },
  { formula: 'C6H12O6', name: 'Glucosa', fact: 'Monosacárido; principal combustible de las células.' },
  { formula: 'H2SO4', name: 'Ácido sulfúrico', fact: 'Ácido fuerte; el azufre tiene número de oxidación +6.' },
  { formula: 'NaHCO3', name: 'Bicarbonato de sodio', fact: 'El ion HCO₃⁻ es clave en el amortiguador de la sangre.' },
];

/** Átomos disponibles en la paleta: los de la molécula + 2 distractores. */
export function moleculePalette(target: MoleculeTarget, rand: Rng): string[] {
  const needed = Object.keys(parseFormula(target.formula));
  const extras = shuffle(['H', 'C', 'N', 'O', 'Na', 'Cl', 'S', 'K'].filter((s) => !needed.includes(s)), rand).slice(0, 2);
  return shuffle([...needed, ...extras], rand);
}

export interface MoleculeCheck {
  correct: boolean;
  /** Diferencia por elemento: positivo = te faltan, negativo = te sobran. */
  diff: Composition;
}

export function checkMolecule(built: Composition, formula: string): MoleculeCheck {
  const target = parseFormula(formula);
  const diff: Composition = {};
  for (const el of new Set([...Object.keys(target), ...Object.keys(built)])) {
    const d = (target[el] ?? 0) - (built[el] ?? 0);
    if (d !== 0) diff[el] = d;
  }
  return { correct: Object.keys(diff).length === 0, diff };
}

// ── Balance Express ─────────────────────────────────────────────────────

/** Ecuaciones sin coeficientes, de menor a mayor dificultad. Fuente: OpenStax Chemistry 2e, 4.1. */
export const EQUATIONS = [
  'H2 + O2 -> H2O',
  'N2 + H2 -> NH3',
  'Na + Cl2 -> NaCl',
  'Mg + O2 -> MgO',
  'CH4 + O2 -> CO2 + H2O',
  'Al + O2 -> Al2O3',
  'H2O2 -> H2O + O2',
  'Fe + O2 -> Fe2O3',
  'C3H8 + O2 -> CO2 + H2O',
  'C6H12O6 + O2 -> CO2 + H2O',
];

export const MAX_COEFFICIENT = 9;

export function equationParts(eq: string) {
  const { reactants, products } = parseEquation(eq);
  return { reactants, products };
}

/** Correcto si está balanceada (cualquier múltiplo vale, pero se sugiere el mínimo). */
export function checkCoefficients(eq: string, rc: number[], pc: number[]): { balanced: boolean; minimal: boolean } {
  const { reactants, products } = parseEquation(eq);
  if ([...rc, ...pc].some((c) => !Number.isInteger(c) || c < 1)) return { balanced: false, minimal: false };
  const balanced = isBalanced(reactants, rc, products, pc);
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const g = [...rc, ...pc].reduce(gcd);
  return { balanced, minimal: balanced && g === 1 };
}
