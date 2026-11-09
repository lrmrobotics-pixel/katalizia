/**
 * Modelo de datos académico. Jerarquía: Mundo → Módulo → Unidad → Lección.
 * Las preguntas se vinculan a conceptos (`conceptId`); el dominio se mide por concepto.
 */

export interface SourceRef {
  title: string;
  institution: string;
  url?: string;
  /** Sección/capítulo concreto. */
  section?: string;
  /** Fecha de consulta ISO (YYYY-MM-DD). */
  accessed?: string;
}

export type EvidenceKind = 'concept' | 'application' | 'problem' | 'retention' | 'explain';

export type QuestionType = 'single-choice' | 'multi-choice' | 'numeric' | 'order' | 'match' | 'short-text';

interface QuestionBase {
  id: string;
  conceptId: string;
  type: QuestionType;
  kind: EvidenceKind;
  /** 1 (fácil) a 5 (difícil). */
  difficulty: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  /** Pistas progresivas; el tutor las revela una a una. */
  hints: string[];
  /** Explicación de la solución paso a paso. */
  explanation: string;
}

export interface ChoiceQuestion extends QuestionBase {
  type: 'single-choice' | 'multi-choice';
  options: { id: string; text: string; /** Error conceptual que revela esta opción. */ misconception?: string }[];
  correct: string[];
}

export interface NumericQuestion extends QuestionBase {
  type: 'numeric';
  answer: number;
  unit?: string;
  /** Tolerancia relativa (0.02 = ±2 %). */
  tolerance: number;
}

export interface OrderQuestion extends QuestionBase {
  type: 'order';
  items: { id: string; text: string }[];
  correctOrder: string[];
}

export interface MatchQuestion extends QuestionBase {
  type: 'match';
  left: { id: string; text: string }[];
  right: { id: string; text: string }[];
  pairs: Record<string, string>;
}

export interface ShortTextQuestion extends QuestionBase {
  type: 'short-text';
  /** Respuestas aceptadas (comparación normalizada). */
  accepted: string[];
}

export type Question = ChoiceQuestion | NumericQuestion | OrderQuestion | MatchQuestion | ShortTextQuestion;

/** Los 10 pasos pedagógicos de cada unidad. */
export type LessonStepKind =
  | 'intro'
  | 'simple'
  | 'everyday-example'
  | 'visual'
  | 'formal'
  | 'worked-example'
  | 'guided-practice'
  | 'independent-practice'
  | 'quiz'
  | 'error-review';

export interface LessonStep {
  kind: LessonStepKind;
  title: string;
  /** Texto en Markdown ligero. */
  body?: string;
  /** Las analogías se marcan explícitamente como metáforas. */
  analogy?: { text: string; limits: string };
  questionIds?: string[];
  visualId?: string;
}

export interface Concept {
  id: string;
  name: string;
  /** Conceptos que deben estar dominados antes. */
  prerequisites: string[];
}

export interface Unit {
  id: string;
  title: string;
  objectives: string[];
  concepts: Concept[];
  steps: LessonStep[];
  questions: Question[];
  sources: SourceRef[];
}

export interface Module {
  id: string;
  title: string;
  units: Unit[];
}

export interface World {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  color: string;
  objectives: string[];
  /** Mundos que deben estar dominados para desbloquear este. */
  requires: string[];
  modules: Module[];
}

/** Registro de una respuesta (evidencia de aprendizaje). */
export interface Attempt {
  questionId: string;
  conceptId: string;
  kind: EvidenceKind;
  correct: boolean;
  hintsUsed: number;
  at: number;
}
