/**
 * pH en disolución acuosa a 25 °C (Kw = 1.0 × 10⁻¹⁴).
 * Fuente: OpenStax Chemistry 2e, cap. 14 (§14.2 pH y pOH, §14.3 fuerza relativa,
 * §14.6 disoluciones amortiguadoras).
 *
 * Limitaciones del modelo (se muestran en la app):
 * - Actividad ≈ concentración (disoluciones diluidas ideales).
 * - Ácidos/bases monopróticos.
 * - Temperatura fija de 25 °C.
 */

export const KW = 1.0e-14;

function check(c: number, name = 'La concentración') {
  if (!Number.isFinite(c) || c <= 0) throw new RangeError(`${name} debe ser positiva`);
}

export const pHFromH = (h: number) => {
  check(h, '[H⁺]');
  return -Math.log10(h);
};
export const hFromPH = (pH: number) => 10 ** -pH;
export const pOHFromPH = (pH: number) => 14 - pH;

/**
 * Ácido fuerte monoprótico. Incluye la autoionización del agua:
 * [H⁺] = (C + √(C² + 4Kw)) / 2, que tiende a C cuando C ≫ 10⁻⁷.
 */
export function strongAcidPH(c: number): number {
  check(c);
  return pHFromH((c + Math.sqrt(c * c + 4 * KW)) / 2);
}

/** Base fuerte monohidroxílica, análogo para [OH⁻]. */
export function strongBasePH(c: number): number {
  check(c);
  const oh = (c + Math.sqrt(c * c + 4 * KW)) / 2;
  return 14 + Math.log10(oh);
}

/**
 * Ácido débil HA ⇌ H⁺ + A⁻. Resuelve x² + Ka·x − Ka·C = 0 (sin aproximación del 5 %).
 * No incluye la autoionización del agua; válido cuando [H⁺] ≫ 10⁻⁷.
 */
export function weakAcidPH(c: number, ka: number): number {
  check(c);
  check(ka, 'Ka');
  const x = (-ka + Math.sqrt(ka * ka + 4 * ka * c)) / 2;
  return pHFromH(x);
}

export function weakBasePH(c: number, kb: number): number {
  check(c);
  check(kb, 'Kb');
  const x = (-kb + Math.sqrt(kb * kb + 4 * kb * c)) / 2;
  return 14 + Math.log10(x);
}

/** Henderson–Hasselbalch: pH = pKa + log([A⁻]/[HA]). */
export function bufferPH(pKa: number, base: number, acid: number): number {
  check(base, '[A⁻]');
  check(acid, '[HA]');
  return pKa + Math.log10(base / acid);
}

export type AcidityLabel = 'ácida' | 'neutra' | 'básica';

export function classifyPH(pH: number, tolerance = 0.005): AcidityLabel {
  if (pH < 7 - tolerance) return 'ácida';
  if (pH > 7 + tolerance) return 'básica';
  return 'neutra';
}
