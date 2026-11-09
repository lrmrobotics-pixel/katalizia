/**
 * Primitivos de interfaz de KATALIZIA: estética pixel (bordes duros, sombra inferior
 * sólida) con tipografía legible. Todos respetan el tema, el contraste y el tamaño de texto.
 */
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MIN_TOUCH, PIXEL_FONT, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type TextVariant = 'display' | 'title' | 'body' | 'bodyLg' | 'caption' | 'pixel';

export function KText({
  variant = 'body',
  muted,
  color,
  style,
  children,
  ...rest
}: {
  variant?: TextVariant;
  muted?: boolean;
  color?: string;
  style?: StyleProp<TextStyle>;
  children: ReactNode;
  accessibilityRole?: 'header' | 'text';
  numberOfLines?: number;
}) {
  const { colors, fontSize } = useTheme();
  const base: TextStyle =
    variant === 'pixel'
      ? { fontFamily: PIXEL_FONT, fontSize: fontSize.caption, lineHeight: fontSize.caption * 1.7 }
      : {
          fontSize: fontSize[variant],
          lineHeight: fontSize[variant] * 1.4,
          fontWeight: variant === 'display' || variant === 'title' ? '800' : '400',
        };
  return (
    <Text
      style={[base, { color: color ?? (muted ? colors.textMuted : colors.text) }, style]}
      maxFontSizeMultiplier={1.6}
      {...rest}>
      {children}
    </Text>
  );
}

export function Screen({
  children,
  scroll = true,
  padded = true,
}: {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
}) {
  const { colors } = useTheme();
  const inner = padded ? { padding: spacing.lg, gap: spacing.lg } : undefined;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView contentContainerStyle={[inner, { paddingBottom: spacing.xxl * 2 }]}>{children}</ScrollView>
      ) : (
        <View style={[{ flex: 1 }, inner]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Card({
  children,
  style,
  accent,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  accent?: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: accent ?? colors.border,
          borderBottomColor: colors.shadow,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  accessibilityHint,
  testID,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
  testID?: string;
}) {
  const { colors, fontSize } = useTheme();
  const bg = variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.surfaceAlt : 'transparent';
  const fg = variant === 'primary' ? colors.onPrimary : colors.text;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          borderColor: variant === 'ghost' ? colors.border : bg,
          borderBottomColor: variant === 'ghost' ? colors.border : colors.shadow,
          opacity: disabled ? 0.5 : 1,
          transform: [{ translateY: pressed ? 2 : 0 }],
          borderBottomWidth: pressed ? 2 : 4,
        },
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={{ color: fg, fontSize: fontSize.body, fontWeight: '700' }} maxFontSizeMultiplier={1.4}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function ProgressBar({ value, color, label }: { value: number; color?: string; label: string }) {
  const { colors } = useTheme();
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      style={[styles.bar, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: color ?? colors.accent }} />
    </View>
  );
}

export function Chip({ label, color }: { label: string; color?: string }) {
  const { colors, fontSize } = useTheme();
  return (
    <View style={[styles.chip, { borderColor: color ?? colors.border, backgroundColor: colors.surfaceAlt }]}>
      <Text style={{ color: colors.text, fontSize: fontSize.caption, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

/** Marca honesta para funciones que aún no existen. */
export function ComingSoon({ phase, what }: { phase: number; what: string }) {
  const { colors } = useTheme();
  return (
    <Card accent={colors.warning}>
      <KText variant="pixel" color={colors.warning}>
        EN CONSTRUCCIÓN · FASE {phase}
      </KText>
      <KText muted>{what}</KText>
    </Card>
  );
}

export function StateView({
  state,
  message,
  onRetry,
}: {
  state: 'loading' | 'error' | 'empty';
  message: string;
  onRetry?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: spacing.md, padding: spacing.xl }}>
      {state === 'loading' && <ActivityIndicator color={colors.accent} size="large" />}
      <KText muted={state !== 'error'} color={state === 'error' ? colors.danger : undefined}>
        {message}
      </KText>
      {onRetry && <Button label="Reintentar" variant="secondary" onPress={onRetry} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  button: {
    minHeight: MIN_TOUCH,
    paddingHorizontal: spacing.xl,
    borderWidth: 2,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: { height: 14, borderWidth: 2, borderRadius: radius.sm, overflow: 'hidden' },
  chip: { alignSelf: 'flex-start', borderWidth: 2, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
});
