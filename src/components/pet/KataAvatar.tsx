/**
 * Kata con el estilo elegido por la estudiante (pixel, 2D o 3D). Los tres estilos
 * comparten la misma "actuación" (`core/pet/animation`), ánimo, trucos y accesorios.
 */
import { useMemo } from 'react';
import { View } from 'react-native';

import { kataPose, TRICK_SECONDS, type KataStyle, type KataTrick } from '@/core/pet/animation';
import type { CatMood } from '@/core/pet/wellbeing';
import { usePet } from '@/state/pet';
import { useRewards } from '@/state/rewards';
import { useTheme } from '@/theme/useTheme';

import { kataLook } from './catSprite';
import { Kata3D } from './Kata3D';
import { KataCartoon } from './KataCartoon';
import { KataPixel } from './KataPixel';
import { useKataClock } from './useKataClock';

export { kataNow } from './useKataClock';

const MOOD_LABEL: Record<CatMood, string> = {
  feliz: 'feliz',
  curioso: 'curioso',
  pensativo: 'pensando',
  sorprendido: 'sorprendido',
  confundido: 'confundido',
  celebrando: 'celebrando',
  explicando: 'explicando',
  concentrado: 'concentrado',
  durmiendo: 'durmiendo',
  experimentando: 'experimentando',
};

const STYLE_LABEL: Record<KataStyle, string> = { pixel: 'pixel art', cartoon: 'animación 2D', 'tres-d': '3D' };

export interface KataAvatarProps {
  mood?: CatMood;
  /** Ancho en dp; el alto es 1,3 × ancho en los tres estilos. */
  size?: number;
  /** Por defecto, los accesorios equipados. */
  accessoryIds?: string[];
  /** Fuerza un estilo (vista previa del selector). */
  styleOverride?: KataStyle;
  /** Truco a reproducir; `startedAt` se obtiene con `kataNow()` al pulsar. */
  trick?: { id: KataTrick; startedAt: number } | null;
  /** Permite girar el modelo 3D arrastrando. */
  interactive?: boolean;
  animated?: boolean;
}

export function KataAvatar({
  mood = 'feliz',
  size = 120,
  accessoryIds,
  styleOverride,
  trick = null,
  interactive = false,
  animated = true,
}: KataAvatarProps) {
  const { reduceMotion } = useTheme();
  const chosen = usePet((s) => s.style);
  const equipped = useRewards((s) => s.equipped);
  const style = styleOverride ?? chosen ?? 'pixel';
  const ids = useMemo(() => accessoryIds ?? Object.values(equipped), [accessoryIds, equipped]);
  const look = useMemo(() => kataLook(ids), [ids]);
  const motion = animated && !reduceMotion;
  // 3D y 2D se interpolan; el pixel art va a cuadros pero necesita el reloj igual.
  const t = useKataClock(motion, style === 'tres-d' ? 20 : style === 'cartoon' ? 30 : 12);

  const pose = kataPose(mood, t, trick);
  const running = trick && t >= trick.startedAt && t - trick.startedAt < TRICK_SECONDS ? trick.id : null;

  return (
    <View
      style={{ width: size, height: size * 1.3, alignItems: 'center', justifyContent: 'flex-end' }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Kata, el gato científico (${STYLE_LABEL[style]}), ${MOOD_LABEL[mood]}`}>
      {style === 'pixel' && <KataPixel mood={mood} pose={pose} t={t} trick={running} width={size} accessoryIds={ids} />}
      {style === 'cartoon' && <KataCartoon mood={mood} pose={pose} width={size} look={look} />}
      {style === 'tres-d' && <Kata3D pose={pose} width={size} look={look} interactive={interactive} />}
    </View>
  );
}
