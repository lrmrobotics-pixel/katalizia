import { useEffect, useMemo, useState } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';

import type { CatMood } from '@/core/pet/wellbeing';
import { useTheme } from '@/theme/useTheme';

import { ACCESSORIES, composeCat, SPRITE_H, SPRITE_W, toRuns } from './catSprite';

export interface PixelCatProps {
  mood?: CatMood;
  /** Ancho en dp; el alto mantiene la proporción del sprite. */
  size?: number;
  accessoryIds?: string[];
  animated?: boolean;
}

const MOOD_LABEL: Record<CatMood, string> = {
  feliz: 'feliz',
  pensativo: 'pensativo',
  sorprendido: 'sorprendido',
  confundido: 'confundido',
  celebrando: 'celebrando',
  explicando: 'explicando',
  durmiendo: 'durmiendo',
  experimentando: 'experimentando',
};

export function PixelCat({ mood = 'feliz', size = 120, accessoryIds = [], animated = true }: PixelCatProps) {
  const { reduceMotion } = useTheme();
  const motion = animated && !reduceMotion;
  const [blink, setBlink] = useState(false);
  const bob = useSharedValue(0);

  useEffect(() => {
    if (!motion || mood === 'durmiendo') return;
    let timeout: ReturnType<typeof setTimeout>;
    const loop = () => {
      timeout = setTimeout(() => {
        setBlink(true);
        timeout = setTimeout(() => {
          setBlink(false);
          loop();
        }, 140);
      }, 2500 + Math.random() * 2500);
    };
    loop();
    return () => clearTimeout(timeout);
  }, [motion, mood]);

  useEffect(() => {
    if (!motion) {
      bob.value = 0;
      return;
    }
    const amp = mood === 'celebrando' ? -6 : -2;
    const dur = mood === 'celebrando' ? 260 : mood === 'durmiendo' ? 1600 : 900;
    bob.value = withRepeat(withSequence(withTiming(amp, { duration: dur }), withTiming(0, { duration: dur })), -1);
    return () => cancelAnimation(bob);
  }, [motion, mood, bob]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: bob.value }] }));

  const runs = useMemo(() => {
    const accessories = ACCESSORIES.filter((a) => accessoryIds.includes(a.id));
    const { grid, colors } = composeCat(mood, { blink, accessories });
    return toRuns(grid, colors);
  }, [mood, blink, accessoryIds]);

  const height = (size * SPRITE_H) / SPRITE_W;

  return (
    <Animated.View
      style={[{ width: size, height }, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Kata, el gato científico, ${MOOD_LABEL[mood]}`}>
      <Svg width={size} height={height} viewBox={`0 0 ${SPRITE_W} ${SPRITE_H}`}>
        {runs.map((r) => (
          <Rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w + 0.03} height={1.03} fill={r.color} />
        ))}
      </Svg>
    </Animated.View>
  );
}
