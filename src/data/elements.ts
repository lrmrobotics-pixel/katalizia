/**
 * Tabla de los 118 elementos.
 *
 * Fuentes:
 * - Masas atómicas: IUPAC, Standard Atomic Weights (valores abreviados/convencionales,
 *   CIAAW https://www.ciaaw.org/atomic-weights.htm). Para elementos sin isótopos estables
 *   se da el número másico del isótopo más estable conocido (`massIsMassNumber: true`).
 * - Grupos, períodos y estado a 25 °C / 1 atm: OpenStax Chemistry 2e, cap. 2.5
 *   (https://openstax.org/details/books/chemistry-2e).
 * - Nombres en español: Real Academia Española / IUPAC (nomenclatura en español).
 *
 * Elementos con Z >= 100: estado físico desconocido (se producen en cantidades de átomos).
 * Elementos con Z >= 104: categoría y propiedades son predicciones (`predicted: true`).
 *
 * No añadir propiedades sin fuente verificable.
 */

export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export type Phase = 'solid' | 'liquid' | 'gas' | 'unknown';

export interface ChemicalElement {
  z: number;
  symbol: string;
  name: string;
  /** Masa atómica estándar (u) o número másico del isótopo más estable. */
  mass: number;
  massIsMassNumber: boolean;
  /** Grupo 1–18. `null` para lantánidos y actínidos (bloque f). */
  group: number | null;
  period: number;
  category: ElementCategory;
  phase: Phase;
  predicted: boolean;
}

type Row = [number, string, string, number, number | null, number, ElementCategory, Phase?, boolean?];

const AM: ElementCategory = 'alkali-metal';
const AE: ElementCategory = 'alkaline-earth-metal';
const TM: ElementCategory = 'transition-metal';
const PT: ElementCategory = 'post-transition-metal';
const MD: ElementCategory = 'metalloid';
const NM: ElementCategory = 'nonmetal';
const HA: ElementCategory = 'halogen';
const NG: ElementCategory = 'noble-gas';
const LA: ElementCategory = 'lanthanide';
const AC: ElementCategory = 'actinide';

// [Z, símbolo, nombre, masa, grupo, período, categoría, estado (por defecto sólido), másico]
const ROWS: Row[] = [
  [1, 'H', 'Hidrógeno', 1.008, 1, 1, NM, 'gas'],
  [2, 'He', 'Helio', 4.0026, 18, 1, NG, 'gas'],
  [3, 'Li', 'Litio', 6.94, 1, 2, AM],
  [4, 'Be', 'Berilio', 9.0122, 2, 2, AE],
  [5, 'B', 'Boro', 10.81, 13, 2, MD],
  [6, 'C', 'Carbono', 12.011, 14, 2, NM],
  [7, 'N', 'Nitrógeno', 14.007, 15, 2, NM, 'gas'],
  [8, 'O', 'Oxígeno', 15.999, 16, 2, NM, 'gas'],
  [9, 'F', 'Flúor', 18.998, 17, 2, HA, 'gas'],
  [10, 'Ne', 'Neón', 20.18, 18, 2, NG, 'gas'],
  [11, 'Na', 'Sodio', 22.99, 1, 3, AM],
  [12, 'Mg', 'Magnesio', 24.305, 2, 3, AE],
  [13, 'Al', 'Aluminio', 26.982, 13, 3, PT],
  [14, 'Si', 'Silicio', 28.085, 14, 3, MD],
  [15, 'P', 'Fósforo', 30.974, 15, 3, NM],
  [16, 'S', 'Azufre', 32.06, 16, 3, NM],
  [17, 'Cl', 'Cloro', 35.45, 17, 3, HA, 'gas'],
  [18, 'Ar', 'Argón', 39.95, 18, 3, NG, 'gas'],
  [19, 'K', 'Potasio', 39.098, 1, 4, AM],
  [20, 'Ca', 'Calcio', 40.078, 2, 4, AE],
  [21, 'Sc', 'Escandio', 44.956, 3, 4, TM],
  [22, 'Ti', 'Titanio', 47.867, 4, 4, TM],
  [23, 'V', 'Vanadio', 50.942, 5, 4, TM],
  [24, 'Cr', 'Cromo', 51.996, 6, 4, TM],
  [25, 'Mn', 'Manganeso', 54.938, 7, 4, TM],
  [26, 'Fe', 'Hierro', 55.845, 8, 4, TM],
  [27, 'Co', 'Cobalto', 58.933, 9, 4, TM],
  [28, 'Ni', 'Níquel', 58.693, 10, 4, TM],
  [29, 'Cu', 'Cobre', 63.546, 11, 4, TM],
  [30, 'Zn', 'Zinc', 65.38, 12, 4, TM],
  [31, 'Ga', 'Galio', 69.723, 13, 4, PT],
  [32, 'Ge', 'Germanio', 72.63, 14, 4, MD],
  [33, 'As', 'Arsénico', 74.922, 15, 4, MD],
  [34, 'Se', 'Selenio', 78.971, 16, 4, NM],
  [35, 'Br', 'Bromo', 79.904, 17, 4, HA, 'liquid'],
  [36, 'Kr', 'Kriptón', 83.798, 18, 4, NG, 'gas'],
  [37, 'Rb', 'Rubidio', 85.468, 1, 5, AM],
  [38, 'Sr', 'Estroncio', 87.62, 2, 5, AE],
  [39, 'Y', 'Itrio', 88.906, 3, 5, TM],
  [40, 'Zr', 'Circonio', 91.224, 4, 5, TM],
  [41, 'Nb', 'Niobio', 92.906, 5, 5, TM],
  [42, 'Mo', 'Molibdeno', 95.95, 6, 5, TM],
  [43, 'Tc', 'Tecnecio', 98, 7, 5, TM, 'solid', true],
  [44, 'Ru', 'Rutenio', 101.07, 8, 5, TM],
  [45, 'Rh', 'Rodio', 102.91, 9, 5, TM],
  [46, 'Pd', 'Paladio', 106.42, 10, 5, TM],
  [47, 'Ag', 'Plata', 107.87, 11, 5, TM],
  [48, 'Cd', 'Cadmio', 112.41, 12, 5, TM],
  [49, 'In', 'Indio', 114.82, 13, 5, PT],
  [50, 'Sn', 'Estaño', 118.71, 14, 5, PT],
  [51, 'Sb', 'Antimonio', 121.76, 15, 5, MD],
  [52, 'Te', 'Telurio', 127.6, 16, 5, MD],
  [53, 'I', 'Yodo', 126.9, 17, 5, HA],
  [54, 'Xe', 'Xenón', 131.29, 18, 5, NG, 'gas'],
  [55, 'Cs', 'Cesio', 132.91, 1, 6, AM],
  [56, 'Ba', 'Bario', 137.33, 2, 6, AE],
  [57, 'La', 'Lantano', 138.91, null, 6, LA],
  [58, 'Ce', 'Cerio', 140.12, null, 6, LA],
  [59, 'Pr', 'Praseodimio', 140.91, null, 6, LA],
  [60, 'Nd', 'Neodimio', 144.24, null, 6, LA],
  [61, 'Pm', 'Prometio', 145, null, 6, LA, 'solid', true],
  [62, 'Sm', 'Samario', 150.36, null, 6, LA],
  [63, 'Eu', 'Europio', 151.96, null, 6, LA],
  [64, 'Gd', 'Gadolinio', 157.25, null, 6, LA],
  [65, 'Tb', 'Terbio', 158.93, null, 6, LA],
  [66, 'Dy', 'Disprosio', 162.5, null, 6, LA],
  [67, 'Ho', 'Holmio', 164.93, null, 6, LA],
  [68, 'Er', 'Erbio', 167.26, null, 6, LA],
  [69, 'Tm', 'Tulio', 168.93, null, 6, LA],
  [70, 'Yb', 'Iterbio', 173.05, null, 6, LA],
  [71, 'Lu', 'Lutecio', 174.97, null, 6, LA],
  [72, 'Hf', 'Hafnio', 178.49, 4, 6, TM],
  [73, 'Ta', 'Tántalo', 180.95, 5, 6, TM],
  [74, 'W', 'Wolframio', 183.84, 6, 6, TM],
  [75, 'Re', 'Renio', 186.21, 7, 6, TM],
  [76, 'Os', 'Osmio', 190.23, 8, 6, TM],
  [77, 'Ir', 'Iridio', 192.22, 9, 6, TM],
  [78, 'Pt', 'Platino', 195.08, 10, 6, TM],
  [79, 'Au', 'Oro', 196.97, 11, 6, TM],
  [80, 'Hg', 'Mercurio', 200.59, 12, 6, TM, 'liquid'],
  [81, 'Tl', 'Talio', 204.38, 13, 6, PT],
  [82, 'Pb', 'Plomo', 207.2, 14, 6, PT],
  [83, 'Bi', 'Bismuto', 208.98, 15, 6, PT],
  [84, 'Po', 'Polonio', 209, 16, 6, PT, 'solid', true],
  [85, 'At', 'Astato', 210, 17, 6, HA, 'solid', true],
  [86, 'Rn', 'Radón', 222, 18, 6, NG, 'gas', true],
  [87, 'Fr', 'Francio', 223, 1, 7, AM, 'solid', true],
  [88, 'Ra', 'Radio', 226, 2, 7, AE, 'solid', true],
  [89, 'Ac', 'Actinio', 227, null, 7, AC, 'solid', true],
  [90, 'Th', 'Torio', 232.04, null, 7, AC],
  [91, 'Pa', 'Protactinio', 231.04, null, 7, AC],
  [92, 'U', 'Uranio', 238.03, null, 7, AC],
  [93, 'Np', 'Neptunio', 237, null, 7, AC, 'solid', true],
  [94, 'Pu', 'Plutonio', 244, null, 7, AC, 'solid', true],
  [95, 'Am', 'Americio', 243, null, 7, AC, 'solid', true],
  [96, 'Cm', 'Curio', 247, null, 7, AC, 'solid', true],
  [97, 'Bk', 'Berkelio', 247, null, 7, AC, 'solid', true],
  [98, 'Cf', 'Californio', 251, null, 7, AC, 'solid', true],
  [99, 'Es', 'Einstenio', 252, null, 7, AC, 'solid', true],
  [100, 'Fm', 'Fermio', 257, null, 7, AC, 'unknown', true],
  [101, 'Md', 'Mendelevio', 258, null, 7, AC, 'unknown', true],
  [102, 'No', 'Nobelio', 259, null, 7, AC, 'unknown', true],
  [103, 'Lr', 'Lawrencio', 262, null, 7, AC, 'unknown', true],
  [104, 'Rf', 'Rutherfordio', 267, 4, 7, TM, 'unknown', true],
  [105, 'Db', 'Dubnio', 268, 5, 7, TM, 'unknown', true],
  [106, 'Sg', 'Seaborgio', 269, 6, 7, TM, 'unknown', true],
  [107, 'Bh', 'Bohrio', 270, 7, 7, TM, 'unknown', true],
  [108, 'Hs', 'Hasio', 269, 8, 7, TM, 'unknown', true],
  [109, 'Mt', 'Meitnerio', 278, 9, 7, TM, 'unknown', true],
  [110, 'Ds', 'Darmstatio', 281, 10, 7, TM, 'unknown', true],
  [111, 'Rg', 'Roentgenio', 282, 11, 7, TM, 'unknown', true],
  [112, 'Cn', 'Copernicio', 285, 12, 7, TM, 'unknown', true],
  [113, 'Nh', 'Nihonio', 286, 13, 7, PT, 'unknown', true],
  [114, 'Fl', 'Flerovio', 289, 14, 7, PT, 'unknown', true],
  [115, 'Mc', 'Moscovio', 290, 15, 7, PT, 'unknown', true],
  [116, 'Lv', 'Livermorio', 293, 16, 7, PT, 'unknown', true],
  [117, 'Ts', 'Teneso', 294, 17, 7, HA, 'unknown', true],
  [118, 'Og', 'Oganesón', 294, 18, 7, NG, 'unknown', true],
];

export const ELEMENTS: readonly ChemicalElement[] = ROWS.map(
  ([z, symbol, name, mass, group, period, category, phase = 'solid', massIsMassNumber = false]) => ({
    z,
    symbol,
    name,
    mass,
    massIsMassNumber,
    group,
    period,
    category,
    phase,
    predicted: z >= 104,
  }),
);

const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol, e]));

export function getElementBySymbol(symbol: string): ChemicalElement | undefined {
  return BY_SYMBOL.get(symbol);
}

export function getElementByZ(z: number): ChemicalElement | undefined {
  return ELEMENTS[z - 1];
}

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'alkali-metal': 'Metal alcalino',
  'alkaline-earth-metal': 'Metal alcalinotérreo',
  'transition-metal': 'Metal de transición',
  'post-transition-metal': 'Metal del bloque p',
  metalloid: 'Metaloide',
  nonmetal: 'No metal',
  halogen: 'Halógeno',
  'noble-gas': 'Gas noble',
  lanthanide: 'Lantánido',
  actinide: 'Actínido',
};

export const PHASE_LABELS: Record<Phase, string> = {
  solid: 'Sólido',
  liquid: 'Líquido',
  gas: 'Gas',
  unknown: 'Desconocido',
};
