/**
 * Mol, estequiometría y disoluciones.
 * Fórmulas: OpenStax Chemistry 2e, §3.1 (mol), §3.3 (molaridad y dilución), §4.3–4.4
 * (estequiometría, reactivo limitante, rendimiento).
 */
import { balanceEquation } from './balance';
import { molarMass } from './formula';

/** Constante de Avogadro (exacta desde la redefinición del SI de 2019), mol⁻¹. */
export const AVOGADRO = 6.02214076e23;

function assertPositive(name: string, value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} debe ser un número positivo`);
  }
}

/** n = m / M */
export function gramsToMoles(grams: number, formula: string): number {
  assertPositive('La masa', grams);
  return grams / molarMass(formula);
}

/** m = n · M */
export function molesToGrams(moles: number, formula: string): number {
  assertPositive('Los moles', moles);
  return moles * molarMass(formula);
}

/** N = n · Nₐ */
export function molesToParticles(moles: number): number {
  assertPositive('Los moles', moles);
  return moles * AVOGADRO;
}

export function particlesToMoles(particles: number): number {
  assertPositive('El número de partículas', particles);
  return particles / AVOGADRO;
}

/** M = n / V (V en litros). */
export function molarity(moles: number, volumeL: number): number {
  assertPositive('Los moles', moles);
  assertPositive('El volumen', volumeL);
  return moles / volumeL;
}

/** M = (m / Mm) / V */
export function molarityFromMass(grams: number, formula: string, volumeL: number): number {
  return molarity(gramsToMoles(grams, formula), volumeL);
}

/**
 * Dilución: C₁V₁ = C₂V₂. Pasa `null` en la incógnita.
 * Devuelve el valor de la incógnita.
 */
export function dilution(params: {
  c1: number | null;
  v1: number | null;
  c2: number | null;
  v2: number | null;
}): number {
  const entries = Object.entries(params);
  const unknown = entries.filter(([, v]) => v === null);
  if (unknown.length !== 1) throw new Error('Debe haber exactamente una incógnita');
  for (const [k, v] of entries) if (v !== null) assertPositive(k, v);
  const { c1, v1, c2, v2 } = params;
  switch (unknown[0][0]) {
    case 'c1':
      return (c2! * v2!) / v1!;
    case 'v1':
      return (c2! * v2!) / c1!;
    case 'c2':
      return (c1! * v1!) / v2!;
    default:
      return (c1! * v1!) / c2!;
  }
}

/** Densidad ρ = m / V */
export function density(mass: number, volume: number): number {
  assertPositive('La masa', mass);
  assertPositive('El volumen', volume);
  return mass / volume;
}

export interface LimitingResult {
  limiting: string;
  /** Moles de reacción (extensión ξ) que permite el limitante. */
  extentMol: number;
  /** Gramos teóricos de cada producto. */
  theoreticalGrams: Record<string, number>;
  /** Gramos sobrantes de cada reactivo. */
  excessGrams: Record<string, number>;
  balanced: string;
}

/**
 * Reactivo limitante a partir de masas iniciales (g) de cada reactivo.
 * La ecuación se balancea automáticamente.
 */
export function limitingReagent(equation: string, gramsByReactant: Record<string, number>): LimitingResult {
  const eq = balanceEquation(equation);
  let limiting = '';
  let extent = Infinity;
  eq.reactants.forEach((r, i) => {
    const g = gramsByReactant[r];
    if (g === undefined) throw new Error(`Falta la masa de ${r}`);
    const ext = gramsToMoles(g, r) / eq.reactantCoefficients[i];
    if (ext < extent) {
      extent = ext;
      limiting = r;
    }
  });
  const theoreticalGrams: Record<string, number> = {};
  eq.products.forEach((p, i) => {
    theoreticalGrams[p] = extent * eq.productCoefficients[i] * molarMass(p);
  });
  const excessGrams: Record<string, number> = {};
  eq.reactants.forEach((r, i) => {
    excessGrams[r] = gramsByReactant[r] - extent * eq.reactantCoefficients[i] * molarMass(r);
  });
  return { limiting, extentMol: extent, theoreticalGrams, excessGrams, balanced: eq.text };
}

/** Rendimiento porcentual = real / teórico × 100 */
export function percentYield(actual: number, theoretical: number): number {
  assertPositive('El rendimiento teórico', theoretical);
  if (!Number.isFinite(actual) || actual < 0) throw new RangeError('El rendimiento real no puede ser negativo');
  return (actual / theoretical) * 100;
}
