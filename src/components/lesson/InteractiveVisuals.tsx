/**
 * Visuales interactivos de lección: se tocan y manipulan, con explicación corta.
 * Electronegatividades de Pauling: OpenStax Chemistry 2e, fig. 7.6.
 */
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, Line, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';

import { AtomView } from '@/components/lab/AtomBuilder';
import { kataNow, useKataClock } from '@/components/pet/useKataClock';
import { Button, KText } from '@/components/ui';
import { alpha } from '@/components/ui/scene';
import { Stepper } from '@/components/ui/Stepper';
import { shorthandConfiguration } from '@/core/chemistry/electronConfig';
import { atomInfo, shellsFor } from '@/core/lab';
import { getElementByZ } from '@/data/elements';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function Chips<T extends string>({ items, value, onChange }: { items: [T, string][]; value: T | null; onChange: (v: T) => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
      {items.map(([id, label]) => (
        <Pressable
          key={id}
          onPress={() => onChange(id)}
          accessibilityRole="button"
          accessibilityState={{ selected: value === id }}
          style={{ minHeight: MIN_TOUCH - 8, justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: 999, backgroundColor: value === id ? colors.primary : alpha(colors.text, 0.08) }}>
          <KText variant="caption" color={value === id ? colors.onPrimary : colors.text} style={{ fontWeight: '700' }}>
            {label}
          </KText>
        </Pressable>
      ))}
    </View>
  );
}

const PARTS = {
  nucleo: 'El núcleo concentra casi toda la masa en un espacio diminuto (unas 100 000 veces menor que el átomo).',
  protones: 'Protones (+): su número, Z, define el elemento. 6 protones = carbono, siempre.',
  neutrones: 'Neutrones (sin carga): cambian el isótopo, no el elemento. Cambia su número abajo.',
  electrones: 'Electrones (−): en un átomo neutro hay tantos como protones. Su reparto en capas explica cómo reacciona.',
} as const;

/** Mundo 2 · Unidad 1: átomo de carbono explorable con isótopos. */
export function AtomExplorer() {
  const [part, setPart] = useState<keyof typeof PARTS | null>(null);
  const [n, setN] = useState(6);
  const info = atomInfo(6, n, 6);
  return (
    <View style={{ gap: spacing.sm, alignItems: 'stretch' }}>
      <View style={{ alignItems: 'center' }}>
        <AtomView protons={6} neutrons={n} shells={info.shells} size={220} />
      </View>
      <Chips
        items={[
          ['nucleo', 'Núcleo'],
          ['protones', 'Protones'],
          ['neutrones', 'Neutrones'],
          ['electrones', 'Electrones'],
        ]}
        value={part}
        onChange={setPart}
      />
      <KText>{part ? PARTS[part] : 'Toca una parte del átomo para descubrir qué hace.'}</KText>
      {part === 'neutrones' && (
        <>
          <Stepper label="Neutrones" value={n} min={6} max={8} onChange={setN} />
          <KText style={{ fontWeight: '700', textAlign: 'center' }}>
            {info.notation} · carbono-{info.massNumber}
            {n === 8 ? ' (radiactivo, usado en datación)' : n === 6 ? ' (el más abundante)' : ' (estable, ~1 %)'}
          </KText>
        </>
      )}
    </View>
  );
}

/** Mundo 2 · Unidad 2: capas y configuración para Z = 1–20. */
export function ShellsExplorer() {
  const [z, setZ] = useState(11);
  const el = getElementByZ(z)!;
  const shells = shellsFor(z);
  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ alignItems: 'center' }}>
        <AtomView protons={z} neutrons={Math.max(0, Math.round(el.mass) - z)} shells={shells} size={220} />
      </View>
      <Stepper label={`${el.name} (Z = ${z})`} value={z} min={1} max={20} onChange={setZ} />
      <KText style={{ textAlign: 'center', fontWeight: '700' }}>
        Capas {shells.join(' · ')} · {shorthandConfiguration(z)}
      </KText>
      <KText variant="caption">
        Fíjate en la última capa: los elementos con el mismo número de electrones externos (Li, Na, K) se comportan parecido.
      </KText>
    </View>
  );
}

const PAIRS = {
  HH: { a: 'H', b: 'H', ea: 2.2, eb: 2.2 },
  HCl: { a: 'H', b: 'Cl', ea: 2.2, eb: 3.16 },
  OH: { a: 'O', b: 'H', ea: 3.44, eb: 2.2 },
  NaCl: { a: 'Na', b: 'Cl', ea: 0.93, eb: 3.16 },
} as const;

/** Mundo 4 · Unidad 1: hacia dónde se desplazan los electrones del enlace según ΔEN. */
export function BondPolarity() {
  const { colors } = useTheme();
  const [k, setK] = useState<keyof typeof PAIRS>('HCl');
  const p = PAIRS[k];
  const d = p.eb - p.ea;
  const ad = Math.abs(d);
  // Centro de la nube electrónica: se desplaza hacia el más electronegativo.
  const shift = Math.max(-1, Math.min(1, d / 2.3));
  const ionic = ad > 1.8;
  const cx = 160 + shift * (ionic ? 70 : 45);
  const type = ad < 0.4 ? 'covalente apolar' : ionic ? 'mayormente iónico' : 'covalente polar';
  return (
    <View style={{ gap: spacing.sm }}>
      <Chips items={[['HH', 'H–H'], ['HCl', 'H–Cl'], ['OH', 'O–H'], ['NaCl', 'Na–Cl']]} value={k} onChange={setK} />
      <Svg width="100%" height={150} viewBox="0 0 320 150" accessibilityLabel={`Enlace ${p.a}–${p.b}, ${type}`}>
        <Defs>
          <RadialGradient id="cloud" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={colors.accent} stopOpacity={0.75} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={cx} cy={70} rx={ionic ? 55 : 95 - ad * 15} ry={46} fill="url(#cloud)" />
        <Circle cx={100} cy={70} r={26} fill="#3A4256" stroke={colors.text} strokeWidth={2} />
        <Circle cx={220} cy={70} r={26} fill="#3A4256" stroke={colors.text} strokeWidth={2} />
        <SvgText x={100} y={76} fill="#FFFFFF" fontSize={18} fontWeight="bold" textAnchor="middle">
          {p.a}
        </SvgText>
        <SvgText x={220} y={76} fill="#FFFFFF" fontSize={18} fontWeight="bold" textAnchor="middle">
          {p.b}
        </SvgText>
        {ad >= 0.4 && (
          <>
            <SvgText x={100} y={30} fill={colors.text} fontSize={16} textAnchor="middle">
              {d > 0 ? (ionic ? '+' : 'δ+') : ionic ? '−' : 'δ−'}
            </SvgText>
            <SvgText x={220} y={30} fill={colors.text} fontSize={16} textAnchor="middle">
              {d > 0 ? (ionic ? '−' : 'δ−') : ionic ? '+' : 'δ+'}
            </SvgText>
          </>
        )}
        <SvgText x={100} y={124} fill={colors.textMuted} fontSize={12} textAnchor="middle">
          EN {p.ea.toFixed(2).replace('.', ',')}
        </SvgText>
        <SvgText x={220} y={124} fill={colors.textMuted} fontSize={12} textAnchor="middle">
          EN {p.eb.toFixed(2).replace('.', ',')}
        </SvgText>
      </Svg>
      <KText style={{ textAlign: 'center', fontWeight: '700' }}>
        ΔEN = {ad.toFixed(2).replace('.', ',')} → {type}
      </KText>
      <KText variant="caption">La nube azul representa dónde pasan más tiempo los electrones del enlace.</KText>
    </View>
  );
}

/** Posiciones (x, y) de reactivos y productos para 2 H₂ + O₂ → 2 H₂O. */
const ATOMS = [
  { el: 'H', from: [40, 50], to: [190, 52] },
  { el: 'H', from: [64, 50], to: [230, 52] },
  { el: 'H', from: [40, 110], to: [190, 112] },
  { el: 'H', from: [64, 110], to: [230, 112] },
  { el: 'O', from: [120, 70], to: [210, 32] },
  { el: 'O', from: [120, 98], to: [210, 92] },
] as const;
const BONDS_FROM = [[0, 1], [2, 3], [4, 5]];
const BONDS_TO = [[4, 0], [4, 1], [5, 2], [5, 3]];

/** Mundo 5 · Unidad 1: reacción animada que muestra que los átomos se reorganizan, no se crean. */
export function ReactionAnimation() {
  const { colors, reduceMotion } = useTheme();
  const [start, setStart] = useState<number | null>(null);
  const t = useKataClock(start !== null && !reduceMotion, 30);
  const p = start === null ? 0 : reduceMotion ? 1 : Math.min(1, Math.max(0, (t - start) / 2.2));
  const ease = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
  const pos = ATOMS.map((a) => [a.from[0] + (a.to[0] - a.from[0]) * ease, a.from[1] + (a.to[1] - a.from[1]) * ease]);
  const bonds = p < 0.5 ? BONDS_FROM : BONDS_TO;
  return (
    <View style={{ gap: spacing.sm }}>
      <Svg width="100%" height={150} viewBox="0 0 270 150" accessibilityLabel={p < 1 ? 'Reactivos: dos moléculas de H₂ y una de O₂' : 'Productos: dos moléculas de H₂O'}>
        {bonds.map(([a, b]) => (
          <Line key={`${a}${b}`} x1={pos[a][0]} y1={pos[a][1]} x2={pos[b][0]} y2={pos[b][1]} stroke={colors.text} strokeWidth={4} opacity={Math.abs(p - 0.5) * 2} />
        ))}
        {ATOMS.map((a, i) => (
          <Circle key={i} cx={pos[i][0]} cy={pos[i][1]} r={a.el === 'O' ? 15 : 10} fill={a.el === 'O' ? '#E64B4B' : '#F5F8FF'} stroke="#0B1230" strokeWidth={2} />
        ))}
        <SvgText x={135} y={145} fill={colors.textMuted} fontSize={12} textAnchor="middle">
          {p < 1 ? '2 H₂ + O₂' : '2 H₂O'}
        </SvgText>
      </Svg>
      <KText style={{ textAlign: 'center', fontWeight: '700' }}>4 H y 2 O antes · 4 H y 2 O después</KText>
      <Button label={p >= 1 ? 'Repetir reacción' : 'Hacer reaccionar'} variant="secondary" onPress={() => setStart(kataNow())} />
      <KText variant="caption">Se rompen enlaces y se forman otros: los átomos se reorganizan, por eso la masa se conserva.</KText>
    </View>
  );
}
