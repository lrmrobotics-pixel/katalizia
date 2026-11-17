/**
 * Agrupa los 10 pasos pedagógicos fijos en las 5 fases visibles de la lección:
 * DESCUBRIR → EXPLORAR → COMPRENDER → PRACTICAR → DOMINAR.
 */
import type { LessonStepKind } from './types';

export const PHASES = ['Descubrir', 'Explorar', 'Comprender', 'Practicar', 'Dominar'] as const;
export type LessonPhase = (typeof PHASES)[number];

const MAP: Record<LessonStepKind, LessonPhase> = {
  intro: 'Descubrir',
  simple: 'Descubrir',
  'everyday-example': 'Descubrir',
  visual: 'Explorar',
  formal: 'Comprender',
  'worked-example': 'Comprender',
  'guided-practice': 'Practicar',
  'independent-practice': 'Practicar',
  quiz: 'Dominar',
  'error-review': 'Dominar',
};

export const phaseOf = (kind: LessonStepKind): LessonPhase => MAP[kind];
export const phaseIndex = (kind: LessonStepKind) => PHASES.indexOf(MAP[kind]);
