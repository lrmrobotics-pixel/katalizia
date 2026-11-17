/**
 * Representaciones visuales de los pasos `visual`. Son modelos simplificados:
 * cada una muestra su leyenda de limitaciones.
 */
import { Fragment, type ReactElement } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Rect, Text as SvgText } from 'react-native-svg';

import { KText } from '@/components/ui';

import { AtomExplorer, BondPolarity, ReactionAnimation, ShellsExplorer } from './InteractiveVisuals';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Generador pseudoaleatorio determinista para posiciones estables entre renders. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function StatesOfMatter() {
  const { colors } = useTheme();
  const box = (x: number, label: string, pts: [number, number][]) => (
    <>
      <Rect x={x} y={10} width={90} height={90} fill="none" stroke={colors.border} strokeWidth={2} />
      {pts.map(([px, py], i) => (
        <Circle key={i} cx={x + px} cy={10 + py} r={5} fill={colors.accent} />
      ))}
      <SvgText x={x + 45} y={118} fill={colors.text} fontSize={12} textAnchor="middle">
        {label}
      </SvgText>
    </>
  );
  const solid: [number, number][] = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) solid.push([15 + c * 12, 15 + r * 12]);
  const r1 = rng(7);
  const liquid: [number, number][] = Array.from({ length: 24 }, (_, i) => [10 + (i % 6) * 13 + r1() * 6, 40 + Math.floor(i / 6) * 12 + r1() * 4]);
  const r2 = rng(42);
  const gas: [number, number][] = Array.from({ length: 8 }, () => [10 + r2() * 70, 10 + r2() * 70]);
  return (
    <Svg width="100%" height={130} viewBox="0 0 320 130" accessibilityLabel="Partículas en sólido, líquido y gas">
      {box(5, 'Sólido', solid)}
      {box(115, 'Líquido', liquid)}
      {box(225, 'Gas', gas)}
    </Svg>
  );
}

function MatterTree() {
  const { colors } = useTheme();
  const node = (x: number, y: number, w: number, t: string) => (
    <>
      <Rect x={x - w / 2} y={y - 14} width={w} height={28} rx={4} fill={colors.surfaceAlt} stroke={colors.accent} strokeWidth={2} />
      <SvgText x={x} y={y + 4} fill={colors.text} fontSize={11} textAnchor="middle">
        {t}
      </SvgText>
    </>
  );
  const link = (x1: number, y1: number, x2: number, y2: number) => <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.border} strokeWidth={2} />;
  return (
    <Svg width="100%" height={170} viewBox="0 0 320 170" accessibilityLabel="Clasificación de la materia">
      {link(160, 30, 80, 80)}
      {link(160, 30, 240, 80)}
      {link(80, 80, 40, 140)}
      {link(80, 80, 120, 140)}
      {link(240, 80, 200, 140)}
      {link(240, 80, 280, 140)}
      {node(160, 24, 90, 'Materia')}
      {node(80, 80, 110, 'Sustancia pura')}
      {node(240, 80, 80, 'Mezcla')}
      {node(40, 140, 72, 'Elemento')}
      {node(120, 140, 76, 'Compuesto')}
      {node(200, 140, 76, 'Homogénea')}
      {node(280, 140, 76, 'Heterogénea')}
    </Svg>
  );
}

function SiPrefixes() {
  const { colors } = useTheme();
  const rows = [
    ['k', 'kilo', '10³'],
    ['—', 'unidad', '1'],
    ['c', 'centi', '10⁻²'],
    ['m', 'mili', '10⁻³'],
    ['µ', 'micro', '10⁻⁶'],
    ['n', 'nano', '10⁻⁹'],
  ];
  return (
    <Svg width="100%" height={rows.length * 26 + 8} viewBox={`0 0 320 ${rows.length * 26 + 8}`} accessibilityLabel="Escalera de prefijos del SI">
      {rows.map(([sym, name, f], i) => (
        <Fragment key={sym}>
          <Rect x={20 + i * 12} y={4 + i * 26} width={280 - i * 24} height={22} fill={colors.surfaceAlt} stroke={colors.border} />
          <SvgText x={160} y={20 + i * 26} fill={colors.text} fontSize={12} textAnchor="middle">
            {`${sym}  ${name}  ×${f}`}
          </SvgText>
        </Fragment>
      ))}
    </Svg>
  );
}

/** Colores aproximados del indicador universal (pH 0–14). Son datos del indicador, no del tema. */
const PH_COLORS = ['#D7263D', '#E4572E', '#F17C2B', '#F5A623', '#F8C630', '#F2E94E', '#C5E063', '#7BC950', '#3FA34D', '#2E86AB', '#2364AA', '#3D348B', '#5B2A86', '#7A1F7A', '#4B1248'];

const PH_EXAMPLES: [number, string][] = [
  [2, 'Jugo gástrico'],
  [5, 'Café'],
  [7.4, 'Sangre'],
  [10, 'Jabón'],
];

/** Escala de pH con ejemplos y, opcionalmente, un marcador en `value`. */
export function PhScale({ value }: { value?: number }) {
  const { colors } = useTheme();
  const w = 300 / 15;
  const x = (ph: number) => 10 + (ph + 0.5) * w;
  return (
    <Svg width="100%" height={96} viewBox="0 0 320 96" accessibilityLabel={value === undefined ? 'Escala de pH de 0 a 14' : `Escala de pH, marcador en ${value.toFixed(2)}`}>
      {PH_COLORS.map((c, i) => (
        <Fragment key={i}>
          <Rect x={10 + i * w} y={30} width={w} height={22} fill={c} />
          <SvgText x={10 + i * w + w / 2} y={66} fill={colors.text} fontSize={10} textAnchor="middle">
            {String(i)}
          </SvgText>
        </Fragment>
      ))}
      {PH_EXAMPLES.map(([ph, label], i) => (
        <Fragment key={label}>
          <Line x1={x(ph)} y1={i % 2 ? 22 : 12} x2={x(ph)} y2={30} stroke={colors.textMuted} strokeWidth={1} />
          <SvgText x={x(ph)} y={i % 2 ? 20 : 10} fill={colors.textMuted} fontSize={9} textAnchor="middle">
            {label}
          </SvgText>
        </Fragment>
      ))}
      <SvgText x={10} y={86} fill={colors.text} fontSize={10}>
        ← Ácido
      </SvgText>
      <SvgText x={160} y={86} fill={colors.text} fontSize={10} textAnchor="middle">
        Neutro (7)
      </SvgText>
      <SvgText x={310} y={86} fill={colors.text} fontSize={10} textAnchor="end">
        Básico →
      </SvgText>
      {value !== undefined && (
        <Rect x={x(Math.min(14, Math.max(0, value))) - 2} y={26} width={4} height={30} fill={colors.text} />
      )}
    </Svg>
  );
}

const VISUALS: Record<string, { render: () => ReactElement; limits: string }> = {
  'states-of-matter': {
    render: () => <StatesOfMatter />,
    limits: 'Modelo de partículas: las esferas no son átomos reales a escala y en realidad todas se mueven sin parar.',
  },
  'matter-classification': {
    render: () => <MatterTree />,
    limits: 'Clasificación escolar: algunas mezclas (coloides) están entre homogénea y heterogénea.',
  },
  'si-prefixes': {
    render: () => <SiPrefixes />,
    limits: 'Solo se muestran los prefijos más usados en química y medicina.',
  },
  'atom-explorer': {
    render: () => <AtomExplorer />,
    limits: 'Modelo de capas con el núcleo muy agrandado; los electrones reales ocupan orbitales, no órbitas.',
  },
  'shells-explorer': {
    render: () => <ShellsExplorer />,
    limits: 'Capas de Bohr como resumen del orden de llenado; no muestra la forma de los orbitales.',
  },
  'bond-polarity': {
    render: () => <BondPolarity />,
    limits: 'La nube es un esquema cualitativo; el límite de 1,8 entre polar e iónico es una regla práctica.',
  },
  'reaction-anim': {
    render: () => <ReactionAnimation />,
    limits: 'Animación del balance de átomos; la reacción real ocurre en varios pasos y libera mucha energía.',
  },
  'ph-scale': {
    render: () => <PhScale />,
    limits: 'Valores típicos a 25 °C; en disoluciones muy concentradas el pH puede salir de 0–14 y los colores del indicador son aproximados.',
  },
};

export function LessonVisual({ id }: { id: string }) {
  const v = VISUALS[id];
  if (!v) return null;
  return (
    <View style={{ gap: spacing.xs }}>
      {v.render()}
      <KText muted variant="caption">
        Límites del modelo: {v.limits}
      </KText>
    </View>
  );
}
