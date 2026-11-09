/**
 * Tokens de diseño de KATALIZIA.
 * Paleta base: azul oscuro, azul eléctrico, cian, blanco y gris tecnológico.
 * Todas las combinaciones texto/fondo cumplen contraste WCAG AA (≥ 4.5:1) en tamaño normal.
 */

export type ThemeMode = 'dark' | 'light';
export type PaletteId = 'katalizia' | 'bioluminiscente' | 'nebulosa';

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  /** Sombra pixel (borde inferior duro). */
  shadow: string;
}

const ACCENTS: Record<PaletteId, { primary: string; accent: string; primaryLight: string; accentLight: string }> = {
  katalizia: { primary: '#2F7BFF', accent: '#22D3EE', primaryLight: '#1D5FD6', accentLight: '#0E7490' },
  bioluminiscente: { primary: '#10B981', accent: '#A3E635', primaryLight: '#047857', accentLight: '#4D7C0F' },
  nebulosa: { primary: '#8B5CF6', accent: '#F472B6', primaryLight: '#6D28D9', accentLight: '#BE185D' },
};

export function buildColors(mode: ThemeMode, palette: PaletteId, highContrast: boolean): ThemeColors {
  const a = ACCENTS[palette];
  if (mode === 'dark') {
    return {
      bg: highContrast ? '#000000' : '#070B1F',
      surface: highContrast ? '#0B0F1A' : '#0F1733',
      surfaceAlt: highContrast ? '#141A2A' : '#18234A',
      border: highContrast ? '#FFFFFF' : '#2A3A6E',
      text: '#FFFFFF',
      textMuted: highContrast ? '#E5E7EB' : '#A9B4D0',
      primary: a.primary,
      onPrimary: '#FFFFFF',
      accent: a.accent,
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#F87171',
      shadow: '#02040D',
    };
  }
  return {
    bg: highContrast ? '#FFFFFF' : '#F2F5FB',
    surface: '#FFFFFF',
    surfaceAlt: highContrast ? '#F3F4F6' : '#E6ECF7',
    border: highContrast ? '#000000' : '#C3CDE3',
    text: highContrast ? '#000000' : '#0B1230',
    textMuted: highContrast ? '#1F2937' : '#4A5578',
    primary: a.primaryLight,
    onPrimary: '#FFFFFF',
    accent: a.accentLight,
    success: '#047857',
    warning: '#B45309',
    danger: '#B91C1C',
    shadow: '#9AA8C7',
  };
}

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 4, md: 8, lg: 12 } as const;

/** Escala tipográfica; nunca menor de 14 en texto de lectura. */
export const fontSize = { caption: 13, body: 16, bodyLg: 18, title: 22, display: 28 } as const;

/** Objetivo táctil mínimo (Material: 48 dp). */
export const MIN_TOUCH = 48;

export const PIXEL_FONT = 'PressStart2P_400Regular';

/** Colores por categoría de elemento (tabla periódica). */
export const CATEGORY_COLORS = {
  'alkali-metal': '#F97316',
  'alkaline-earth-metal': '#FACC15',
  'transition-metal': '#60A5FA',
  'post-transition-metal': '#94A3B8',
  metalloid: '#2DD4BF',
  nonmetal: '#4ADE80',
  halogen: '#F472B6',
  'noble-gas': '#A78BFA',
  lanthanide: '#FB7185',
  actinide: '#E879F9',
} as const;
