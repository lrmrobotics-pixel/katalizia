import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, useColorScheme } from 'react-native';

import { useSettings } from '@/state/settings';

import { buildColors, fontSize, type ThemeMode } from './tokens';

export function useSystemReduceMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => sub.remove();
  }, []);
  return reduced;
}

export function useTheme() {
  const system = useColorScheme();
  const { theme, palette, highContrast, textScale, reduceMotion } = useSettings();
  const systemReduce = useSystemReduceMotion();
  const mode: ThemeMode = theme === 'system' ? (system === 'light' ? 'light' : 'dark') : theme;
  return useMemo(() => {
    const colors = buildColors(mode, palette, highContrast);
    const fs = Object.fromEntries(
      Object.entries(fontSize).map(([k, v]) => [k, Math.round(v * textScale)]),
    ) as typeof fontSize;
    return { mode, colors, fontSize: fs, reduceMotion: reduceMotion || systemReduce };
  }, [mode, palette, highContrast, textScale, reduceMotion, systemReduce]);
}

export type Theme = ReturnType<typeof useTheme>;
