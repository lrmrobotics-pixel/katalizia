import { ELEMENTS, type ChemicalElement } from '@/data/elements';

/**
 * Posición en la cuadrícula de 18 columnas. Lantánidos y actínidos se muestran en
 * filas separadas (8 y 9, base 0) empezando en la columna 3, formato habitual de la IUPAC.
 */
export function gridPosition(e: ChemicalElement): { row: number; col: number } {
  if (e.category === 'lanthanide') return { row: 8, col: 2 + (e.z - 57) };
  if (e.category === 'actinide') return { row: 9, col: 2 + (e.z - 89) };
  return { row: e.period - 1, col: (e.group ?? 3) - 1 };
}

const strip = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Búsqueda por nombre (sin tildes), símbolo exacto o número atómico. */
export function searchElements(query: string): ChemicalElement[] {
  const q = query.trim();
  if (!q) return [...ELEMENTS];
  if (/^\d+$/.test(q)) return ELEMENTS.filter((e) => e.z === Number(q));
  const nq = strip(q);
  const exact = ELEMENTS.filter((e) => e.symbol.toLowerCase() === nq);
  const byName = ELEMENTS.filter((e) => strip(e.name).includes(nq) && !exact.includes(e));
  return [...exact, ...byName];
}
