/**
 * Lógica de PH Master, Chemistry Kitchen y BioQuest (pura, sin React).
 * Las respuestas se calculan con `core/chemistry` / `core/lab`; los datos del cuerpo humano
 * llevan su sección de OpenStax Anatomy and Physiology 2e.
 */
import { strongAcidPH, strongBasePH, weakAcidPH, weakBasePH } from '@/core/chemistry/acidBase';
import { molarMass } from '@/core/chemistry/formula';
import { indicatorColor, INDICATORS, type Indicator } from '@/core/lab';

import type { Rng } from './index';

const pick = <T,>(xs: readonly T[], rand: Rng): T => xs[Math.floor(rand() * xs.length)];

// ── PH Master ───────────────────────────────────────────────────────────

/** Ka/Kb a 25 °C: OpenStax Chemistry 2e, apéndices H e I. */
export const PH_SOLUTES = [
  { id: 'HCl', label: 'HCl', kind: 'ácido fuerte', ph: (c: number) => strongAcidPH(c) },
  { id: 'NaOH', label: 'NaOH', kind: 'base fuerte', ph: (c: number) => strongBasePH(c) },
  { id: 'CH3COOH', label: 'CH₃COOH', kind: 'ácido débil', ph: (c: number) => weakAcidPH(c, 1.8e-5) },
  { id: 'NH3', label: 'NH₃', kind: 'base débil', ph: (c: number) => weakBasePH(c, 1.8e-5) },
] as const;

export const PH_BANDS = [
  { id: 0, label: '0–3', min: 0, max: 3 },
  { id: 1, label: '3–6', min: 3, max: 6 },
  { id: 2, label: '6–8', min: 6, max: 8 },
  { id: 3, label: '8–11', min: 8, max: 11 },
  { id: 4, label: '11–14', min: 11, max: 14.1 },
] as const;

export const bandOf = (ph: number) => PH_BANDS.find((b) => ph >= b.min && ph < b.max)!.id;

export type PhRound =
  | { type: 'band'; solute: (typeof PH_SOLUTES)[number]; exp: number; ph: number; answer: number }
  | { type: 'indicator'; indicator: Indicator; ph: number; color: string; opacity: number; zone: string };

/** Ronda de PH Master: estimar el intervalo de pH o leer un indicador. */
export function makePhRound(rand: Rng): PhRound {
  if (rand() < 0.55) {
    const solute = pick(PH_SOLUTES, rand);
    const exp = -1 - Math.floor(rand() * 4); // 10⁻¹ a 10⁻⁴ M
    const ph = solute.ph(10 ** exp);
    return { type: 'band', solute, exp, ph, answer: bandOf(ph) };
  }
  // Indicador: se eligen pH lejos del viraje para que el color sea concluyente.
  const indicator = pick(INDICATORS, rand);
  const below = rand() < 0.5;
  const ph = below ? Math.max(0.5, indicator.from - 1 - rand() * 1.5) : Math.min(13.5, indicator.to + 1 + rand() * 1.5);
  const col = indicatorColor(indicator, ph);
  return { type: 'indicator', indicator, ph, color: col.color, opacity: col.opacity, zone: col.zone };
}

/**
 * Para leer un indicador hay que saber hacia qué lado del viraje está:
 * la respuesta aceptada es "por debajo / por encima" del intervalo.
 */
export function indicatorSide(r: Extract<PhRound, { type: 'indicator' }>): 'debajo' | 'encima' {
  return r.ph < r.indicator.from ? 'debajo' : 'encima';
}

// ── Chemistry Kitchen ───────────────────────────────────────────────────

export type KitchenRound =
  | { type: 'dilucion'; stock: number; target: number; maxV2: number }
  | { type: 'pesar'; formula: string; name: string; molarity: number; volumeMl: number; grams: number };

const SALTS = [
  { formula: 'NaCl', name: 'cloruro de sodio' },
  { formula: 'KCl', name: 'cloruro de potasio' },
  { formula: 'C6H12O6', name: 'glucosa' },
  { formula: 'NaHCO3', name: 'bicarbonato de sodio' },
];

const sig3 = (x: number) => Number(x.toPrecision(3));

export function makeKitchenRound(rand: Rng): KitchenRound {
  if (rand() < 0.5) {
    const stock = pick([1, 2, 5, 6], rand);
    // Objetivo alcanzable con la rejilla de los controles (V₁ de 5 en 5 mL, V₂ de 50 en 50 mL).
    const v1 = 5 * (1 + Math.floor(rand() * 20));
    const v2 = 50 * (Math.ceil((v1 + 1) / 50) + Math.floor(rand() * 8));
    return { type: 'dilucion', stock, target: sig3((stock * v1) / v2), maxV2: 1000 };
  }
  const salt = pick(SALTS, rand);
  const molarity = pick([0.1, 0.2, 0.25, 0.5], rand);
  const volumeMl = pick([100, 250, 500], rand);
  return { type: 'pesar', ...salt, molarity, volumeMl, grams: molarity * (volumeMl / 1000) * molarMass(salt.formula) };
}

/** Acierto dentro de ±2 % (precisión razonable de una medida de laboratorio escolar). */
export function kitchenCorrect(r: KitchenRound, a: number, b = 0): boolean {
  if (r.type === 'dilucion') {
    if (b <= 0 || b < a || b > r.maxV2) return false;
    return Math.abs((r.stock * a) / b - r.target) / r.target <= 0.02;
  }
  return Math.abs(a - r.grams) / r.grams <= 0.02;
}

// ── BioQuest ────────────────────────────────────────────────────────────

export type Organ = 'cerebro' | 'tiroides' | 'pulmones' | 'corazon' | 'estomago' | 'brazo' | 'hueso';

export const ORGAN_LABEL: Record<Organ, string> = {
  cerebro: 'Cerebro y nervios',
  tiroides: 'Tiroides',
  pulmones: 'Pulmones',
  corazon: 'Corazón y sangre',
  estomago: 'Estómago',
  brazo: 'Músculo',
  hueso: 'Huesos',
};

export interface BioQuestion {
  id: string;
  prompt: string;
  organ: Organ;
  explanation: string;
  source: string;
}

/** Hechos verificados (OpenStax Anatomy and Physiology 2e). Uso educativo, no clínico. */
export const BIO_QUESTIONS: BioQuestion[] = [
  { id: 'yodo', prompt: '¿Qué órgano necesita yodo para fabricar sus hormonas T3 y T4?', organ: 'tiroides', explanation: 'Las hormonas tiroideas llevan átomos de yodo en su estructura.', source: 'A&P 2e, 17.4' },
  { id: 'hierro', prompt: '¿Dónde actúa el hierro del grupo hemo que transporta O₂?', organ: 'corazon', explanation: 'Cada grupo hemo de la hemoglobina de los glóbulos rojos tiene un ion de hierro que une O₂.', source: 'A&P 2e, 18.3' },
  { id: 'calcio-hueso', prompt: '¿Dónde se guarda la mayor parte del calcio, como fosfato de calcio (hidroxiapatita)?', organ: 'hueso', explanation: 'La matriz ósea está mineralizada con cristales de fosfato de calcio.', source: 'A&P 2e, 6.3' },
  { id: 'hcl', prompt: '¿Qué órgano secreta ácido clorhídrico (HCl)?', organ: 'estomago', explanation: 'Las células parietales del estómago secretan HCl, que acidifica el jugo gástrico.', source: 'A&P 2e, 23.4' },
  { id: 'na-k', prompt: '¿Dónde son clave los iones Na⁺ y K⁺ para enviar impulsos eléctricos?', organ: 'cerebro', explanation: 'El potencial de acción de las neuronas depende del paso de Na⁺ y K⁺ a través de la membrana.', source: 'A&P 2e, 12.4' },
  { id: 'calcio-musculo', prompt: '¿Dónde dispara el Ca²⁺ la contracción?', organ: 'brazo', explanation: 'En el músculo esquelético, el Ca²⁺ liberado se une a la troponina y permite la contracción.', source: 'A&P 2e, 10.3' },
  { id: 'gases', prompt: '¿Dónde entra el O₂ a la sangre y sale el CO₂?', organ: 'pulmones', explanation: 'El intercambio gaseoso ocurre por difusión en los alvéolos pulmonares.', source: 'A&P 2e, 22.4' },
  { id: 'bicarbonato', prompt: '¿Dónde actúa el amortiguador bicarbonato (HCO₃⁻) que mantiene el pH entre 7,35 y 7,45?', organ: 'corazon', explanation: 'El sistema bicarbonato–ácido carbónico es el principal amortiguador de la sangre.', source: 'A&P 2e, 26.4' },
  { id: 'co2-ph', prompt: 'Respirar más rápido elimina más CO₂ y sube el pH de la sangre. ¿Qué órgano lo hace posible?', organ: 'pulmones', explanation: 'Al exhalar CO₂ baja el ácido carbónico de la sangre: los pulmones ajustan el pH en minutos.', source: 'A&P 2e, 26.4' },
];

export function bioRound(rand: Rng, done: string[] = []): BioQuestion {
  const left = BIO_QUESTIONS.filter((q) => !done.includes(q.id));
  return pick(left.length ? left : BIO_QUESTIONS, rand);
}
