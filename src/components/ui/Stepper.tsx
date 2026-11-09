import { Pressable, View } from 'react-native';

import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { KText } from './index';

/** Control − valor + accesible (alternativa táctil a un deslizador). */
export function Stepper({
  label,
  value,
  display,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  /** Texto a mostrar (por defecto, el número). */
  display?: string;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  const { colors } = useTheme();
  const round = (v: number) => Math.round(v * 1e6) / 1e6;
  const btn = (sign: -1 | 1) => {
    const next = round(value + sign * step);
    const disabled = next < min || next > max;
    return (
      <Pressable
        onPress={() => onChange(next)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${sign < 0 ? 'Disminuir' : 'Aumentar'} ${label}`}
        style={{
          width: MIN_TOUCH,
          height: MIN_TOUCH,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius.md,
          borderWidth: 2,
          borderColor: colors.border,
          backgroundColor: colors.surfaceAlt,
          opacity: disabled ? 0.4 : 1,
        }}>
        <KText variant="title">{sign < 0 ? '−' : '+'}</KText>
      </Pressable>
    );
  };
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
      accessible
      accessibilityLabel={`${label}: ${display ?? value}`}
      accessibilityRole="adjustable"
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        const next = round(value + (e.nativeEvent.actionName === 'increment' ? step : -step));
        if (next >= min && next <= max) onChange(next);
      }}>
      {btn(-1)}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <KText muted variant="caption">
          {label}
        </KText>
        <KText variant="bodyLg" style={{ fontWeight: '700' }}>
          {display ?? String(value)}
        </KText>
      </View>
      {btn(1)}
    </View>
  );
}
