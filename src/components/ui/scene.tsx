/**
 * Primitivos visuales de KATALIZIA 2.0: escenarios con degradado e iluminación suave,
 * anillo y barra de progreso animados, accesos rápidos con icono y encabezados de sección.
 */
import { useEffect, useId, useMemo, type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { KText } from './index';
import { SciIcon, type SciIconName } from './SciIcon';

export const STAGE_RADIUS = 20;

/** Mezcla un color hex con transparencia (00–ff). */
export const alpha = (hex: string, a: number) =>
  `${hex}${Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0')}`;

/** Generador determinista para decoraciones estables entre renders. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/**
 * Escenario: panel con degradado vertical, halo de luz y, opcionalmente, partículas.
 * Sustituye a la tarjeta con borde duro cuando el contenido es protagonista.
 */
export function Stage({
  children,
  tint,
  style,
  particles = 0,
  glow = 'top-right',
  padded = true,
}: {
  children: ReactNode;
  /** Color de acento del escenario (por defecto el primario del tema). */
  tint?: string;
  style?: StyleProp<ViewStyle>;
  particles?: number;
  glow?: 'top-right' | 'top-left' | 'center' | 'none';
  padded?: boolean;
}) {
  const { colors, mode } = useTheme();
  const id = useId().replace(/[:]/g, '');
  const c = tint ?? colors.primary;
  const dots = useMemo(() => {
    const r = seeded(particles * 97 + 13);
    return Array.from({ length: particles }, () => ({ x: r() * 100, y: r() * 100, s: 0.4 + r() * 1.2, o: 0.25 + r() * 0.5 }));
  }, [particles]);
  const gx = glow === 'top-left' ? '12%' : glow === 'center' ? '50%' : '88%';
  const gy = glow === 'center' ? '45%' : '8%';
  return (
    <View style={[{ borderRadius: STAGE_RADIUS, overflow: 'hidden', backgroundColor: colors.surface }, style]}>
      <Svg style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={mode === 'dark' ? alpha(c, 0.32) : alpha(c, 0.18)} />
            <Stop offset="1" stopColor={colors.surface} stopOpacity={mode === 'dark' ? 0.6 : 1} />
          </LinearGradient>
          <RadialGradient id={`r${id}`} cx={gx} cy={gy} r="70%">
            <Stop offset="0" stopColor={c} stopOpacity={mode === 'dark' ? 0.35 : 0.18} />
            <Stop offset="1" stopColor={c} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#g${id})`} />
        {glow !== 'none' && <Rect x="0" y="0" width="100%" height="100%" fill={`url(#r${id})`} />}
        {dots.map((d, i) => (
          <Circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={d.s} fill={colors.text} opacity={d.o * (mode === 'dark' ? 0.6 : 0.25)} />
        ))}
      </Svg>
      <View style={padded ? { padding: spacing.lg, gap: spacing.md } : undefined}>{children}</View>
    </View>
  );
}

/** Anillo de progreso (0–1) con contenido centrado. */
export function ProgressRing({
  value,
  size = 64,
  stroke = 7,
  color,
  label,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label: string;
  children?: ReactNode;
}) {
  const { colors } = useTheme();
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(v * 100) }}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.surfaceAlt} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color ?? colors.accent}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ * v} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

/** Barra de progreso que se llena con una animación corta (respeta movimiento reducido). */
export function GlowBar({ value, color, label, height = 10 }: { value: number; color?: string; label: string; height?: number }) {
  const { colors, reduceMotion } = useTheme();
  const v = Math.max(0, Math.min(1, value));
  const w = useSharedValue(reduceMotion ? v : 0);
  useEffect(() => {
    w.value = reduceMotion ? v : withTiming(v, { duration: 900 });
  }, [v, reduceMotion, w]);
  const style = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  const c = color ?? colors.accent;
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(v * 100) }}
      style={{ height, borderRadius: height, backgroundColor: alpha(colors.text, 0.08), overflow: 'hidden' }}>
      <Animated.View style={[{ height: '100%', borderRadius: height, backgroundColor: c, boxShadow: `0 0 8px ${alpha(c, 0.7)}` }, style]} />
    </View>
  );
}

/** Acceso rápido: icono en un círculo luminoso y etiqueta corta. */
export function ActionTile({
  icon,
  label,
  color,
  onPress,
  caption,
}: {
  icon: SciIconName;
  label: string;
  color: string;
  onPress: () => void;
  caption?: string;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={caption ? `${label}. ${caption}` : label}
      style={({ pressed }) => ({
        flex: 1,
        minWidth: 72,
        minHeight: MIN_TOUCH + 40,
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        transform: [{ scale: pressed ? 0.94 : 1 }],
      })}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha(color, 0.16),
          borderWidth: 1.5,
          borderColor: alpha(color, 0.5),
        }}>
        <SciIcon name={icon} color={color} size={28} />
      </View>
      <KText variant="caption" style={{ fontWeight: '700', textAlign: 'center', color: colors.text }} numberOfLines={1}>
        {label}
      </KText>
    </Pressable>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm }}>
      <KText variant="bodyLg" accessibilityRole="header" style={{ fontWeight: '800' }}>
        {title}
      </KText>
      {action && onAction && (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={12} style={{ minHeight: MIN_TOUCH, justifyContent: 'center' }}>
          <KText variant="caption" color={colors.accent} style={{ fontWeight: '700' }}>
            {action}
          </KText>
        </Pressable>
      )}
    </View>
  );
}

/** Pastilla con icono (XP, monedas, racha…). */
export function StatPill({ icon, value, color, label }: { icon: SciIconName; value: string; color: string; label: string }) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: alpha(color, 0.14),
      }}>
      <SciIcon name={icon} color={color} size={16} />
      <KText variant="caption" style={{ fontWeight: '800', color: colors.text }}>
        {value}
      </KText>
    </View>
  );
}
