/**
 * Constructor de átomos: arrastra protones, neutrones y electrones al átomo y observa
 * cómo cambian Z, A, la carga y el elemento. Modelo de capas simplificado (no es una órbita real).
 */
import { useRef, useState, type ComponentRef } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

import { KataAvatar } from '@/components/pet/KataAvatar';
import { useKataClock } from '@/components/pet/useKataClock';
import { Button, KText } from '@/components/ui';
import { alpha, Stage, StatPill } from '@/components/ui/scene';
import { ATOM_CHALLENGES, ATOM_LIMITS, atomInfo, checkAtom } from '@/core/lab';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { DragToken, type DropRect } from './DragToken';

const P_COLOR = '#F87171';
const N_COLOR = '#94A3B8';
const E_COLOR = '#22D3EE';

/** Posiciones del núcleo en espiral de girasol (empaquetado compacto y estable). */
function nucleusPoints(count: number, radius: number) {
  return Array.from({ length: count }, (_, i) => {
    const r = radius * Math.sqrt((i + 0.5) / Math.max(1, count));
    const a = i * 2.39996;
    return [r * Math.cos(a), r * Math.sin(a)] as const;
  });
}

export function AtomView({ protons, neutrons, shells, size = 260, animated = true }: { protons: number; neutrons: number; shells: number[]; size?: number; animated?: boolean }) {
  const { colors, reduceMotion } = useTheme();
  const t = useKataClock(animated && !reduceMotion && shells.length > 0, 20);
  const c = size / 2;
  const nucleons = protons + neutrons;
  const nr = Math.min(size * 0.16, 5 + Math.sqrt(nucleons) * 4.2);
  const pr = Math.max(3, Math.min(7, nr / Math.sqrt(Math.max(1, nucleons)) * 1.25));
  const pts = nucleusPoints(nucleons, nr);
  // Protones y neutrones intercalados de forma uniforme (cuenta exacta de cada uno).
  const kinds = Array.from({ length: nucleons }, (_, i) =>
    Math.floor(((i + 1) * protons) / nucleons) > Math.floor((i * protons) / nucleons) ? 'p' : 'n',
  );
  const ring = (i: number) => nr + 14 + (i + 1) * ((c - nr - 22) / Math.max(4, shells.length));
  return (
    <Svg width={size} height={size} accessibilityLabel={`Átomo con ${protons} protones, ${neutrons} neutrones y capas ${shells.join(', ')}`}>
      {shells.map((_, i) => (
        <Circle key={`r${i}`} cx={c} cy={c} r={ring(i)} stroke={alpha(colors.text, 0.18)} strokeWidth={1.5} fill="none" strokeDasharray="4 5" />
      ))}
      <Circle cx={c} cy={c} r={nr + 6} fill={alpha('#F87171', 0.12)} />
      {pts.map(([x, y], i) => (
        <Circle key={`n${i}`} cx={c + x} cy={c + y} r={pr} fill={kinds[i] === 'p' ? P_COLOR : N_COLOR} stroke="#0B1230" strokeWidth={0.8} />
      ))}
      {shells.map((count, i) =>
        Array.from({ length: count }, (_, j) => {
          const speed = 0.6 / (i + 1);
          const a = (j / count) * Math.PI * 2 + t * speed * (i % 2 ? -1 : 1);
          return <Circle key={`e${i}-${j}`} cx={c + ring(i) * Math.cos(a)} cy={c + ring(i) * Math.sin(a)} r={4} fill={E_COLOR} />;
        }),
      )}
      {nucleons === 0 && (
        <SvgText x={c} y={c + 4} fill={colors.textMuted} fontSize={13} textAnchor="middle">
          Arrastra partículas aquí
        </SvgText>
      )}
    </Svg>
  );
}

function Token({ color, label, sign }: { color: string; label: string; sign: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: 4, minWidth: 76 }}>
      <Svg width={44} height={44}>
        <Circle cx={22} cy={22} r={18} fill={color} stroke="#0B1230" strokeWidth={2} />
        <G>
          <SvgText x={22} y={28} fill="#0B1230" fontSize={18} fontWeight="bold" textAnchor="middle">
            {sign}
          </SvgText>
        </G>
      </Svg>
      <KText variant="caption" style={{ fontWeight: '700', color: colors.text }}>
        {label}
      </KText>
    </View>
  );
}

function MinusButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled: boolean }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ minHeight: MIN_TOUCH - 8, minWidth: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: alpha(colors.text, 0.08), opacity: disabled ? 0.4 : 1 }}>
      <KText style={{ fontWeight: '800' }}>−</KText>
    </Pressable>
  );
}

export function AtomBuilder({ onExperiment }: { onExperiment: () => void }) {
  const { colors } = useTheme();
  const [p, setP] = useState(0);
  const [n, setN] = useState(0);
  const [e, setE] = useState(0);
  const [mode, setMode] = useState<'libre' | 'reto'>('libre');
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [result, setResult] = useState<{ correct: boolean; hints: string[] } | null>(null);
  const zone = useRef<ComponentRef<typeof View>>(null);
  const rect = useRef<DropRect | null>(null);
  const info = atomInfo(p, n, e);
  const challenge = ATOM_CHALLENGES[challengeIdx % ATOM_CHALLENGES.length];

  const measure = () => zone.current?.measureInWindow((x, y, w, h) => (rect.current = { x, y, w, h }));
  const getTarget = () => rect.current;
  const changed = () => setResult(null);

  return (
    <View style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View style={{ flex: 1 }}>
          <Button label="Modo libre" variant={mode === 'libre' ? 'primary' : 'secondary'} onPress={() => setMode('libre')} />
        </View>
        <View style={{ flex: 1 }}>
          <Button label="Retos" variant={mode === 'reto' ? 'primary' : 'secondary'} onPress={() => { setMode('reto'); setResult(null); }} />
        </View>
      </View>

      {mode === 'reto' && (
        <Stage tint={colors.warning} glow="top-left">
          <KText variant="caption" color={colors.warning} style={{ fontWeight: '800' }}>
            RETO {(challengeIdx % ATOM_CHALLENGES.length) + 1} DE {ATOM_CHALLENGES.length}
          </KText>
          <KText variant="bodyLg" style={{ fontWeight: '700' }}>
            {challenge.prompt}
          </KText>
        </Stage>
      )}

      <Stage tint={colors.accent} glow="center" particles={14}>
        <View ref={zone} onLayout={measure} style={{ alignItems: 'center' }}>
          <AtomView protons={p} neutrons={n} shells={info.shells} />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' }}>
          <StatPill icon="atom" value={info.element ? `${info.element.name} (${info.notation})` : 'Sin elemento'} color={colors.accent} label={info.element ? `Elemento: ${info.element.name}` : 'Sin protones no hay elemento'} />
          <StatPill icon="target" value={`Z = ${info.z}`} color={P_COLOR} label={`Número atómico ${info.z}`} />
          <StatPill icon="chart" value={`A = ${info.massNumber}`} color={N_COLOR} label={`Número másico ${info.massNumber}`} />
          <StatPill icon="bolt" value={`Carga ${info.charge > 0 ? '+' : ''}${info.charge}`} color={E_COLOR} label={`Carga ${info.charge}`} />
        </View>
        <KText variant="caption" muted style={{ textAlign: 'center' }}>
          {info.kind === 'vacío'
            ? 'Sin protones no hay elemento: los protones definen qué átomo es.'
            : `${info.kind[0].toUpperCase()}${info.kind.slice(1)}. Capas: ${info.shells.join(' · ') || '—'}.`}
        </KText>
      </Stage>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <DragToken label="Añadir protón" getTarget={getTarget} onStart={measure} onDrop={() => { if (p < ATOM_LIMITS.maxProtons) { setP(p + 1); changed(); } }}>
            <Token color={P_COLOR} label={`Protón · ${p}`} sign="+" />
          </DragToken>
          <MinusButton label="Quitar protón" disabled={p === 0} onPress={() => { setP(p - 1); changed(); }} />
        </View>
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <DragToken label="Añadir neutrón" getTarget={getTarget} onStart={measure} onDrop={() => { if (n < ATOM_LIMITS.maxNeutrons) { setN(n + 1); changed(); } }}>
            <Token color={N_COLOR} label={`Neutrón · ${n}`} sign="0" />
          </DragToken>
          <MinusButton label="Quitar neutrón" disabled={n === 0} onPress={() => { setN(n - 1); changed(); }} />
        </View>
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <DragToken label="Añadir electrón" getTarget={getTarget} onStart={measure} onDrop={() => { if (e < ATOM_LIMITS.maxProtons + 3) { setE(e + 1); changed(); } }}>
            <Token color={E_COLOR} label={`Electrón · ${e}`} sign="−" />
          </DragToken>
          <MinusButton label="Quitar electrón" disabled={e === 0} onPress={() => { setE(e - 1); changed(); }} />
        </View>
      </View>

      {mode === 'reto' ? (
        <View style={{ gap: spacing.sm }}>
          <Button
            label="Comprobar"
            onPress={() => {
              const r = checkAtom(challenge, p, n, e);
              setResult(r);
              if (r.correct) onExperiment();
            }}
          />
          {result && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <KataAvatar mood={result.correct ? 'celebrando' : 'pensativo'} size={64} />
              <View style={{ flex: 1, gap: 2 }}>
                <KText style={{ fontWeight: '700' }} color={result.correct ? colors.success : colors.warning}>
                  {result.correct ? '¡Correcto!' : 'Casi. Una pista:'}
                </KText>
                {result.hints.map((h) => (
                  <KText key={h} variant="caption">
                    {h}
                  </KText>
                ))}
              </View>
            </View>
          )}
          {result?.correct && (
            <Button
              label="Siguiente reto"
              variant="secondary"
              onPress={() => {
                setChallengeIdx(challengeIdx + 1);
                setP(0);
                setN(0);
                setE(0);
                setResult(null);
              }}
            />
          )}
        </View>
      ) : (
        <Button label="Vaciar átomo" variant="ghost" onPress={() => { setP(0); setN(0); setE(0); }} />
      )}
      <KText variant="caption" muted>
        Simulación con modelo de capas (Bohr) para visualizar: los electrones reales ocupan orbitales, no órbitas fijas. El
        tamaño del núcleo está muy exagerado: en la realidad es unas 100 000 veces menor que el átomo. Fuente: OpenStax
        Chemistry 2e, 2.3 y 6.4.
      </KText>
    </View>
  );
}
