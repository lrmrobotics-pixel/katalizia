/** Estilo 1 — Pixel art: el sprite original con animación retro por cuadros. */
import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import type { KataPose, KataTrick } from '@/core/pet/animation';
import type { CatMood } from '@/core/pet/wellbeing';

import { ACCESSORIES, composeCat, EFFECT_FRAMES, effectForMood, SPRITE_H, SPRITE_W, toRuns, WALK_LEGS } from './catSprite';

export function KataPixel({
  mood,
  pose,
  t,
  trick,
  width,
  accessoryIds,
}: {
  mood: CatMood;
  pose: KataPose;
  t: number;
  trick: KataTrick | null;
  width: number;
  accessoryIds: string[];
}) {
  // Cuadros a 6 fps: estética retro (los saltos van "a golpes", no interpolados).
  const frame = Math.floor(t * 6);
  const blink = pose.eyeL < 0.1 && mood !== 'durmiendo';
  const effectName = trick === 'bailar' ? 'chispas' : effectForMood(mood);
  const effectFrames = effectName ? EFFECT_FRAMES[effectName] : null;
  const effect = effectFrames ? effectFrames[frame % effectFrames.length] : undefined;
  const walking = trick === 'bailar' || trick === 'girar';
  const legs = walking ? WALK_LEGS[frame % 2] : undefined;
  const wave = trick === 'saludar' && frame % 2 === 0;

  const runs = useMemo(() => {
    const accessories = ACCESSORIES.filter((a) => accessoryIds.includes(a.id));
    const { grid, colors } = composeCat(mood, { blink, accessories, effect, legs, wave });
    return toRuns(grid, colors);
  }, [mood, blink, accessoryIds, effect, legs, wave]);

  const px = width / SPRITE_W;
  // Movimiento cuantizado a píxeles enteros del sprite.
  // Respiración retro: sube medio píxel a 1,6 Hz (excepto dormido).
  const breathe = mood === 'durmiendo' ? 0 : (Math.floor(t * 1.6) % 2) * px * 0.5;
  const lift = Math.round(pose.jump * 6) * px + breathe;
  // Girar en pixel art = voltear el sprite por cuadros; bailar = paso lateral.
  const flip = trick === 'girar' ? frame % 4 >= 2 : trick === 'bailar' ? frame % 4 >= 2 : false;
  const step = trick === 'bailar' ? (frame % 4 < 2 ? -1 : 1) * px : 0;

  return (
    <View style={{ transform: [{ translateY: -lift }, { translateX: step }, { scaleX: flip ? -1 : 1 }] }}>
      <Svg width={width} height={(width * SPRITE_H) / SPRITE_W} viewBox={`0 0 ${SPRITE_W} ${SPRITE_H}`}>
        {runs.map((r) => (
          <Rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w + 0.03} height={1.03} fill={r.color} />
        ))}
      </Svg>
    </View>
  );
}
