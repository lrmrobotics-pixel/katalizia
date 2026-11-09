/** Mundo 7 — Soluciones, ácidos y bases. Fuente principal: OpenStax Chemistry 2e, 11.1–11.3, 14.1–14.6. */
import type { Module } from '@/core/learning/types';

import { match, mc, num, sc, unit } from './build';
import { OPENSTAX_CHEM } from './sources';

const teorias = unit({
  id: 'w7-u1-teorias',
  title: 'Disoluciones y teorías ácido-base',
  objectives: [
    'Distinguir soluto, disolvente y expresar concentraciones (% m/v).',
    'Reconocer ácidos y bases según Arrhenius, Brønsted-Lowry y Lewis.',
    'Identificar pares conjugados.',
  ],
  concepts: [
    { id: 'w7.disoluciones', name: 'Disoluciones y concentración', prerequisites: ['w6.disoluciones'] },
    { id: 'w7.teorias', name: 'Teorías ácido-base y pares conjugados', prerequisites: ['w5.tipos'] },
  ],
  sources: [OPENSTAX_CHEM('11.1 The Dissolution Process; 14.1 Brønsted-Lowry Acids and Bases; 15.2 Lewis Acids and Bases')],
  intro: [
    'Lo ácido está en todas partes',
    'El jugo gástrico, el limón, el vinagre y hasta tu sangre (ligeramente básica) tienen algo que ver con un solo ion: H⁺.',
  ],
  simple: [
    'La idea sencilla',
    'En una disolución, el soluto se disuelve en el disolvente (en biología, casi siempre agua). Un ácido es una sustancia que cede H⁺; una base, una que los acepta. Cuando un ácido cede su H⁺, lo que queda es su base conjugada.',
  ],
  analogy: {
    text: 'Metáfora: el H⁺ es una pelota que pasa de mano en mano. Quien la lanza es el ácido; quien la atrapa, la base.',
    limits: 'En el agua, el H⁺ no anda suelto: se une a una molécula de agua y forma H₃O⁺ (ion hidronio).',
  },
  everyday: [
    'En tu vida',
    'El suero fisiológico es NaCl al 0,9 % m/v: 0,9 g de sal por cada 100 mL. Los antiácidos son bases débiles (como el carbonato de calcio) que neutralizan parte del ácido del estómago.',
  ],
  visual: [
    'Pares conjugados',
    'HCl + H₂O → H₃O⁺ + Cl⁻\nácido · base · ácido conjugado · base conjugada\nNH₃ + H₂O ⇌ NH₄⁺ + OH⁻ (aquí el agua actúa como ácido)',
  ],
  formal: [
    'Definiciones',
    'Disolución: mezcla homogénea de soluto y disolvente.\n% m/v = (g de soluto ÷ mL de disolución) × 100.\nArrhenius: ácido produce H⁺ en agua; base produce OH⁻.\nBrønsted-Lowry: ácido = donador de protones (H⁺); base = aceptor de protones.\nLewis: ácido = aceptor de un par de electrones; base = donador de un par.\nPar conjugado: dos especies que difieren en un H⁺ (HA / A⁻).\nAnfótero: puede actuar como ácido o como base (el agua).',
  ],
  worked: [
    'Ejemplo resuelto: base conjugada del ácido acético',
    'CH₃COOH + H₂O ⇌ CH₃COO⁻ + H₃O⁺\nEl ácido acético cede un H⁺ → su base conjugada es el ion acetato, CH₃COO⁻.\nEl agua acepta el H⁺ → su ácido conjugado es H₃O⁺.',
  ],
  guided: ['w7u1-q1', 'w7u1-q4'],
  independent: ['w7u1-q2', 'w7u1-q5'],
  quiz: ['w7u1-q3', 'w7u1-q6'],
  questions: [
    num(
      {
        id: 'w7u1-q1', concept: 'w7.disoluciones', kind: 'concept', diff: 2,
        prompt: '¿Cuántos gramos de NaCl hay en 500 mL de suero fisiológico al 0,9 % m/v?',
        hints: ['0,9 % m/v = 0,9 g por cada 100 mL.'],
        explanation: '0,9 g/100 mL × 500 mL = 4,5 g de NaCl.',
      },
      4.5, 'g', 0.01,
    ),
    sc(
      {
        id: 'w7u1-q2', concept: 'w7.disoluciones', kind: 'application', diff: 2,
        prompt: 'En una bebida de agua con azúcar, ¿cuál es el disolvente?',
        hints: ['El disolvente suele ser el componente en mayor cantidad.'],
        explanation: 'El agua es el disolvente (mayor proporción) y el azúcar, el soluto.',
      },
      [
        ['El agua'],
        ['El azúcar', 'El azúcar es el soluto: se disuelve en el agua.'],
        ['Los dos a la vez', 'En una disolución se distingue soluto y disolvente.'],
      ],
    ),
    sc(
      {
        id: 'w7u1-q3', concept: 'w7.disoluciones', kind: 'problem', diff: 3,
        prompt: '¿Por qué el aceite no se disuelve en agua, pero la sal sí?',
        hints: ['"Lo semejante disuelve a lo semejante". ¿Es el aceite polar?'],
        explanation: 'El agua es polar y disuelve iones y moléculas polares. El aceite es casi apolar: no interacciona bien con el agua.',
      },
      [
        ['El agua es polar y el aceite es apolar'],
        ['El aceite es más denso que el agua', 'De hecho el aceite es menos denso (flota); la densidad no decide la solubilidad.'],
        ['La sal es un líquido', 'La sal es un sólido iónico.'],
      ],
    ),
    match(
      {
        id: 'w7u1-q4', concept: 'w7.teorias', kind: 'concept', diff: 2,
        prompt: 'Empareja cada definición con su teoría.',
        hints: ['Lewis habla de pares de electrones; Brønsted-Lowry, de protones.'],
        explanation: 'Arrhenius: H⁺ y OH⁻ en agua. Brønsted-Lowry: transferencia de protones. Lewis: pares de electrones.',
      },
      [
        ['Ácido: produce H⁺ en agua', 'Arrhenius'],
        ['Ácido: donador de protones', 'Brønsted-Lowry'],
        ['Ácido: aceptor de un par de electrones', 'Lewis'],
      ],
    ),
    sc(
      {
        id: 'w7u1-q5', concept: 'w7.teorias', kind: 'application', diff: 3,
        prompt: '¿Cuál es la base conjugada del ion amonio, NH₄⁺?',
        hints: ['Quita un H⁺ (un H y una carga +).'],
        explanation: 'NH₄⁺ − H⁺ = NH₃ (amoníaco).',
      },
      [
        ['NH₃'],
        ['NH₅²⁺', 'Eso sería añadir un H⁺; la base conjugada se obtiene quitándolo.'],
        ['NH₂⁻', 'Quitaste dos H⁺.'],
      ],
    ),
    sc(
      {
        id: 'w7u1-q6', concept: 'w7.teorias', kind: 'retention', diff: 3,
        prompt: 'En HCl + NH₃ → NH₄⁺ + Cl⁻, ¿qué papel tiene el NH₃ según Brønsted-Lowry?',
        hints: ['¿Quién recibe el H⁺?'],
        explanation: 'El NH₃ acepta el H⁺ del HCl: es la base. El HCl es el ácido.',
      },
      [
        ['Base (acepta un protón)'],
        ['Ácido (cede un protón)', 'El NH₃ gana un H⁺ al pasar a NH₄⁺.'],
        ['No participa', 'Se transforma en NH₄⁺.'],
      ],
    ),
  ],
});

const ph = unit({
  id: 'w7-u2-ph',
  title: 'pH, neutralización y amortiguadores',
  objectives: [
    'Calcular el pH de ácidos y bases fuertes.',
    'Interpretar la escala logarítmica del pH.',
    'Explicar qué es un amortiguador y por qué importa en el cuerpo.',
  ],
  concepts: [
    { id: 'w7.ph', name: 'Escala de pH', prerequisites: ['w7.teorias'] },
    { id: 'w7.buffers', name: 'Neutralización y amortiguadores', prerequisites: ['w7.teorias'] },
  ],
  sources: [OPENSTAX_CHEM('14.2 pH and pOH; 14.6 Buffers; 14.7 Acid-Base Titrations')],
  intro: [
    'Un número que salva vidas',
    'El pH de tu sangre se mantiene entre 7,35 y 7,45. Un cambio de unas décimas ya es un problema médico. Entender el pH es entender por qué.',
  ],
  simple: [
    'La idea sencilla',
    'El pH mide la concentración de H⁺ (H₃O⁺). pH < 7 es ácido, 7 neutro (a 25 °C) y > 7 básico. La escala es logarítmica: una unidad menos de pH significa 10 veces más H⁺.',
  ],
  analogy: {
    text: 'Metáfora: la escala de pH es como la de los terremotos: cada punto es un salto de 10 veces.',
    limits: 'Solo se parecen en que ambas son logarítmicas; miden cosas completamente distintas.',
  },
  everyday: [
    'En tu vida',
    'Jugo gástrico: pH ≈ 1,5–3,5. Café: ≈ 5. Sangre: 7,35–7,45. Jabón: ≈ 9–10. El amortiguador bicarbonato/ácido carbónico es uno de los principales sistemas que mantienen estable el pH de la sangre.',
  ],
  visual: ['La escala de pH', 'Ácido ← 0 · · · 7 · · · 14 → Básico', 'ph-scale'],
  formal: [
    'Definiciones',
    'pH = −log[H₃O⁺] · pOH = −log[OH⁻] · pH + pOH = 14,00 (a 25 °C).\nÁcido fuerte (HCl, HNO₃): se disocia por completo → [H₃O⁺] = concentración del ácido.\nNeutralización: ácido + base → sal + agua (H₃O⁺ + OH⁻ → 2 H₂O).\nAmortiguador (tampón): mezcla de un ácido débil y su base conjugada (o base débil y su ácido conjugado) que resiste cambios de pH.\nHenderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]). Si [A⁻] = [HA], pH = pKa.',
  ],
  worked: [
    'Ejemplo resuelto: pH de HCl 0,010 M',
    'HCl es fuerte → [H₃O⁺] = 0,010 M = 1,0 × 10⁻².\npH = −log(1,0 × 10⁻²) = 2,00.\nPara una base fuerte, p. ej. NaOH 0,0010 M: pOH = 3,00 → pH = 14,00 − 3,00 = 11,00.',
  ],
  guided: ['w7u2-q1', 'w7u2-q4'],
  independent: ['w7u2-q2', 'w7u2-q5'],
  quiz: ['w7u2-q3', 'w7u2-q6'],
  questions: [
    num(
      {
        id: 'w7u2-q1', concept: 'w7.ph', kind: 'concept', diff: 2,
        prompt: '¿Cuál es el pH de una disolución de HCl 0,010 M?',
        hints: ['Ácido fuerte: [H₃O⁺] = 0,010 M.', 'pH = −log[H₃O⁺].'],
        explanation: 'pH = −log(0,010) = 2,00.',
      },
      2, undefined, 0.01,
    ),
    num(
      {
        id: 'w7u2-q2', concept: 'w7.ph', kind: 'application', diff: 3,
        prompt: '¿Cuál es el pH de NaOH 0,0010 M a 25 °C?',
        hints: ['Base fuerte: [OH⁻] = 0,0010 M → pOH.', 'pH = 14,00 − pOH.'],
        explanation: 'pOH = −log(0,0010) = 3,00; pH = 14,00 − 3,00 = 11,00.',
      },
      11, undefined, 0.01,
    ),
    num(
      {
        id: 'w7u2-q3', concept: 'w7.ph', kind: 'problem', diff: 3,
        prompt: 'Una disolución A tiene pH 3 y otra B pH 5. ¿Cuántas veces mayor es [H₃O⁺] en A que en B?',
        hints: ['Cada unidad de pH es un factor 10.'],
        explanation: '10^(5 − 3) = 10² = 100 veces más H₃O⁺ en A.',
      },
      100, 'veces', 0.01,
    ),
    num(
      {
        id: 'w7u2-q4', concept: 'w7.buffers', kind: 'concept', diff: 2,
        prompt: '¿Qué volumen (mL) de NaOH 0,100 M neutraliza exactamente 25,0 mL de HCl 0,100 M?',
        hints: ['La reacción es 1 : 1. Moles de HCl = 0,100 × 0,0250 L.'],
        explanation: 'n(HCl) = 2,50 × 10⁻³ mol; se necesitan 2,50 × 10⁻³ mol de NaOH → 25,0 mL de NaOH 0,100 M.',
      },
      25, 'mL', 0.01,
    ),
    mc(
      {
        id: 'w7u2-q5', concept: 'w7.buffers', kind: 'application', diff: 3,
        prompt: '¿Qué mezclas forman un amortiguador?',
        hints: ['Necesitas un ácido DÉBIL con su base conjugada (o base débil con su ácido conjugado).'],
        explanation: 'CH₃COOH/CH₃COONa y H₂CO₃/NaHCO₃ son pares débil–conjugado. HCl/NaCl no: HCl es un ácido fuerte. NaCl solo no tiene ácido débil.',
      },
      [
        ['Ácido acético + acetato de sodio'],
        ['Ácido carbónico + bicarbonato de sodio'],
        ['HCl + NaCl', 'El HCl es un ácido fuerte: su base conjugada (Cl⁻) no neutraliza ácidos añadidos.'],
        ['Solo NaCl en agua', 'No contiene ningún ácido débil ni su base conjugada.'],
      ],
    ),
    num(
      {
        id: 'w7u2-q6', concept: 'w7.buffers', kind: 'problem', diff: 4,
        prompt: 'Un amortiguador tiene concentraciones iguales de ácido acético y acetato (pKa = 4,76). ¿Cuál es su pH?',
        hints: ['Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]).', 'log(1) = 0.'],
        explanation: 'Con [A⁻] = [HA], log(1) = 0 → pH = pKa = 4,76.',
      },
      4.76, undefined, 0.005,
    ),
  ],
});

export const WORLD7_MODULES: Module[] = [{ id: 'w7-mod1', title: 'Ácidos, bases y pH', units: [teorias, ph] }];
