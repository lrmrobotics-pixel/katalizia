import type { CatMood } from '@/core/pet/wellbeing';

import { ACCESSORIES, BASE_COLORS, composeCat, SPRITE_H, SPRITE_W, toRuns } from '../catSprite';

const MOODS: CatMood[] = [
  'feliz', 'pensativo', 'sorprendido', 'confundido', 'celebrando', 'explicando', 'durmiendo', 'experimentando',
];

describe('sprite del gato', () => {
  it.each(MOODS)('ánimo %s produce una cuadrícula 20×26 con colores definidos', (mood) => {
    const { grid, colors } = composeCat(mood);
    expect(grid).toHaveLength(SPRITE_H);
    grid.forEach((row) => expect(row).toHaveLength(SPRITE_W));
    grid.flat().forEach((ch) => expect(ch === '.' || colors[ch] !== undefined).toBe(true));
  });

  it('cada ánimo es visualmente distinto', () => {
    const shapes = new Set(MOODS.map((m) => composeCat(m).grid.map((r) => r.join('')).join('\n')));
    expect(shapes.size).toBe(MOODS.length);
  });

  it('el sprite es simétrico salvo ojos y boca', () => {
    const { grid } = composeCat('feliz');
    [4, 8, 10, 14, 18, 24].forEach((r) => {
      expect(grid[r].join('')).toBe([...grid[r]].reverse().join(''));
    });
  });

  it('los accesorios tienen capas del tamaño correcto y cambian el sprite', () => {
    for (const acc of ACCESSORIES) {
      if (acc.overlay) {
        expect(acc.overlay).toHaveLength(SPRITE_H);
        acc.overlay.forEach((r) => expect(r).toHaveLength(SPRITE_W));
      }
      const base = toRuns(...Object.values(composeCat('feliz')) as [string[][], Record<string, string>]);
      const dressed = (() => {
        const { grid, colors } = composeCat('feliz', { accessories: [acc] });
        return toRuns(grid, colors);
      })();
      expect(JSON.stringify(dressed)).not.toBe(JSON.stringify(base));
    }
  });

  it('toRuns agrupa píxeles contiguos sin perder ninguno', () => {
    const { grid, colors } = composeCat('feliz');
    const painted = grid.flat().filter((c) => c !== '.').length;
    const runs = toRuns(grid, colors);
    expect(runs.reduce((s, r) => s + r.w, 0)).toBe(painted);
    expect(runs.length).toBeLessThan(painted);
    expect(colors.K).toBe(BASE_COLORS.K);
  });
});
