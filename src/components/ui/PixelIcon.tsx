/** Iconos pixel art originales de 9×9 para la navegación. '#' = píxel relleno. */
import Svg, { Rect } from 'react-native-svg';

const ICONS = {
  home: [
    '....#....',
    '...###...',
    '..#####..',
    '.#######.',
    '#########',
    '.##...##.',
    '.##.#.##.',
    '.##.#.##.',
    '.#######.',
  ],
  book: [
    '.........',
    '###...###',
    '#..#.#..#',
    '#..#.#..#',
    '#..#.#..#',
    '#..#.#..#',
    '#..#.#..#',
    '####.####',
    '....#....',
  ],
  chat: [
    '.#######.',
    '#.......#',
    '#.#.#.#.#',
    '#.......#',
    '.######.#',
    '......#.#',
    '.......##',
    '........#',
    '.........',
  ],
  flask: [
    '..#####..',
    '...#.#...',
    '...#.#...',
    '...#.#...',
    '..#...#..',
    '.#.....#.',
    '#.#.#.#.#',
    '#########',
    '.........',
  ],
  cat: [
    '#.......#',
    '##.....##',
    '#.#####.#',
    '#.......#',
    '#.#...#.#',
    '#.......#',
    '#...#...#',
    '.#.....#.',
    '..#####..',
  ],
} as const;

export type IconName = keyof typeof ICONS;

export function PixelIcon({ name, color, size = 24 }: { name: IconName; color: string; size?: number }) {
  const rows = ICONS[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 9 9">
      {rows.flatMap((row, y) =>
        row.split('').map((c, x) => (c === '#' ? <Rect key={`${x}-${y}`} x={x} y={y} width={1.03} height={1.03} fill={color} /> : null)),
      )}
    </Svg>
  );
}
