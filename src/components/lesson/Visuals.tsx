/**
 * Representaciones visuales de los pasos `visual`. Son modelos simplificados:
 * cada una muestra su leyenda de limitaciones.
 */
import { Fragment, type ReactElement } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Rect, Text as SvgText } from 'react-native-svg';

import { KText } from '@/components/ui';
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
