/**
 * Corrección de respuestas. Devuelve además el error conceptual detectado
 * (para explicar el fallo, no solo marcarlo).
 */
import type { Question } from './types';

export type Answer =
  | { type: 'single-choice' | 'multi-choice'; selected: string[] }
  | { type: 'numeric'; value: string }
  | { type: 'order'; order: string[] }
  | { type: 'match'; pairs: Record<string, string> }
  | { type: 'short-text'; text: string };

export interface GradeResult {
  correct: boolean;
  /** Mensajes de error conceptual asociados a lo que eligió. */
  misconceptions: string[];
  /** Para numéricas: la respuesta no se pudo leer como número. */
  invalid?: boolean;
}

/** Acepta coma o punto decimal y notación "2.5e-3" / "2,5 × 10^-3". */
export function parseNumber(raw: string): number | null {
  // Acepta el signo menos tipográfico (−) además del guion.
  let s = raw.trim().replace(/\s+/g, '').replace(',', '.').replace(/^−/, '-');
  const sci = /^([-+]?\d*\.?\d+)(?:[x×*]10\^?([-+−]?\d+))$/i.exec(s);
  if (sci) return Number(sci[1]) * 10 ** Number(sci[2].replace('−', '-'));
  s = s.replace(/[a-zA-Zµ/%°²³]+$/, ''); // quita unidad escrita al final
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return null;
  return Number(s);
}

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export function grade(q: Question, a: Answer): GradeResult {
  switch (q.type) {
    case 'single-choice':
    case 'multi-choice': {
      if (a.type !== 'single-choice' && a.type !== 'multi-choice') break;
      const sel = new Set(a.selected);
      const want = new Set(q.correct);
      const correct = sel.size === want.size && [...want].every((x) => sel.has(x));
      const misconceptions = q.options
        .filter((o) => sel.has(o.id) && !want.has(o.id) && o.misconception)
        .map((o) => o.misconception!);
      return { correct, misconceptions };
    }
    case 'numeric': {
      if (a.type !== 'numeric') break;
      const v = parseNumber(a.value);
      if (v === null) return { correct: false, misconceptions: [], invalid: true };
      const tol = Math.abs(q.answer) * q.tolerance || q.tolerance;
      const correct = Math.abs(v - q.answer) <= tol;
      const misconceptions: string[] = [];
      if (!correct && q.answer !== 0) {
        const ratio = v / q.answer;
        if ([1e3, 1e-3, 1e6, 1e-6, 10, 0.1].some((r) => Math.abs(ratio / r - 1) < 0.02)) {
          misconceptions.push('Tu resultado difiere en una potencia de 10: revisa la conversión de unidades o los prefijos.');
        }
      }
      return { correct, misconceptions };
    }
    case 'order': {
      if (a.type !== 'order') break;
      return { correct: a.order.join('|') === q.correctOrder.join('|'), misconceptions: [] };
    }
    case 'match': {
      if (a.type !== 'match') break;
      const correct = Object.entries(q.pairs).every(([l, r]) => a.pairs[l] === r);
      return { correct, misconceptions: [] };
    }
    case 'short-text': {
      if (a.type !== 'short-text') break;
      const t = norm(a.text);
      return { correct: q.accepted.some((x) => norm(x) === t), misconceptions: [] };
    }
  }
  return { correct: false, misconceptions: [], invalid: true };
}

/** Fracción de aciertos (0–1) de una evaluación. */
export const scoreOf = (results: boolean[]) => (results.length ? results.filter(Boolean).length / results.length : 0);
