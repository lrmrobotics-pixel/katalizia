/**
 * Unidades del SI, prefijos, conversiones y notación científica.
 * Fuente: BIPM, The International System of Units (SI Brochure, 9.ª ed., 2019)
 * https://www.bipm.org/en/publications/si-brochure ; OpenStax Chemistry 2e §1.4–1.6.
 */

export const SI_PREFIXES = {
  T: 1e12,
  G: 1e9,
  M: 1e6,
  k: 1e3,
  h: 1e2,
  da: 1e1,
  '': 1,
  d: 1e-1,
  c: 1e-2,
  m: 1e-3,
  µ: 1e-6,
  n: 1e-9,
  p: 1e-12,
} as const;

export type Prefix = keyof typeof SI_PREFIXES;

type Dimension = 'mass' | 'length' | 'volume' | 'amount' | 'time';

/** Unidades base de cada dimensión expresadas en la unidad de referencia. */
const UNITS: Record<string, { dim: Dimension; factor: number }> = {
  g: { dim: 'mass', factor: 1 },
  t: { dim: 'mass', factor: 1e6 },
  m: { dim: 'length', factor: 1 },
  L: { dim: 'volume', factor: 1 },
  mol: { dim: 'amount', factor: 1 },
  s: { dim: 'time', factor: 1 },
  min: { dim: 'time', factor: 60 },
  h: { dim: 'time', factor: 3600 },
};

const PREFIX_KEYS = (Object.keys(SI_PREFIXES) as Prefix[])
  .filter((p) => p)
  .sort((a, b) => b.length - a.length);

function resolve(unit: string): { dim: Dimension; factor: number } {
  const u = unit.replace('u', 'µ').replace('μ', 'µ');
  if (u === 'mL') return { dim: 'volume', factor: 1e-3 };
  if (u === 'cm3' || u === 'cm³') return { dim: 'volume', factor: 1e-3 };
  if (u === 'm3' || u === 'm³') return { dim: 'volume', factor: 1e3 };
  if (u === 'dm3' || u === 'dm³') return { dim: 'volume', factor: 1 };
  if (UNITS[u]) return UNITS[u];
  for (const p of PREFIX_KEYS) {
    if (u.startsWith(p) && UNITS[u.slice(p.length)]) {
      const base = UNITS[u.slice(p.length)];
      return { dim: base.dim, factor: base.factor * SI_PREFIXES[p] };
    }
  }
  throw new Error(`Unidad no reconocida: ${unit}`);
}

/** Convierte entre unidades de la misma dimensión: convert(250, 'mL', 'L') = 0.25 */
export function convert(value: number, from: string, to: string): number {
  const a = resolve(from);
  const b = resolve(to);
  if (a.dim !== b.dim) throw new Error(`No se puede convertir ${from} a ${to}`);
  return (value * a.factor) / b.factor;
}

export const celsiusToKelvin = (c: number) => c + 273.15;
export const kelvinToCelsius = (k: number) => k - 273.15;
export const celsiusToFahrenheit = (c: number) => (c * 9) / 5 + 32;
export const fahrenheitToCelsius = (f: number) => ((f - 32) * 5) / 9;

/** Descompone en mantisa × 10^exponente con 1 ≤ |mantisa| < 10. */
export function toScientific(value: number): { mantissa: number; exponent: number } {
  if (value === 0) return { mantissa: 0, exponent: 0 };
  let exponent = Math.floor(Math.log10(Math.abs(value)));
  let mantissa = value / 10 ** exponent;
  // Corrige errores de redondeo en la frontera (p. ej. 1000 → 9.999… × 10²).
  if (Math.abs(mantissa) >= 10 - 1e-12) {
    mantissa /= 10;
    exponent += 1;
  }
  return { mantissa, exponent };
}

const SUP: Record<string, string> = {
  '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
};

/** Formatea con cifras significativas: formatScientific(0.000123, 2) = "1.2 × 10⁻⁴" */
export function formatScientific(value: number, sigFigs = 3): string {
  const rounded = Number(value.toPrecision(sigFigs));
  const { mantissa, exponent } = toScientific(rounded);
  const m = mantissa.toFixed(Math.max(0, sigFigs - 1));
  if (exponent === 0) return m;
  const exp = String(exponent).split('').map((c) => SUP[c]).join('');
  return `${m} × 10${exp}`;
}

/** Cuenta cifras significativas de un número escrito como texto. */
export function countSigFigs(text: string): number {
  const s = text.trim().replace(/^[-+]/, '').toLowerCase().split('e')[0];
  if (!/^\d*\.?\d*$/.test(s) || s === '' || s === '.') throw new Error(`Número no válido: ${text}`);
  const hasDot = s.includes('.');
  const digits = s.replace('.', '').replace(/^0+/, '');
  if (digits === '') return 1; // "0", "0.0" → convención: 1
  if (hasDot) return digits.length;
  return digits.replace(/0+$/, '').length; // ceros finales sin punto: no significativos
}
