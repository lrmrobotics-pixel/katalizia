/**
 * Lógica pura del laboratorio virtual 2.0. Todo se calcula con datos con fuente;
 * las simplificaciones del modelo se devuelven junto al resultado para mostrarlas.
 *
 * Fuentes: OpenStax Chemistry 2e — 2.3 (estructura atómica), 6.4 (configuración electrónica),
 * 7.3–7.4 (Lewis y enlace covalente), 9.5 y 12.5 (teoría cinética y de colisiones, Arrhenius),
 * 14.7 y fig. 14.23 (intervalos de viraje de indicadores ácido-base).
 */
import { orbitalOccupancy } from '@/core/chemistry/electronConfig';
import { getElementByZ, type ChemicalElement } from '@/data/elements';

// ── Constructor de átomos ───────────────────────────────────────────────

export const ATOM_LIMITS = { maxProtons: 36, maxNeutrons: 50 } as const;

export interface AtomInfo {
  element: ChemicalElement | null;
  z: number;
  massNumber: number;
  charge: number;
  kind: 'vacío' | 'átomo neutro' | 'catión' | 'anión';
  /** Electrones por capa (n = 1, 2, 3…), modelo de capas simplificado. */
  shells: number[];
  /** Notación tipo ¹²C o ²³Na⁺. */
  notation: string;
}

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n: number) => String(n).split('').map((d) => SUP[Number(d)]).join('');

export function chargeLabel(charge: number): string {
  if (charge === 0) return '';
  const mag = Math.abs(charge) === 1 ? '' : sup(Math.abs(charge));
  return `${mag}${charge > 0 ? '⁺' : '⁻'}`;
}

/**
 * Capas a partir del orden de llenado de Aufbau para `electrons` electrones.
 * Simplificación: en iones se usa la configuración del átomo isoelectrónico
 * (correcto para elementos representativos; en metales de transición los cationes pierden antes los 4s).
 */
export function shellsFor(electrons: number): number[] {
  if (electrons <= 0) return [];
  const occ = orbitalOccupancy(Math.min(118, electrons));
  const shells: number[] = [];
  for (const [orb, count] of Object.entries(occ)) {
    const n = Number(orb[0]);
    shells[n - 1] = (shells[n - 1] ?? 0) + count;
  }
  return Array.from(shells, (x) => x ?? 0);
}

export function atomInfo(protons: number, neutrons: number, electrons: number): AtomInfo {
  const element = protons > 0 ? getElementByZ(protons) ?? null : null;
  const charge = protons - electrons;
  const kind = protons === 0 ? 'vacío' : charge === 0 ? 'átomo neutro' : charge > 0 ? 'catión' : 'anión';
  const massNumber = protons + neutrons;
  return {
    element,
    z: protons,
    massNumber,
    charge,
    kind,
    shells: shellsFor(electrons),
    notation: element ? `${sup(massNumber)}${element.symbol}${chargeLabel(charge)}` : '',
  };
}

export interface AtomChallenge {
  id: string;
  prompt: string;
  protons: number;
  neutrons: number;
  electrons: number;
}

/** Retos con respuesta única (Z, A y carga determinan p, n y e). Datos de isótopos: CIAAW/IUPAC. */
export const ATOM_CHALLENGES: AtomChallenge[] = [
  { id: 'h1', prompt: 'Construye un átomo de hidrógeno-1 neutro', protons: 1, neutrons: 0, electrons: 1 },
  { id: 'he4', prompt: 'Construye helio-4 neutro', protons: 2, neutrons: 2, electrons: 2 },
  { id: 'c12', prompt: 'Construye carbono-12 neutro', protons: 6, neutrons: 6, electrons: 6 },
  { id: 'c14', prompt: 'Construye carbono-14 (el de la datación) neutro', protons: 6, neutrons: 8, electrons: 6 },
  { id: 'o2m', prompt: 'Construye el ion óxido ¹⁶O²⁻', protons: 8, neutrons: 8, electrons: 10 },
  { id: 'na1p', prompt: 'Construye el ion sodio ²³Na⁺ (electrolito de la sangre)', protons: 11, neutrons: 12, electrons: 10 },
  { id: 'cl1m', prompt: 'Construye el ion cloruro ³⁵Cl⁻', protons: 17, neutrons: 18, electrons: 18 },
  { id: 'k1p', prompt: 'Construye el ion potasio ³⁹K⁺', protons: 19, neutrons: 20, electrons: 18 },
  { id: 'ca2p', prompt: 'Construye el ion calcio ⁴⁰Ca²⁺ (huesos y contracción muscular)', protons: 20, neutrons: 20, electrons: 18 },
];

export function checkAtom(c: AtomChallenge, p: number, n: number, e: number) {
  const hints: string[] = [];
  if (p !== c.protons) hints.push(p < c.protons ? 'Faltan protones: el número de protones define el elemento.' : 'Sobran protones: cambiarías de elemento.');
  if (n !== c.neutrons) hints.push(`Revisa los neutrones: N = A − Z.`);
  if (e !== c.electrons) hints.push('Revisa los electrones: carga = protones − electrones.');
  return { correct: hints.length === 0, hints };
}

// ── Constructor de moléculas (modelo de valencia de Lewis) ──────────────

/** Valencia covalente habitual (número de enlaces en moléculas neutras sencillas). OpenStax 7.3. */
export const VALENCE: Record<string, number> = { H: 1, C: 4, N: 3, O: 2, F: 1, Cl: 1, S: 2 };

export interface BuildAtom {
  id: number;
  el: string;
  x: number;
  y: number;
}

export interface Bond {
  a: number;
  b: number;
  order: 1 | 2 | 3;
}

export function bondsOf(id: number, bonds: Bond[]) {
  return bonds.filter((b) => b.a === id || b.b === id).reduce((s, b) => s + b.order, 0);
}

export function freeValence(atom: BuildAtom, bonds: Bond[]) {
  return VALENCE[atom.el] - bondsOf(atom.id, bonds);
}

/**
 * Toca dos átomos para enlazarlos: sin enlace → simple → doble → triple → sin enlace.
 * Nunca supera la valencia de ninguno de los dos (salta al siguiente orden posible).
 */
export function cycleBond(atoms: BuildAtom[], bonds: Bond[], a: number, b: number): Bond[] {
  if (a === b) return bonds;
  const A = atoms.find((x) => x.id === a)!;
  const B = atoms.find((x) => x.id === b)!;
  const existing = bonds.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
  const rest = bonds.filter((x) => x !== existing);
  const current = existing?.order ?? 0;
  const capacity = Math.min(freeValence(A, rest), freeValence(B, rest));
  const next = current + 1;
  if (next > 3 || next > capacity) return rest;
  return [...rest, { a, b, order: next as 1 | 2 | 3 }];
}

/** Fórmula en notación de Hill (C primero, luego H, luego alfabético). */
export function hillFormula(atoms: BuildAtom[]): string {
  const count: Record<string, number> = {};
  atoms.forEach((a) => (count[a.el] = (count[a.el] ?? 0) + 1));
  const keys = Object.keys(count).sort();
  const ordered = count.C ? ['C', ...(count.H ? ['H'] : []), ...keys.filter((k) => k !== 'C' && k !== 'H')] : keys;
  return ordered.map((k) => `${k}${count[k] > 1 ? count[k] : ''}`).join('');
}

function connected(atoms: BuildAtom[], bonds: Bond[]) {
  if (atoms.length === 0) return false;
  const seen = new Set([atoms[0].id]);
  const stack = [atoms[0].id];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const b of bonds) {
      const other = b.a === cur ? b.b : b.b === cur ? b.a : null;
      if (other !== null && !seen.has(other)) {
        seen.add(other);
        stack.push(other);
      }
    }
  }
  return seen.size === atoms.length;
}

export interface MoleculeTargetInfo {
  formula: string;
  name: string;
  note: string;
}

/** Moléculas reconocibles (fórmula de Hill). Varias admiten isómeros: se indica. */
export const BUILD_TARGETS: MoleculeTargetInfo[] = [
  { formula: 'H2O', name: 'Agua', note: 'Dos enlaces simples O–H; el O conserva dos pares libres (forma angular).' },
  { formula: 'CO2', name: 'Dióxido de carbono', note: 'Dos dobles enlaces O=C=O: molécula lineal y apolar.' },
  { formula: 'O2', name: 'Oxígeno', note: 'Doble enlace O=O.' },
  { formula: 'N2', name: 'Nitrógeno', note: 'Triple enlace N≡N, de los más fuertes que existen.' },
  { formula: 'CH4', name: 'Metano', note: 'Cuatro enlaces C–H; en 3D es un tetraedro (109,5°).' },
  { formula: 'H3N', name: 'Amoníaco', note: 'Tres enlaces N–H y un par libre: forma piramidal.' },
  { formula: 'ClH', name: 'Cloruro de hidrógeno', note: 'Enlace H–Cl polar; en agua forma ácido clorhídrico.' },
  { formula: 'C2H6', name: 'Etano', note: 'Enlace simple C–C.' },
  { formula: 'C2H4', name: 'Eteno (etileno)', note: 'Doble enlace C=C: es un alqueno.' },
  { formula: 'C2H2', name: 'Etino (acetileno)', note: 'Triple enlace C≡C: es un alquino.' },
  { formula: 'CH4O', name: 'Metanol', note: 'Grupo –OH unido a un carbono: un alcohol.' },
  { formula: 'C2H6O', name: 'Etanol o dimetiléter', note: 'Isómeros: con –OH es etanol; con C–O–C es dimetiléter.' },
  { formula: 'C6H12O6', name: 'Hexosa (p. ej. glucosa)', note: 'Fórmula de la glucosa, pero también de la fructosa y otras: son isómeros.' },
];

export type MoleculeStatus =
  | { kind: 'empty' }
  | { kind: 'incomplete'; free: number; formula: string }
  | { kind: 'disconnected'; formula: string }
  | { kind: 'valid'; formula: string; known: MoleculeTargetInfo | null };

export function evaluateMolecule(atoms: BuildAtom[], bonds: Bond[]): MoleculeStatus {
  if (atoms.length === 0) return { kind: 'empty' };
  const formula = hillFormula(atoms);
  const free = atoms.reduce((s, a) => s + freeValence(a, bonds), 0);
  if (free > 0) return { kind: 'incomplete', free, formula };
  if (!connected(atoms, bonds)) return { kind: 'disconnected', formula };
  return { kind: 'valid', formula, known: BUILD_TARGETS.find((t) => t.formula === formula) ?? null };
}

// ── Indicadores ácido-base ──────────────────────────────────────────────

export interface Indicator {
  id: string;
  name: string;
  /** Intervalo de viraje (pH) y colores a cada lado. */
  from: number;
  to: number;
  acid: string;
  base: string;
  /** Color "incoloro" se representa con transparencia. */
  acidAlpha?: number;
}

export const INDICATORS: Indicator[] = [
  { id: 'naranja', name: 'Naranja de metilo', from: 3.1, to: 4.4, acid: '#E23B3B', base: '#F5C518' },
  { id: 'azul-bromotimol', name: 'Azul de bromotimol', from: 6.0, to: 7.6, acid: '#F2D024', base: '#2B5CE6' },
  { id: 'fenolftaleina', name: 'Fenolftaleína', from: 8.2, to: 10.0, acid: '#FFFFFF', base: '#E0379B', acidAlpha: 0.12 },
];

function mix(a: string, b: string, k: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((x, i) => Math.round(x + (pb[i] - x) * k).toString(16).padStart(2, '0')).join('')}`;
}

/** Color del indicador a un pH: color ácido, mezcla lineal en el viraje, color básico. */
export function indicatorColor(ind: Indicator, pH: number): { color: string; opacity: number; zone: 'ácida' | 'viraje' | 'básica' } {
  const k = Math.max(0, Math.min(1, (pH - ind.from) / (ind.to - ind.from)));
  const zone = pH < ind.from ? 'ácida' : pH > ind.to ? 'básica' : 'viraje';
  const a0 = ind.acidAlpha ?? 0.85;
  return { color: mix(ind.acid, ind.base, k), opacity: a0 + (0.85 - a0) * k, zone };
}

// ── Temperatura y velocidad (Arrhenius) ─────────────────────────────────

export const R = 8.314; // J/(mol·K)

/** k(T)/k(Tref) con la ecuación de Arrhenius, mismo factor A. Ea en kJ/mol. */
export function rateRatio(eaKJ: number, T: number, Tref = 298): number {
  return Math.exp((-eaKJ * 1000) / R * (1 / T - 1 / Tref));
}

/** Fracción de colisiones con energía ≥ Ea (factor de Boltzmann e^(−Ea/RT)). */
export function boltzmannFraction(eaKJ: number, T: number): number {
  return Math.exp((-eaKJ * 1000) / (R * T));
}

/** Rapidez cuadrática media relativa: v ∝ √T (teoría cinética). */
export const relativeSpeed = (T: number, Tref = 298) => Math.sqrt(T / Tref);
