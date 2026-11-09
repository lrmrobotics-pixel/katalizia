/**
 * Configuración electrónica del estado fundamental.
 *
 * Método: principio de Aufbau (regla de Madelung, n + l) con la tabla de excepciones
 * experimentales de NIST Atomic Spectra Database (https://physics.nist.gov/PhysRefData/ASD/).
 * Para Z >= 104 la configuración es una predicción teórica.
 */

const AUFBAU_ORDER = [
  '1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p',
  '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p',
] as const;

const CAPACITY: Record<string, number> = { s: 2, p: 6, d: 10, f: 14 };
const L_INDEX: Record<string, number> = { s: 0, p: 1, d: 2, f: 3 };

const NOBLE_GASES: [number, string][] = [
  [86, 'Rn'],
  [54, 'Xe'],
  [36, 'Kr'],
  [18, 'Ar'],
  [10, 'Ne'],
  [2, 'He'],
];

/** Excepciones a Aufbau: orbitales cuya ocupación difiere del orden de Madelung. */
const EXCEPTIONS: Record<number, Record<string, number>> = {
  24: { '3d': 5, '4s': 1 }, // Cr
  29: { '3d': 10, '4s': 1 }, // Cu
  41: { '4d': 4, '5s': 1 }, // Nb
  42: { '4d': 5, '5s': 1 }, // Mo
  44: { '4d': 7, '5s': 1 }, // Ru
  45: { '4d': 8, '5s': 1 }, // Rh
  46: { '4d': 10, '5s': 0 }, // Pd
  47: { '4d': 10, '5s': 1 }, // Ag
  57: { '4f': 0, '5d': 1 }, // La
  58: { '4f': 1, '5d': 1 }, // Ce
  64: { '4f': 7, '5d': 1 }, // Gd
  78: { '5d': 9, '6s': 1 }, // Pt
  79: { '5d': 10, '6s': 1 }, // Au
  89: { '5f': 0, '6d': 1 }, // Ac
  90: { '5f': 0, '6d': 2 }, // Th
  91: { '5f': 2, '6d': 1 }, // Pa
  92: { '5f': 3, '6d': 1 }, // U
  93: { '5f': 4, '6d': 1 }, // Np
  96: { '5f': 7, '6d': 1 }, // Cm
  103: { '6d': 0, '7p': 1 }, // Lr
};

export type Occupancy = Record<string, number>;

export function orbitalOccupancy(z: number): Occupancy {
  if (!Number.isInteger(z) || z < 1 || z > 118) {
    throw new RangeError(`Número atómico fuera de rango: ${z}`);
  }
  const occ: Occupancy = {};
  let remaining = z;
  for (const orb of AUFBAU_ORDER) {
    if (remaining <= 0) break;
    const n = Math.min(CAPACITY[orb[1]], remaining);
    occ[orb] = n;
    remaining -= n;
  }
  const exc = EXCEPTIONS[z];
  if (exc) {
    for (const [orb, n] of Object.entries(exc)) {
      if (n === 0) delete occ[orb];
      else occ[orb] = n;
    }
  }
  return occ;
}

function sortByShell(orbitals: string[]): string[] {
  return [...orbitals].sort((a, b) => {
    const na = Number(a[0]);
    const nb = Number(b[0]);
    return na !== nb ? na - nb : L_INDEX[a[1]] - L_INDEX[b[1]];
  });
}

function format(occ: Occupancy, skip: Set<string> = new Set()): string {
  return sortByShell(Object.keys(occ).filter((o) => !skip.has(o)))
    .map((o) => `${o}${occ[o]}`)
    .join(' ');
}

/** Configuración completa, ordenada por capa: "1s2 2s2 2p6 3s1". */
export function fullConfiguration(z: number): string {
  return format(orbitalOccupancy(z));
}

/** Configuración abreviada con gas noble: "[Ne] 3s1". */
export function shorthandConfiguration(z: number): string {
  const occ = orbitalOccupancy(z);
  const core = NOBLE_GASES.find(([gz]) => gz < z);
  if (!core) return format(occ);
  const coreOrbitals = new Set(Object.keys(orbitalOccupancy(core[0])));
  return `[${core[1]}] ${format(occ, coreOrbitals)}`.trim();
}

/**
 * Electrones de valencia para elementos de los grupos principales (1, 2 y 13–18).
 * Regla de OpenStax Chemistry 2e §6.4: grupos 1–2 → número de grupo; 13–18 → grupo − 10;
 * helio → 2. Para bloques d y f devuelve `null`: su valencia depende del contexto químico.
 */
export function valenceElectronsForGroup(z: number, group: number | null): number | null {
  if (z === 2) return 2;
  if (group === null) return null;
  if (group <= 2) return group;
  if (group >= 13) return group - 10;
  return null;
}
