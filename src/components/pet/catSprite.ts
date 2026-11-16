/**
 * Sprite pixel art original del gato científico de KATALIZIA (20 × 26 px).
 * Diseño propio: gato sentado, cabeza grande, gafas redondas cian.
 *
 * Leyenda: . transparente | K contorno | F pelaje | P rosa | G montura | L cristal
 *          E ojo | W brillo | B cuerpo (pelaje o bata) | A corbata (pelaje o acento)
 *          H sombrero | Y borla | M mochila | Q líquido del matraz | S chispa/efecto
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
  narrow: ['LLLL', 'EEEE'],
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
  curioso: { left: 'open', right: 'wide', mouth: 'smile' },
  pensativo: { left: 'up', right: 'up', mouth: 'flat' },
  sorprendido: { left: 'wide', right: 'wide', mouth: 'o' },
  confundido: { left: 'open', right: 'closed', mouth: 'wavy' },
  celebrando: { left: 'happy', right: 'happy', mouth: 'open' },
  explicando: { left: 'open', right: 'open', mouth: 'open' },
  concentrado: { left: 'narrow', right: 'narrow', mouth: 'flat' },
  durmiendo: { left: 'closed', right: 'closed', mouth: 'flat' },
  experimentando: { left: 'wide', right: 'open', mouth: 'smile' },
};

/**
 * Descripción del accesorio independiente del estilo: los estilos 2D y 3D la usan
 * para dibujar su propia versión (no es un simple cambio de color del sprite).
 */
export interface AccessoryLook {
  coat?: string;
  coatAccent?: string;
  glasses?: string;
  hat?: 'birrete' | 'gorro';
  back?: 'mochila';
  hand?: 'matraz';
}

export type AccessorySlot = 'head' | 'body' | 'back' | 'eyes' | 'hand';

export interface Accessory {
  id: string;
  name: string;
  slot: AccessorySlot;
  price: number;
  look: AccessoryLook;
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
    look: { coat: '#F5F8FF', coatAccent: '#22D3EE' },
    recolor: { B: '#F5F8FF', A: '#22D3EE' },
  },
  {
    id: 'bata-quirurgica',
    name: 'Uniforme quirúrgico',
    slot: 'body',
    price: 120,
    look: { coat: '#5EEAD4', coatAccent: '#0F766E' },
    recolor: { B: '#5EEAD4', A: '#0F766E' },
  },
  {
    id: 'birrete',
    name: 'Birrete universitario',
    slot: 'head',
    price: 200,
    look: { hat: 'birrete' },
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
    look: { hat: 'gorro' },
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
    look: { back: 'mochila' },
    overlay: pad([
      ...Array(19).fill('....................'),
      'MM................MM',
      'MM................MM',
      'MM................MM',
      'MM................MM',
    ]),
  },
  {
    id: 'gafas-doradas',
    name: 'Gafas doradas',
    slot: 'eyes',
    price: 100,
    look: { glasses: '#FACC15' },
    recolor: { G: '#FACC15' },
  },
  {
    id: 'gafas-violeta',
    name: 'Gafas violeta',
    slot: 'eyes',
    price: 100,
    look: { glasses: '#A78BFA' },
    recolor: { G: '#A78BFA' },
  },
  {
    id: 'matraz',
    name: 'Matraz de Erlenmeyer',
    slot: 'hand',
    price: 180,
    look: { hand: 'matraz' },
    overlay: pad([
      ...Array(19).fill('....................'),
      '..............KK....',
      '..............KK....',
      '.............KQQK...',
      '............KQQQQK..',
      '............KKKKKK..',
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
  Q: '#F472B6',
  S: '#FACC15',
};

/** Apariencia combinada de los accesorios equipados (la usan los estilos 2D y 3D). */
export interface KataLook {
  coat: string;
  coatAccent: string;
  glasses: string;
  hat: AccessoryLook['hat'] | null;
  back: AccessoryLook['back'] | null;
  hand: AccessoryLook['hand'] | null;
}

export function kataLook(accessoryIds: string[]): KataLook {
  const look: KataLook = {
    coat: BASE_COLORS.B,
    coatAccent: BASE_COLORS.A,
    glasses: BASE_COLORS.G,
    hat: null,
    back: null,
    hand: null,
  };
  for (const acc of ACCESSORIES) {
    if (!accessoryIds.includes(acc.id)) continue;
    const l = acc.look;
    if (l.coat) look.coat = l.coat;
    if (l.coatAccent) look.coatAccent = l.coatAccent;
    if (l.glasses) look.glasses = l.glasses;
    if (l.hat) look.hat = l.hat;
    if (l.back) look.back = l.back;
    if (l.hand) look.hand = l.hand;
  }
  return look;
}

// ── Animación retro por cuadros ─────────────────────────────────────────

/** Efectos que solo pintan en celdas transparentes (las filas 0–3 están libres sobre la cabeza). */
export type PixelEffect = 'chispas' | 'idea' | 'zzz' | 'burbujas' | 'pregunta';

function layer(cells: [number, number][]): string[] {
  const rows = Array.from({ length: SPRITE_H }, () => Array<string>(SPRITE_W).fill('.'));
  cells.forEach(([r, c]) => (rows[r][c] = 'S'));
  return rows.map((r) => r.join(''));
}

export const EFFECT_FRAMES: Record<PixelEffect, string[][]> = {
  chispas: [
    layer([[1, 1], [0, 2], [1, 3], [2, 2], [3, 17], [1, 19]]),
    layer([[0, 17], [1, 16], [1, 18], [2, 17], [3, 0], [2, 1]]),
  ],
  idea: [layer([[3, 15]]), layer([[3, 15], [2, 16]]), layer([[3, 15], [2, 16], [0, 17], [0, 18], [1, 17], [1, 18]])],
  zzz: [
    layer([[3, 14], [3, 15], [2, 15], [1, 14], [1, 15]]),
    layer([[2, 16], [2, 17], [1, 17], [0, 16], [0, 17]]),
  ],
  burbujas: [layer([[3, 3], [1, 2]]), layer([[2, 2], [0, 3], [3, 16]]), layer([[1, 3], [2, 17], [0, 16]])],
  pregunta: [
    layer([[0, 15], [0, 16], [0, 17], [1, 17], [2, 16], [3, 16]]),
    layer([[0, 15], [0, 16], [0, 17], [1, 17], [2, 16]]),
  ],
};

export function effectForMood(mood: CatMood): PixelEffect | null {
  switch (mood) {
    case 'celebrando':
      return 'chispas';
    case 'pensativo':
    case 'concentrado':
      return 'idea';
    case 'durmiendo':
      return 'zzz';
    case 'experimentando':
      return 'burbujas';
    case 'confundido':
    case 'curioso':
      return 'pregunta';
    default:
      return null;
  }
}

/** Patas alternas para caminar (filas 24–25); el cuadro 0 es la postura de reposo. */
export const WALK_LEGS: [string, string][] = [
  [BASE[24], BASE[25]],
  ['..KKKKFFKKKKFFKKKK..', '.....KKK....KKK.....'],
];

/** Pata levantada para saludar (encima del hombro izquierdo, donde el sprite es transparente). */
export const WAVE_PAW: string[] = pad([
  ...Array(4).fill('....................'),
  'KK..................',
  'FK..................',
  'FK..................',
  'FK..................',
]);

function stamp(grid: string[][], row: number, col: number, pattern: string) {
  for (let i = 0; i < pattern.length; i++) grid[row][col + i] = pattern[i];
}

/** Compone la cuadrícula final según ánimo, parpadeo, accesorios y cuadro de animación. */
export function composeCat(
  mood: CatMood,
  opts: { blink?: boolean; accessories?: Accessory[]; effect?: string[]; legs?: [string, string]; wave?: boolean } = {},
) {
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
  if (opts.legs) {
    grid[24] = opts.legs[0].split('');
    grid[25] = opts.legs[1].split('');
  }

  const colors = { ...BASE_COLORS };
  const paintOnEmpty = (rows: string[]) =>
    rows.forEach((row, r) =>
      row.split('').forEach((ch, c) => {
        if (ch !== '.' && grid[r][c] === '.') grid[r][c] = ch;
      }),
    );
  for (const acc of opts.accessories ?? []) {
    if (acc.recolor) Object.assign(colors, acc.recolor);
    if (acc.overlay) {
      // La mochila va detrás: solo pinta donde el sprite es transparente.
      if (acc.slot === 'back') paintOnEmpty(acc.overlay);
      else
        acc.overlay.forEach((row, r) =>
          row.split('').forEach((ch, c) => {
            if (ch !== '.') grid[r][c] = ch;
          }),
        );
    }
  }
  if (opts.wave) paintOnEmpty(WAVE_PAW);
  if (opts.effect) paintOnEmpty(opts.effect);
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
