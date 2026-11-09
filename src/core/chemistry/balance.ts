/**
 * Balanceo de ecuaciones químicas por el método algebraico (espacio nulo de la
 * matriz de composición), con aritmética racional exacta (BigInt).
 *
 * Referencia del método: OpenStax Chemistry 2e §4.1 (balanceo por conservación de átomos);
 * la resolución matricial es el método algebraico estándar de álgebra lineal.
 * Limitación: no maneja cargas iónicas ni ecuaciones con más de un grado de libertad.
 */
import { parseFormula, type Composition } from './formula';

export class BalanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BalanceError';
  }
}

export interface ParsedEquation {
  reactants: string[];
  products: string[];
}

export interface BalancedEquation extends ParsedEquation {
  reactantCoefficients: number[];
  productCoefficients: number[];
  text: string;
}

const ARROW = /\s*(?:->|→|=>|=|⟶)\s*/;

export function parseEquation(equation: string): ParsedEquation {
  const sides = equation.split(ARROW);
  if (sides.length !== 2) throw new BalanceError('La ecuación necesita una flecha (->)');
  const split = (side: string) =>
    side
      .split(/\s+\+\s+|\+/)
      .map((s) => s.trim())
      .filter(Boolean);
  const reactants = split(sides[0]);
  const products = split(sides[1]);
  if (!reactants.length || !products.length) {
    throw new BalanceError('Faltan reactivos o productos');
  }
  return { reactants, products };
}

// --- Racionales exactos ---
type Q = { n: bigint; d: bigint };
const abs = (a: bigint) => (a < 0n ? -a : a);
const gcd = (a: bigint, b: bigint): bigint => {
  a = abs(a);
  b = abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
};
const q = (n: bigint, d: bigint = 1n): Q => {
  if (d === 0n) throw new Error('División por cero');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || 1n;
  return { n: n / g, d: d / g };
};
const sub = (a: Q, b: Q) => q(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a: Q, b: Q) => q(a.n * b.n, a.d * b.d);
const div = (a: Q, b: Q) => q(a.n * b.d, a.d * b.n);

function stripCoefficient(species: string): string {
  return species.replace(/^\d+\s*/, '');
}

export function balanceEquation(equation: string): BalancedEquation {
  const parsed = parseEquation(equation);
  const reactants = parsed.reactants.map(stripCoefficient);
  const products = parsed.products.map(stripCoefficient);
  const species = [...reactants, ...products];
  const comps: Composition[] = species.map((s) => parseFormula(s));
  const elements = [...new Set(comps.flatMap((c) => Object.keys(c)))];

  // Verificación: cada elemento debe aparecer en ambos lados.
  for (const el of elements) {
    const left = comps.slice(0, reactants.length).some((c) => c[el]);
    const right = comps.slice(reactants.length).some((c) => c[el]);
    if (!left || !right) throw new BalanceError(`El elemento ${el} no aparece en ambos lados`);
  }

  const cols = species.length;
  const m: Q[][] = elements.map((el) =>
    comps.map((c, j) => q(BigInt((c[el] ?? 0) * (j < reactants.length ? 1 : -1)))),
  );

  // Eliminación de Gauss-Jordan → forma escalonada reducida.
  const pivotCols: number[] = [];
  let row = 0;
  for (let col = 0; col < cols && row < m.length; col++) {
    const p = m.findIndex((r, i) => i >= row && r[col].n !== 0n);
    if (p === -1) continue;
    [m[row], m[p]] = [m[p], m[row]];
    const pv = m[row][col];
    m[row] = m[row].map((x) => div(x, pv));
    for (let i = 0; i < m.length; i++) {
      if (i !== row && m[i][col].n !== 0n) {
        const f = m[i][col];
        m[i] = m[i].map((x, j) => sub(x, mul(f, m[row][j])));
      }
    }
    pivotCols.push(col);
    row++;
  }

  const free = [...Array(cols).keys()].filter((c) => !pivotCols.includes(c));
  if (free.length !== 1) {
    throw new BalanceError(
      free.length === 0
        ? 'No existe un balanceo con coeficientes positivos'
        : 'La ecuación admite varios balanceos independientes',
    );
  }
  const f = free[0];
  const sol: Q[] = Array(cols).fill(q(0n));
  sol[f] = q(1n);
  pivotCols.forEach((pc, r) => {
    sol[pc] = q(-m[r][f].n, m[r][f].d);
  });

  const lcm = sol.reduce((acc, x) => (acc * x.d) / gcd(acc, x.d), 1n);
  let ints = sol.map((x) => (x.n * lcm) / x.d);
  if (ints.every((x) => x <= 0n)) ints = ints.map((x) => -x);
  if (ints.some((x) => x <= 0n)) throw new BalanceError('No existe un balanceo con coeficientes positivos');
  const g = ints.reduce((a, b) => gcd(a, b));
  const coefs = ints.map((x) => Number(x / g));

  const reactantCoefficients = coefs.slice(0, reactants.length);
  const productCoefficients = coefs.slice(reactants.length);
  const side = (names: string[], cs: number[]) =>
    names.map((n, i) => (cs[i] === 1 ? n : `${cs[i]}${n}`)).join(' + ');
  return {
    reactants,
    products,
    reactantCoefficients,
    productCoefficients,
    text: `${side(reactants, reactantCoefficients)} → ${side(products, productCoefficients)}`,
  };
}

/** Comprueba si unos coeficientes dados conservan los átomos. */
export function isBalanced(reactants: string[], rc: number[], products: string[], pc: number[]): boolean {
  const total = (names: string[], cs: number[]) => {
    const out: Record<string, number> = {};
    names.forEach((n, i) => {
      for (const [el, k] of Object.entries(parseFormula(n))) out[el] = (out[el] ?? 0) + k * cs[i];
    });
    return out;
  };
  const l = total(reactants, rc);
  const r = total(products, pc);
  const keys = new Set([...Object.keys(l), ...Object.keys(r)]);
  return [...keys].every((k) => l[k] === r[k]);
}
