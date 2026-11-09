/**
 * Mundo 6 — Matemáticas químicas. Fuente principal: OpenStax Chemistry 2e, 3.1, 3.3, 4.3 y 4.4.
 * Todas las respuestas numéricas se recalculan con `core/chemistry` en las pruebas.
 */
import type { Module } from '@/core/learning/types';

import { num, sc, unit } from './build';
import { CIAAW, OPENSTAX_CHEM } from './sources';

const mol = unit({
  id: 'w6-u1-mol',
  title: 'El mol y la masa molar',
  objectives: [
    'Usar el número de Avogadro para pasar de moles a partículas.',
    'Calcular masas molares y convertir gramos ↔ moles.',
  ],
  concepts: [
    { id: 'w6.mol', name: 'Mol y número de Avogadro', prerequisites: ['w5.balanceo'] },
    { id: 'w6.masamolar', name: 'Masa molar y gramos ↔ moles', prerequisites: ['w5.balanceo'] },
  ],
  sources: [OPENSTAX_CHEM('3.1 Formula Mass and the Mole Concept'), CIAAW],
  intro: [
    'Contar átomos pesándolos',
    'Un vaso de agua tiene unas 8 × 10²⁴ moléculas. Nadie puede contar eso, pero sí pesarlo. El mol es el puente entre lo que pesamos y lo que contamos.',
  ],
  simple: [
    'La idea sencilla',
    'Un mol es un número fijo de partículas: 6,022 × 10²³. La masa molar es lo que pesa un mol de una sustancia, en gramos. Se calcula sumando las masas atómicas de su fórmula.',
  ],
  analogy: {
    text: 'Metáfora: "una docena" son 12 cosas, sean huevos o elefantes. "Un mol" son 6,022 × 10²³ partículas, sean átomos o moléculas.',
    limits: 'Una docena de elefantes pesa más que una de huevos; igual, un mol de cada sustancia tiene masa distinta (su masa molar).',
  },
  everyday: [
    'En tu vida',
    'Los análisis clínicos expresan muchos valores en milimoles por litro (mmol/L), como el sodio o la glucosa. Detrás de esos números está el mol.',
  ],
  visual: [
    'El triángulo de conversiones',
    'gramos  ÷ masa molar →  moles  × 6,022·10²³ →  partículas\npartículas ÷ 6,022·10²³ → moles × masa molar → gramos',
  ],
  formal: [
    'Definiciones',
    'Mol (SI, desde 2019): cantidad de sustancia que contiene exactamente 6,02214076 × 10²³ entidades elementales (constante de Avogadro, N_A).\nMasa molar (M): masa de un mol de sustancia, en g/mol; numéricamente igual a la masa de la fórmula en u.\nn = m / M · N = n × N_A.\nMasas atómicas estándar (CIAAW, abreviadas): H 1,008 · C 12,011 · N 14,007 · O 15,999 · Na 22,990 · Cl 35,45.',
  ],
  worked: [
    'Ejemplo resuelto: moles en 36,0 g de agua',
    'M(H₂O) = 2 × 1,008 + 15,999 = 18,015 g/mol.\nn = 36,0 g ÷ 18,015 g/mol = 2,00 mol.\nMoléculas = 2,00 × 6,022 × 10²³ = 1,20 × 10²⁴.',
  ],
  guided: ['w6u1-q1', 'w6u1-q4'],
  independent: ['w6u1-q2', 'w6u1-q5'],
  quiz: ['w6u1-q3', 'w6u1-q6'],
  questions: [
    num(
      {
        id: 'w6u1-q1', concept: 'w6.mol', kind: 'concept', diff: 2,
        prompt: '¿Cuántas moléculas hay en 0,500 mol de CO₂? (Escribe en notación científica, p. ej. 3,0e23.)',
        hints: ['N = n × 6,022 × 10²³.'],
        explanation: '0,500 × 6,022 × 10²³ = 3,011 × 10²³ moléculas.',
      },
      3.011e23, 'moléculas', 0.01,
    ),
    num(
      {
        id: 'w6u1-q2', concept: 'w6.mol', kind: 'application', diff: 2,
        prompt: '¿Cuántos moles son 1,2044 × 10²⁴ átomos de hierro?',
        hints: ['n = N ÷ 6,022 × 10²³.'],
        explanation: '1,2044 × 10²⁴ ÷ 6,022 × 10²³ = 2,000 mol.',
      },
      2, 'mol', 0.01,
    ),
    sc(
      {
        id: 'w6u1-q3', concept: 'w6.mol', kind: 'retention', diff: 3,
        prompt: '¿Qué contiene más átomos: 1 mol de He o 1 mol de H₂O?',
        hints: ['Cada molécula de H₂O tiene 3 átomos.'],
        explanation: 'Los dos tienen 6,022 × 10²³ unidades, pero cada molécula de agua tiene 3 átomos: 1 mol de H₂O tiene 3 veces más átomos.',
      },
      [
        ['1 mol de H₂O'],
        ['1 mol de He', 'Ambos tienen las mismas unidades, pero cada H₂O aporta 3 átomos.'],
        ['Los dos igual', 'Igual número de unidades (moléculas o átomos), pero no de átomos totales.'],
      ],
    ),
    num(
      {
        id: 'w6u1-q4', concept: 'w6.masamolar', kind: 'concept', diff: 2,
        prompt: 'Calcula la masa molar del NaCl (Na 22,990; Cl 35,45).',
        hints: ['Suma las masas atómicas de la fórmula.'],
        explanation: '22,990 + 35,45 = 58,44 g/mol.',
      },
      58.44, 'g/mol', 0.002,
    ),
    num(
      {
        id: 'w6u1-q5', concept: 'w6.masamolar', kind: 'application', diff: 3,
        prompt: 'Calcula la masa molar de la glucosa, C₆H₁₂O₆ (C 12,011; H 1,008; O 15,999).',
        hints: ['6 × 12,011 + 12 × 1,008 + 6 × 15,999.'],
        explanation: '72,066 + 12,096 + 95,994 = 180,16 g/mol.',
      },
      180.16, 'g/mol', 0.002,
    ),
    num(
      {
        id: 'w6u1-q6', concept: 'w6.masamolar', kind: 'problem', diff: 3,
        prompt: '¿Cuántos moles hay en 117 g de NaCl (M = 58,44 g/mol)?',
        hints: ['n = m ÷ M.'],
        explanation: '117 g ÷ 58,44 g/mol = 2,00 mol.',
      },
      2.0, 'mol', 0.01,
    ),
  ],
});

const esteq = unit({
  id: 'w6-u2-estequiometria',
  title: 'Estequiometría y disoluciones',
  objectives: [
    'Usar relaciones molares de una ecuación balanceada.',
    'Identificar el reactivo limitante y calcular el rendimiento porcentual.',
    'Calcular molaridad y diluciones.',
  ],
  concepts: [
    { id: 'w6.estequiometria', name: 'Estequiometría y reactivo limitante', prerequisites: ['w6.masamolar'] },
    { id: 'w6.disoluciones', name: 'Molaridad y diluciones', prerequisites: ['w6.masamolar'] },
  ],
  sources: [OPENSTAX_CHEM('3.3 Molarity; 3.4 Other Units for Solution Concentrations; 4.3 Reaction Stoichiometry; 4.4 Reaction Yields')],
  intro: [
    '¿Cuánto necesito y cuánto obtendré?',
    'En un laboratorio clínico o en una farmacia hay que saber cuánto de cada sustancia usar. La estequiometría responde con la ecuación balanceada como receta.',
  ],
  simple: [
    'La idea sencilla',
    'Los coeficientes de una ecuación balanceada dicen la proporción en moles. Si un reactivo se acaba antes, limita cuánto producto sale: es el reactivo limitante. La molaridad dice cuántos moles hay en cada litro de disolución.',
  ],
  analogy: {
    text: 'Metáfora: para un sándwich necesitas 2 panes y 1 queso. Con 10 panes y 3 quesos solo haces 3 sándwiches: el queso es el limitante.',
    limits: 'En química la proporción es en moles, no en gramos ni en unidades visibles; hay que convertir antes de comparar.',
  },
  everyday: [
    'En tu vida',
    'Para preparar una dosis a partir de un vial concentrado, en enfermería y farmacia se usa la misma fórmula de dilución: C₁V₁ = C₂V₂.',
  ],
  visual: [
    'Ruta de un problema',
    'gramos de A → moles de A → (coeficientes) → moles de B → gramos de B\nMolaridad: M = moles de soluto ÷ litros de disolución · Dilución: C₁V₁ = C₂V₂',
  ],
  formal: [
    'Definiciones',
    'Relación molar: cociente de coeficientes de la ecuación balanceada.\nReactivo limitante: el que se consume por completo primero y fija la cantidad máxima de producto (rendimiento teórico).\nRendimiento porcentual = (rendimiento real ÷ rendimiento teórico) × 100.\nMolaridad (M, mol/L): moles de soluto por litro de disolución (no de disolvente).\nDilución: al añadir disolvente, los moles de soluto no cambian: C₁V₁ = C₂V₂.',
  ],
  worked: [
    'Ejemplo resuelto: dilución',
    'Tienes 50,0 mL de HCl 2,00 M y lo llevas a 200 mL con agua.\nC₂ = C₁V₁ ÷ V₂ = 2,00 × 50,0 ÷ 200 = 0,500 M.\n(Los mL se cancelan: no hace falta pasar a litros si V₁ y V₂ están en la misma unidad.)',
  ],
  guided: ['w6u2-q1', 'w6u2-q4'],
  independent: ['w6u2-q2', 'w6u2-q5'],
  quiz: ['w6u2-q3', 'w6u2-q6'],
  questions: [
    num(
      {
        id: 'w6u2-q1', concept: 'w6.estequiometria', kind: 'concept', diff: 2,
        prompt: 'En 2 H₂ + O₂ → 2 H₂O, ¿cuántos moles de agua se forman con 4,0 mol de H₂ (O₂ en exceso)?',
        hints: ['Relación molar H₂ : H₂O = 2 : 2.'],
        explanation: '4,0 mol H₂ × (2 mol H₂O / 2 mol H₂) = 4,0 mol H₂O.',
      },
      4, 'mol', 0.01,
    ),
    sc(
      {
        id: 'w6u2-q2', concept: 'w6.estequiometria', kind: 'application', diff: 3,
        prompt: 'En 2 H₂ + O₂ → 2 H₂O mezclas 2 mol de H₂ con 2 mol de O₂. ¿Cuál es el reactivo limitante?',
        hints: ['2 mol de H₂ necesitan 1 mol de O₂. ¿Hay suficiente O₂?'],
        explanation: '2 mol H₂ solo necesitan 1 mol O₂; sobra 1 mol O₂. El H₂ se acaba primero: es el limitante.',
      },
      [
        ['H₂'],
        ['O₂', 'Hay 2 mol de O₂ y solo se necesita 1: está en exceso.'],
        ['Ninguno', 'Las cantidades no están en la proporción 2 : 1.'],
      ],
    ),
    num(
      {
        id: 'w6u2-q3', concept: 'w6.estequiometria', kind: 'problem', diff: 2,
        prompt: 'El rendimiento teórico de una síntesis es 50,0 g y obtienes 40,0 g. ¿Cuál es el rendimiento porcentual?',
        hints: ['(real ÷ teórico) × 100.'],
        explanation: '40,0 ÷ 50,0 × 100 = 80,0 %.',
      },
      80, '%', 0.01,
    ),
    num(
      {
        id: 'w6u2-q4', concept: 'w6.disoluciones', kind: 'concept', diff: 2,
        prompt: 'Disuelves 0,50 mol de glucosa y completas hasta 250 mL de disolución. ¿Cuál es la molaridad?',
        hints: ['Pasa 250 mL a litros: 0,250 L.'],
        explanation: 'M = 0,50 mol ÷ 0,250 L = 2,0 M.',
      },
      2, 'M', 0.01,
    ),
    num(
      {
        id: 'w6u2-q5', concept: 'w6.disoluciones', kind: 'application', diff: 3,
        prompt: '¿Cuál es la molaridad de 5,844 g de NaCl (M = 58,44 g/mol) disueltos en 500 mL de disolución?',
        hints: ['Primero moles: 5,844 ÷ 58,44.', 'Luego divide entre 0,500 L.'],
        explanation: 'n = 0,1000 mol; M = 0,1000 ÷ 0,500 = 0,200 M.',
      },
      0.2, 'M', 0.01,
    ),
    num(
      {
        id: 'w6u2-q6', concept: 'w6.disoluciones', kind: 'problem', diff: 3,
        prompt: '¿Qué volumen (mL) de una disolución 1,00 M necesitas para preparar 250 mL a 0,200 M?',
        hints: ['C₁V₁ = C₂V₂ → V₁ = C₂V₂ ÷ C₁.'],
        explanation: 'V₁ = 0,200 × 250 ÷ 1,00 = 50,0 mL (y completas con agua hasta 250 mL).',
      },
      50, 'mL', 0.01,
    ),
  ],
});

export const WORLD6_MODULES: Module[] = [{ id: 'w6-mod1', title: 'Contar con el mol', units: [mol, esteq] }];

