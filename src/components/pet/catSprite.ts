/**
 * Sprite pixel art original del gato científico de KATALIZIA (20 × 26 px).
 * Diseño propio: gato sentado, cabeza grande, gafas redondas cian.
 *
 * Leyenda: . transparente | K contorno | F pelaje | P rosa | G montura | L cristal
 *          E ojo | W brillo | B cuerpo (pelaje o bata) | A corbata (pelaje o acento)
 *          H sombrero | Y borla | M mochila
 */
import type { CatMood } from '@/core/pet/wellbeing';

export const SPRITE_W = 20;
export const SPRITE_H = 26;

const HEAD_TOP = 4;

const BASE: string[] = [
  '....................',
  '....................',
  '....................',
  '....................',
  '..KK............KK..',
  '..KPK..........KPK..',
  '..KPPK........KPPK..',
  '..KFPPKKKKKKKKPPFK..',
  '.KFFFFFFFFFFFFFFFFK.',
  '.KFFFFFFFFFFFFFFFFK.',
  'KFFGGGGGFFFFGGGGGFFK',
  'KFGLLLLLGGGGLLLLLGFK',
  'KFGLLLLLGFFGLLLLLGFK',
  'KFGLLLLLGFFGLLLLLGFK',
  'KFGGGGGGGFFGGGGGGGFK',
  'KFFFFFFFFPPFFFFFFFFK',
  'KFFFFFFFFFFFFFFFFFFK',
  '.KFFFFFFFFFFFFFFFFK.',
  '..KKFFFFFFFFFFFFKK..',
  '...KBBBBBAABBBBBK...',
  '..KBBBBBBAABBBBBBK..',
  '.KBBKBBBBAABBBBKBBK.',
  '.KBBKBBBBBBBBBBKBBK.',
  '.KFFKBBBBBBBBBBKFFK.',
  '..KKKFFKKKKKKFFKKK..',
  '....KKK......KKK....',
];

/** Ojos 4×2, se colocan en las columnas 4 y 12 de las filas de cristal. */
const EYES: Record<string, [string, string]> = {
  open: ['LWEL', 'LEEL'],
  happy: ['LEEL', 'ELLE'],
  closed: ['LLLL', 'LEEL'],
  wide: ['EWEE', 'EEEE'],
  up: ['LLWE', 'LLEE'],
};

/** Boca 4×2 en columnas 8–11. */
const MOUTHS: Record<string, [string, string]> = {
  smile: ['KFFK', 'FKKF'],
  open: ['KPPK', 'FKKF'],
  o: ['FKKF', 'FKKF'],
  flat: ['FKKF', 'FFFF'],
  wavy: ['FFKK', 'KKFF'],
};

const MOOD_PARTS: Record<CatMood, { left: string; right: string; mouth: string }> = {
  feliz: { left: 'happy', right: 'happy', mouth: 'smile' },
  pensativo: { left: 'up', right: 'up', mouth: 'flat' },
  sorprendido: { left: 'wide', right: 'wide', mouth: 'o' },
  confundido: { left: 'open', right: 'closed', mouth: 'wavy' },
  celebrando: { left: 'happy', right: 'happy', mouth: 'open' },
  explicando: { left: 'open', right: 'open', mouth: 'open' },
  durmiendo: { left: 'closed', right: 'closed', mouth: 'flat' },
  experimentando: { left: 'wide', right: 'open', mouth: 'smile' },
};

export interface Accessory {
  id: string;
  name: string;
  slot: 'head' | 'body' | 'back';
  price: number;
  /** Capa dibujada encima (mismo tamaño que el sprite, '.' = sin cambio). */
  overlay?: string[];
  /** Colores que sustituye en la paleta. */
  recolor?: Partial<Record<string, string>>;
}

const pad = (rows: string[]) => [...rows, ...Array(SPRITE_H - rows.length).fill('.'.repeat(SPRITE_W))];

export const ACCESSORIES: Accessory[] = [
  {
    id: 'bata-clasica',
    name: 'Bata de laboratorio',
    slot: 'body',
    price: 0,
    recolor: { B: '#F5F8FF', A: '#22D3EE' },
  },
  {
    id: 'bata-quirurgica',
    name: 'Uniforme quirúrgico',
    slot: 'body',
    price: 120,
    recolor: { B: '#5EEAD4', A: '#0F766E' },
  },
  {
    id: 'birrete',
    name: 'Birrete universitario',
    slot: 'head',
    price: 200,
    overlay: pad([
      '....................',
      '......KKKKKKKK......',
      '...KKKHHHHHHHHKKK...',
      '.....KHHHHHHHHKY....',
      '...............Y....',
    ]),
  },
  {
    id: 'gorro-lana',
    name: 'Gorro de invierno',
    slot: 'head',
    price: 80,
    overlay: pad([
      '.........YY.........',
      '.......KKKKKK.......',
      '.....KKHHHHHHKK.....',
      '....KHHHHHHHHHHK....',
      '...KYYYYYYYYYYYYK...',
    ]),
  },
  {
    id: 'mochila',
    name: 'Mochila de muestras',
    slot: 'back',
    price: 150,
    overlay: pad([
      ...Array(19).fill('....................'),
      'MM................MM',
      'MM................MM',
      'MM................MM',
      'MM................MM',
    ]),
  },
];

export const BASE_COLORS: Record<string, string> = {
  K: '#0B1230',
  F: '#D7DEEC',
  P: '#F4A7B9',
  G: '#22D3EE',
  L: '#CFF4FF',
  E: '#0B1230',
  W: '#FFFFFF',
  B: '#D7DEEC',
  A: '#D7DEEC',
  H: '#1D2A5C',
  Y: '#FACC15',
  M: '#F97316',
};

function stamp(grid: string[][], row: number, col: number, pattern: string) {
  for (let i = 0; i < pattern.length; i++) grid[row][col + i] = pattern[i];
}

/** Compone la cuadrícula final según ánimo, parpadeo y accesorios. */
export function composeCat(mood: CatMood, opts: { blink?: boolean; accessories?: Accessory[] } = {}) {
  const grid = BASE.map((r) => r.split(''));
  const parts = MOOD_PARTS[mood];
  const eyeRow = HEAD_TOP + 8;
  const left = EYES[opts.blink ? 'closed' : parts.left];
  const right = EYES[opts.blink ? 'closed' : parts.right];
  stamp(grid, eyeRow, 4, left[0]);
  stamp(grid, eyeRow + 1, 4, left[1]);
  stamp(grid, eyeRow, 12, right[0]);
  stamp(grid, eyeRow + 1, 12, right[1]);
  const mouth = MOUTHS[parts.mouth];
  stamp(grid, HEAD_TOP + 12, 8, mouth[0]);
  stamp(grid, HEAD_TOP + 13, 8, mouth[1]);

  const colors = { ...BASE_COLORS };
  for (const acc of opts.accessories ?? []) {
    if (acc.recolor) Object.assign(colors, acc.recolor);
    if (acc.overlay) {
      acc.overlay.forEach((row, r) =>
        row.split('').forEach((ch, c) => {
          // La mochila va detrás: solo pinta donde el sprite es transparente.
          if (ch === '.') return;
          if (acc.slot === 'back' && grid[r][c] !== '.') return;
          grid[r][c] = ch;
        }),
      );
    }
  }
  return { grid, colors };
}

export interface PixelRun {
  x: number;
  y: number;
  w: number;
  color: string;
}

/** Agrupa píxeles contiguos del mismo color por fila para reducir nodos SVG. */
export function toRuns(grid: string[][], colors: Record<string, string>): PixelRun[] {
  const runs: PixelRun[] = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === '.') {
        x++;
        continue;
      }
      let w = 1;
      while (x + w < row.length && colors[row[x + w]] === colors[ch]) w++;
      runs.push({ x, y, w, color: colors[ch] });
      x += w;
    }
  });
  return runs;
}
