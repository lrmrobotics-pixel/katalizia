/**
 * Ayudantes para escribir unidades de forma compacta sin perder estructura.
 * `unit()` arma los 10 pasos pedagógicos en el orden fijo; los ayudantes de preguntas
 * generan ids de opciones y mezclan de forma determinista las listas de emparejar/ordenar
 * (ordenadas alfabéticamente) para que la respuesta no coincida con el orden mostrado.
 */
import type {
  ChoiceQuestion,
  Concept,
  EvidenceKind,
  LessonStep,
  MatchQuestion,
  NumericQuestion,
  OrderQuestion,
  Question,
  SourceRef,
  Unit,
} from '@/core/learning/types';

type Diff = 1 | 2 | 3 | 4 | 5;
type Text = [title: string, body: string];

export interface UnitSpec {
  id: string;
  title: string;
  objectives: string[];
  concepts: Concept[];
  sources: SourceRef[];
  intro: Text;
  simple: Text;
  /** Metáfora marcada como tal, con sus límites (se muestra en el paso "sencillo"). */
  analogy?: { text: string; limits: string };
  everyday: Text;
  /** [título, texto, id de visual opcional de `components/lesson/Visuals`]. */
  visual: [title: string, body: string, visualId?: string];
  formal: Text;
  worked: Text;
  guided: string[];
  independent: string[];
  quiz: string[];
  questions: Question[];
}

export function unit(s: UnitSpec): Unit {
  const [vt, vb, vid] = s.visual;
  const steps: LessonStep[] = [
    { kind: 'intro', title: s.intro[0], body: s.intro[1] },
    { kind: 'simple', title: s.simple[0], body: s.simple[1], ...(s.analogy ? { analogy: s.analogy } : {}) },
    { kind: 'everyday-example', title: s.everyday[0], body: s.everyday[1] },
    { kind: 'visual', title: vt, body: vb, ...(vid ? { visualId: vid } : {}) },
    { kind: 'formal', title: s.formal[0], body: s.formal[1] },
    { kind: 'worked-example', title: s.worked[0], body: s.worked[1] },
    { kind: 'guided-practice', title: 'Práctica guiada', questionIds: s.guided },
    { kind: 'independent-practice', title: 'Ahora tú sola', questionIds: s.independent },
    { kind: 'quiz', title: 'Evaluación corta', questionIds: s.quiz },
    { kind: 'error-review', title: 'Repaso de errores' },
  ];
  return {
    id: s.id,
    title: s.title,
    objectives: s.objectives,
    concepts: s.concepts,
    sources: s.sources,
    steps,
    questions: s.questions,
  };
}

interface Meta {
  id: string;
  concept: string;
  kind: EvidenceKind;
  diff: Diff;
  prompt: string;
  hints: string[];
  explanation: string;
}

const LETTERS = 'abcdefgh';

/** Opción: [texto] si es correcta, [texto, error conceptual] si es distractor. */
type Opt = [text: string] | [text: string, misconception: string];

function choice(type: 'single-choice' | 'multi-choice', m: Meta, opts: Opt[]): ChoiceQuestion {
  const options = opts.map((o, i) => ({ id: LETTERS[i], text: o[0], ...(o[1] ? { misconception: o[1] } : {}) }));
  return {
    id: m.id,
    conceptId: m.concept,
    type,
    kind: m.kind,
    difficulty: m.diff,
    prompt: m.prompt,
    hints: m.hints,
    explanation: m.explanation,
    options,
    correct: options.filter((o) => !o.misconception).map((o) => o.id),
  };
}

/** Opción única: exactamente una opción sin error conceptual. */
export const sc = (m: Meta, opts: Opt[]) => choice('single-choice', m, opts);
/** Selección múltiple: todas las opciones sin error conceptual son correctas. */
export const mc = (m: Meta, opts: Opt[]) => choice('multi-choice', m, opts);

export function num(m: Meta, answer: number, unit: string | undefined, tolerance = 0.02): NumericQuestion {
  return {
    id: m.id,
    conceptId: m.concept,
    type: 'numeric',
    kind: m.kind,
    difficulty: m.diff,
    prompt: m.prompt,
    hints: m.hints,
    explanation: m.explanation,
    answer,
    ...(unit ? { unit } : {}),
    tolerance,
  };
}

const byText = <T extends { text: string }>(xs: T[]) => [...xs].sort((a, b) => a.text.localeCompare(b.text, 'es'));

/** Emparejar: pares [izquierda, derecha]; la columna derecha se muestra ordenada alfabéticamente. */
export function match(m: Meta, pairs: [string, string][]): MatchQuestion {
  const left = pairs.map(([l], i) => ({ id: `l${i}`, text: l }));
  const rightTexts = [...new Set(pairs.map(([, r]) => r))];
  const right = byText(rightTexts.map((t, i) => ({ id: `r${i}`, text: t })));
  const idOf = (t: string) => right.find((r) => r.text === t)!.id;
  return {
    id: m.id,
    conceptId: m.concept,
    type: 'match',
    kind: m.kind,
    difficulty: m.diff,
    prompt: m.prompt,
    hints: m.hints,
    explanation: m.explanation,
    left,
    right,
    pairs: Object.fromEntries(pairs.map(([, r], i) => [`l${i}`, idOf(r)])),
  };
}

/** Ordenar: `inOrder` es el orden correcto; se muestra ordenado alfabéticamente. */
export function order(m: Meta, inOrder: string[]): OrderQuestion {
  const items = inOrder.map((t, i) => ({ id: `i${i}`, text: t }));
  return {
    id: m.id,
    conceptId: m.concept,
    type: 'order',
    kind: m.kind,
    difficulty: m.diff,
    prompt: m.prompt,
    hints: m.hints,
    explanation: m.explanation,
    items: byText(items),
    correctOrder: items.map((i) => i.id),
  };
}
