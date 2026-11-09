/**
 * Analizador de fórmulas químicas y cálculo de masa molar.
 *
 * Soporta: símbolos (H, Na), subíndices (H2O), paréntesis y corchetes anidados
 * (Ca(OH)2, K4[Fe(CN)6]), hidratos con "·", "." o "*" (CuSO4·5H2O) y subíndices
 * Unicode (H₂O). No soporta cargas iónicas.
 */
import { getElementBySymbol } from '@/data/elements';

export type Composition = Record<string, number>;

export class FormulaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormulaError';
  }
}

const SUBSCRIPTS: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
};

export function normalizeFormula(input: string): string {
  return input.replace(/[₀-₉]/g, (c) => SUBSCRIPTS[c]).replace(/\s+/g, '');
}

function add(target: Composition, source: Composition, factor: number) {
  for (const [el, n] of Object.entries(source)) {
    target[el] = (target[el] ?? 0) + n * factor;
  }
}

function parseSegment(s: string): Composition {
  let i = 0;
  const readNumber = (): number => {
    const start = i;
    while (i < s.length && /[0-9]/.test(s[i])) i++;
    return start === i ? 1 : Number(s.slice(start, i));
  };

  const parseGroup = (closer: string | null): Composition => {
    const comp: Composition = {};
    while (i < s.length) {
      const c = s[i];
      if (c === '(' || c === '[') {
        i++;
        const inner = parseGroup(c === '(' ? ')' : ']');
        add(comp, inner, readNumber());
      } else if (c === ')' || c === ']') {
        if (c !== closer) throw new FormulaError(`Paréntesis inesperado "${c}"`);
        i++;
        return comp;
      } else if (/[A-Z]/.test(c)) {
        let sym = c;
        i++;
        while (i < s.length && /[a-z]/.test(s[i])) sym += s[i++];
        if (!getElementBySymbol(sym)) throw new FormulaError(`Elemento desconocido "${sym}"`);
        comp[sym] = (comp[sym] ?? 0) + readNumber();
      } else {
        throw new FormulaError(`Carácter no válido "${c}"`);
      }
    }
    if (closer) throw new FormulaError('Falta cerrar un paréntesis');
    return comp;
  };

  const result = parseGroup(null);
  if (Object.keys(result).length === 0) throw new FormulaError('Fórmula vacía');
  return result;
}

export function parseFormula(input: string): Composition {
  const normalized = normalizeFormula(input);
  if (!normalized) throw new FormulaError('Fórmula vacía');
  const total: Composition = {};
  for (const part of normalized.split(/[·.*]/)) {
    const m = /^(\d+)(.*)$/.exec(part);
    const coef = m ? Number(m[1]) : 1;
    add(total, parseSegment(m ? m[2] : part), coef);
  }
  return total;
}

/** Masa molar en g/mol. */
export function molarMass(formula: string): number {
  const comp = parseFormula(formula);
  let sum = 0;
  for (const [sym, n] of Object.entries(comp)) {
    sum += getElementBySymbol(sym)!.mass * n;
  }
  return sum;
}

/** Composición porcentual en masa por elemento. */
export function massPercent(formula: string): Record<string, number> {
  const comp = parseFormula(formula);
  const total = molarMass(formula);
  const out: Record<string, number> = {};
  for (const [sym, n] of Object.entries(comp)) {
    out[sym] = ((getElementBySymbol(sym)!.mass * n) / total) * 100;
  }
  return out;
}
