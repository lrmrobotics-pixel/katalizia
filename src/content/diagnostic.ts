/**
 * Evaluación diagnóstica inicial. Mide áreas, no concede dominio:
 * nunca desbloquea contenido (la app no asume conocimientos previos).
 */
import type { Question } from '@/core/learning/types';

export type DiagnosticArea = 'matematicas' | 'conceptos' | 'interpretacion';

export const AREA_LABELS: Record<DiagnosticArea, string> = {
  matematicas: 'Matemáticas básicas',
  conceptos: 'Conceptos químicos',
  interpretacion: 'Interpretación de problemas',
};

export const DIAGNOSTIC: (Question & { area: DiagnosticArea })[] = [
  {
    id: 'd1', area: 'matematicas', conceptId: 'diag', type: 'numeric', kind: 'application', difficulty: 1,
    prompt: '¿Cuánto es 3/4 expresado como decimal?', answer: 0.75, tolerance: 0.001,
    hints: [], explanation: '3 ÷ 4 = 0.75.',
  },
  {
    id: 'd2', area: 'matematicas', conceptId: 'diag', type: 'numeric', kind: 'application', difficulty: 2,
    prompt: 'Si x / 2.5 = 4, ¿cuánto vale x?', answer: 10, tolerance: 0.001,
    hints: [], explanation: 'Despejando: x = 4 × 2.5 = 10.',
  },
  {
    id: 'd3', area: 'matematicas', conceptId: 'diag', type: 'numeric', kind: 'application', difficulty: 2,
    prompt: '¿Cuánto es el 20 % de 150?', answer: 30, tolerance: 0.001,
    hints: [], explanation: '0.20 × 150 = 30.',
  },
  {
    id: 'd4', area: 'matematicas', conceptId: 'diag', type: 'single-choice', kind: 'concept', difficulty: 2,
    prompt: '10³ × 10⁻⁵ es igual a…',
    options: [
      { id: 'a', text: '10⁻²' },
      { id: 'b', text: '10⁻¹⁵', misconception: 'Al multiplicar potencias de igual base, los exponentes se suman, no se multiplican.' },
      { id: 'c', text: '10⁸', misconception: 'Revisa el signo: 3 + (−5) = −2.' },
    ],
    correct: ['a'], hints: [], explanation: 'Se suman exponentes: 3 + (−5) = −2.',
  },
  {
    id: 'd5', area: 'conceptos', conceptId: 'diag', type: 'single-choice', kind: 'concept', difficulty: 1,
    prompt: '¿Qué partícula tiene carga negativa?',
    options: [
      { id: 'a', text: 'Protón', misconception: 'El protón es positivo.' },
      { id: 'b', text: 'Neutrón', misconception: 'El neutrón no tiene carga.' },
      { id: 'c', text: 'Electrón' },
    ],
    correct: ['c'], hints: [], explanation: 'El electrón tiene carga negativa; el protón positiva; el neutrón es neutro.',
  },
  {
    id: 'd6', area: 'conceptos', conceptId: 'diag', type: 'single-choice', kind: 'concept', difficulty: 2,
    prompt: 'H₂O indica que una molécula de agua tiene…',
    options: [
      { id: 'a', text: '2 átomos de hidrógeno y 1 de oxígeno' },
      { id: 'b', text: '1 átomo de hidrógeno y 2 de oxígeno', misconception: 'El subíndice afecta al símbolo que lo precede.' },
      { id: 'c', text: '2 moléculas de hidrógeno y 1 de oxígeno', misconception: 'Dentro de una molécula hay átomos, no otras moléculas.' },
    ],
    correct: ['a'], hints: [], explanation: 'El subíndice 2 se refiere al H: dos átomos de hidrógeno y uno de oxígeno.',
  },
  {
    id: 'd7', area: 'conceptos', conceptId: 'diag', type: 'single-choice', kind: 'concept', difficulty: 2,
    prompt: 'Una disolución con pH 3 es…',
    options: [
      { id: 'a', text: 'Ácida' },
      { id: 'b', text: 'Neutra', misconception: 'Neutra es pH 7 (a 25 °C).' },
      { id: 'c', text: 'Básica', misconception: 'Básica es pH mayor que 7.' },
    ],
    correct: ['a'], hints: [], explanation: 'A 25 °C, pH menor que 7 indica disolución ácida.',
  },
  {
    id: 'd8', area: 'conceptos', conceptId: 'diag', type: 'single-choice', kind: 'concept', difficulty: 3,
    prompt: '¿Qué es un isótopo?',
    options: [
      { id: 'a', text: 'Átomos del mismo elemento con distinto número de neutrones' },
      { id: 'b', text: 'Átomos con distinto número de protones', misconception: 'Distinto número de protones = elemento distinto.' },
      { id: 'c', text: 'Un átomo con carga eléctrica', misconception: 'Eso es un ion.' },
    ],
    correct: ['a'], hints: [], explanation: 'Los isótopos tienen igual número de protones (mismo elemento) y distinto número de neutrones.',
  },
  {
    id: 'd9', area: 'interpretacion', conceptId: 'diag', type: 'numeric', kind: 'problem', difficulty: 2,
    prompt: 'Una receta usa 2 tazas de harina por cada 3 huevos. ¿Cuántas tazas necesitas para 9 huevos?', answer: 6, tolerance: 0.001,
    hints: [], explanation: 'Proporción 2/3: 9 × 2/3 = 6 tazas. Este razonamiento es la base de la estequiometría.',
  },
  {
    id: 'd10', area: 'interpretacion', conceptId: 'diag', type: 'numeric', kind: 'problem', difficulty: 3,
    prompt: 'Un jarabe tiene 5 mg de principio activo por cada mL. ¿Cuántos mg hay en 12 mL?', answer: 60, unit: 'mg', tolerance: 0.001,
    hints: [], explanation: '5 mg/mL × 12 mL = 60 mg. Las unidades mL se cancelan.',
  },
];

export interface DiagnosticResult {
  byArea: Record<DiagnosticArea, number>;
  recommendations: string[];
}

export function summarizeDiagnostic(correctById: Record<string, boolean>): DiagnosticResult {
  const byArea = { matematicas: 0, conceptos: 0, interpretacion: 0 } as Record<DiagnosticArea, number>;
  (Object.keys(byArea) as DiagnosticArea[]).forEach((area) => {
    const qs = DIAGNOSTIC.filter((q) => q.area === area);
    byArea[area] = qs.filter((q) => correctById[q.id]).length / qs.length;
  });
  const recommendations: string[] = ['Empieza por el Mundo 1: construiremos la base paso a paso, sin saltarnos nada.'];
  if (byArea.matematicas < 0.75) {
    recommendations.push('Refuerza fracciones, despejes y potencias de 10: en la unidad «Medir en química» Kata te guiará con calma.');
  }
  if (byArea.conceptos < 0.75) {
    recommendations.push('Varios conceptos (átomo, fórmulas, pH) son nuevos para ti: es normal, los verás en los Mundos 2 a 7.');
  }
  if (byArea.interpretacion < 1) {
    recommendations.push('Practica leer problemas con proporciones: es la habilidad clave para la estequiometría (Mundo 6).');
  }
  if (Object.values(byArea).every((v) => v === 1)) {
    recommendations.push('¡Gran punto de partida! Aun así, cada mundo se abre al demostrar dominio, para asegurar bases firmes.');
  }
  return { byArea, recommendations };
}
