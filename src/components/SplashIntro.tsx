import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { KataAvatarStandalone as KataAvatar } from '@/components/pet/KataAvatar';
import { KText } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const FADE_MS = 300;

/**
 * Pantalla de entrada animada (logotipo + mascota). Dura ~1.6 s, o 0.4 s con movimiento reducido.
 * El fundido de salida se anima aquí (no con `exiting`, que en web puede dejar la capa visible).
 */
export function SplashIntro({ onDone }: { onDone: () => void }) {
  const { colors, reduceMotion } = useTheme();
  const scale = useSharedValue(reduceMotion ? 1 : 0.6);
  const contentOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const rootOpacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 600 });
    contentOpacity.value = withTiming(1, { duration: 600 });
    const hold = reduceMotion ? 400 : 1300;
    const fade = setTimeout(() => {
      rootOpacity.value = withTiming(0, { duration: reduceMotion ? 0 : FADE_MS });
    }, hold);
    const done = setTimeout(onDone, hold + (reduceMotion ? 0 : FADE_MS) + 20);
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, [onDone, contentOpacity, reduceMotion, rootOpacity, scale]);

  const rootStyle = useAnimatedStyle(() => ({ opacity: rootOpacity.value }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value, transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.root, { backgroundColor: colors.bg }, rootStyle]}
      accessibilityLabel="KATALIZIA, química que te transforma">
      <Animated.View style={[styles.center, contentStyle]}>
        <KataAvatar mood="experimentando" size={140} />
        <View style={{ height: spacing.lg }} />
        <KText variant="pixel" color={colors.accent} style={{ fontSize: 22, lineHeight: 34 }}>
          KATALIZIA
        </KText>
        <KText muted>Química que te transforma</KText>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  center: { alignItems: 'center', gap: spacing.sm },
});
