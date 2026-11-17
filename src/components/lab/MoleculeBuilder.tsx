/**
 * Constructor de moléculas: añade átomos, arrástralos y toca dos para enlazarlos
 * (simple → doble → triple → quitar). Se valida con el modelo de valencia de Lewis.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { KataAvatar } from '@/components/pet/KataAvatar';
import { Button, KText } from '@/components/ui';
import { alpha, Stage } from '@/components/ui/scene';
import {
  BUILD_TARGETS,
  cycleBond,
  evaluateMolecule,
  freeValence,
  VALENCE,
  type Bond,
  type BuildAtom,
} from '@/core/lab';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const CANVAS_H = 300;
const R = 22;
/** Colores CPK habituales en modelos moleculares. */
const CPK: Record<string, { bg: string; fg: string }> = {
  H: { bg: '#F5F8FF', fg: '#0B1230' },
  C: { bg: '#3A4256', fg: '#FFFFFF' },
  N: { bg: '#3B6CF6', fg: '#FFFFFF' },
  O: { bg: '#E64B4B', fg: '#FFFFFF' },
  Cl: { bg: '#3FBF6A', fg: '#0B1230' },
  S: { bg: '#E7C83B', fg: '#0B1230' },
  F: { bg: '#8BD37A', fg: '#0B1230' },
};
const PALETTE = ['H', 'C', 'N', 'O', 'Cl', 'S'];
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const pretty = (f: string) => f.replace(/\d/g, (d) => SUB[Number(d)]);

function AtomNode({
  atom,
  selected,
  free,
  onMove,
  onTap,
  onRemove,
  width,
}: {
  atom: BuildAtom;
  selected: boolean;
  free: number;
  onMove: (x: number, y: number) => void;
  onTap: () => void;
  onRemove: () => void;
  width: number;
}) {
  const { colors } = useTheme();
  const cb = useRef({ atom, onMove, onTap, width });
  useEffect(() => {
    cb.current = { atom, onMove, onTap, width };
  });
  const start = useRef({ x: 0, y: 0 });
  const pan = useMemo(
    () =>
      // Los refs solo se leen dentro de los manejadores del gesto, nunca durante el render.
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          start.current = { x: cb.current.atom.x, y: cb.current.atom.y };
        },
        onPanResponderMove: (_, g) => {
          const w = cb.current.width;
          cb.current.onMove(
            Math.max(R, Math.min(w - R, start.current.x + g.dx)),
            Math.max(R, Math.min(CANVAS_H - R, start.current.y + g.dy)),
          );
        },
        onPanResponderRelease: (_, g) => {
          if (Math.abs(g.dx) + Math.abs(g.dy) < 6) cb.current.onTap();
        },
      }),
    [],
  );
  const c = CPK[atom.el];
  return (
    <View
      {...pan.panHandlers}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Átomo de ${atom.el}, ${free} enlace${free === 1 ? '' : 's'} libre${free === 1 ? '' : 's'}${selected ? ', seleccionado' : ''}`}
      accessibilityActions={[{ name: 'activate' }, { name: 'longpress', label: 'Quitar átomo' }]}
      onAccessibilityAction={(e) => (e.nativeEvent.actionName === 'longpress' ? onRemove() : onTap())}
      style={{
        position: 'absolute',
        left: atom.x - R,
        top: atom.y - R,
        width: R * 2,
        height: R * 2,
        borderRadius: R,
        backgroundColor: c.bg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: selected ? colors.warning : '#0B1230',
        boxShadow: selected ? `0 0 12px ${colors.warning}` : undefined,
      }}>
      <KText style={{ fontWeight: '800', color: c.fg }}>{atom.el}</KText>
      {free > 0 && (
        <View style={{ position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.warning, alignItems: 'center', justifyContent: 'center' }}>
          <KText variant="caption" color="#0B1230" style={{ fontSize: 11, lineHeight: 14, fontWeight: '800' }}>
            {String(free)}
          </KText>
        </View>
      )}
    </View>
  );
}

function BondLines({ atoms, bonds }: { atoms: BuildAtom[]; bonds: Bond[] }) {
  const { colors } = useTheme();
  return (
    <>
      {bonds.map((b) => {
        const A = atoms.find((a) => a.id === b.a)!;
        const B = atoms.find((a) => a.id === b.b)!;
        const dx = B.x - A.x, dy = B.y - A.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = (-dy / len) * 6, ny = (dx / len) * 6;
        const offsets = b.order === 1 ? [0] : b.order === 2 ? [-0.5, 0.5] : [-1, 0, 1];
        return offsets.map((o) => (
          <Line key={`${b.a}-${b.b}-${o}`} x1={A.x + nx * o} y1={A.y + ny * o} x2={B.x + nx * o} y2={B.y + ny * o} stroke={colors.text} strokeWidth={4} strokeLinecap="round" />
        ));
      })}
    </>
  );
}

export function MoleculeBuilder({ onExperiment }: { onExperiment: () => void }) {
  const { colors } = useTheme();
  const [atoms, setAtoms] = useState<BuildAtom[]>([]);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [width, setWidth] = useState(320);
  const [target, setTarget] = useState(0);
  const [rewarded, setRewarded] = useState<string[]>([]);
  const nextId = useRef(1);
  const goal = BUILD_TARGETS[target];
  const status = evaluateMolecule(atoms, bonds);
  const matches = status.kind === 'valid' && status.formula === goal.formula;

  const reward = (nextAtoms: BuildAtom[], nextBonds: Bond[], goalIdx = target) => {
    const g = BUILD_TARGETS[goalIdx];
    const st = evaluateMolecule(nextAtoms, nextBonds);
    if (st.kind === 'valid' && st.formula === g.formula && !rewarded.includes(g.formula)) {
      setRewarded([...rewarded, g.formula]);
      onExperiment();
    }
  };

  const add = (el: string) => {
    if (atoms.length >= 24) return;
    const id = nextId.current++;
    // Nuevos átomos en una espiral alrededor del centro para no taparse.
    const k = atoms.length;
    const a = k * 2.2;
    const r = 30 + 9 * k;
    const x = Math.max(R, Math.min(width - R, width / 2 + Math.cos(a) * Math.min(r, width / 2 - R)));
    const y = Math.max(R, Math.min(CANVAS_H - R, CANVAS_H / 2 + Math.sin(a) * Math.min(r, CANVAS_H / 2 - R)));
    setAtoms([...atoms, { id, el, x, y }]);
  };

  const tap = (id: number) => {
    if (selected === null) return setSelected(id);
    if (selected === id) return setSelected(null);
    const next = cycleBond(atoms, bonds, selected, id);
    setBonds(next);
    setSelected(null);
    reward(atoms, next);
  };

  const remove = (id: number) => {
    setAtoms(atoms.filter((a) => a.id !== id));
    setBonds(bonds.filter((b) => b.a !== id && b.b !== id));
    setSelected(null);
  };

  const clear = () => {
    setAtoms([]);
    setBonds([]);
    setSelected(null);
  };

  return (
    <View style={{ gap: spacing.md }}>
      <KText variant="caption" muted>
        Objetivo (o construye libremente):
      </KText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
        {BUILD_TARGETS.map((t, i) => (
          <Pressable
            key={t.formula}
            onPress={() => {
              setTarget(i);
              reward(atoms, bonds, i);
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: i === target }}
            accessibilityLabel={`${t.name}, ${t.formula}${rewarded.includes(t.formula) ? ', conseguida' : ''}`}
            style={{
              minHeight: 40,
              paddingHorizontal: spacing.md,
              justifyContent: 'center',
              borderRadius: 999,
              backgroundColor: i === target ? colors.primary : rewarded.includes(t.formula) ? alpha(colors.success, 0.2) : alpha(colors.text, 0.08),
            }}>
            <KText variant="caption" color={i === target ? colors.onPrimary : colors.text} style={{ fontWeight: '700' }}>
              {pretty(t.formula === 'H3N' ? 'NH3' : t.formula === 'ClH' ? 'HCl' : t.formula)}
            </KText>
          </Pressable>
        ))}
      </View>

      <Stage tint={colors.primary} glow="center" padded={false}>
        <View
          onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
          style={{ height: CANVAS_H }}
          accessibilityLabel="Mesa de trabajo de moléculas">
          <Svg width={width} height={CANVAS_H} style={{ position: 'absolute' }}>
            <BondLines atoms={atoms} bonds={bonds} />
          </Svg>
          {atoms.map((a) => (
            <AtomNode
              key={a.id}
              atom={a}
              width={width}
              selected={selected === a.id}
              free={freeValence(a, bonds)}
              onMove={(x, y) => setAtoms((list) => list.map((it) => (it.id === a.id ? { ...it, x, y } : it)))}
              onTap={() => tap(a.id)}
              onRemove={() => remove(a.id)}
            />
          ))}
          {atoms.length === 0 && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
              <KText muted style={{ textAlign: 'center' }}>
                Añade átomos con los botones. Toca un átomo y luego otro para enlazarlos; toca otra vez el mismo par para
                pasar a doble o triple enlace.
              </KText>
            </View>
          )}
        </View>
      </Stage>

      <View style={{ flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', flexWrap: 'wrap' }}>
        {PALETTE.map((el) => (
          <Pressable
            key={el}
            onPress={() => add(el)}
            accessibilityRole="button"
            accessibilityLabel={`Añadir ${el} (forma ${VALENCE[el]} enlace${VALENCE[el] === 1 ? '' : 's'})`}
            style={({ pressed }) => ({
              width: MIN_TOUCH + 4,
              height: MIN_TOUCH + 4,
              borderRadius: (MIN_TOUCH + 4) / 2,
              backgroundColor: CPK[el].bg,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#0B1230',
              transform: [{ scale: pressed ? 0.9 : 1 }],
            })}>
            <KText style={{ fontWeight: '800', color: CPK[el].fg }}>{el}</KText>
          </Pressable>
        ))}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <KataAvatar mood={matches ? 'celebrando' : status.kind === 'valid' ? 'curioso' : atoms.length ? 'concentrado' : 'explicando'} size={64} />
        <View style={{ flex: 1, gap: 2 }}>
          {status.kind === 'empty' && <KText>Objetivo: {goal.name}. Empieza por el átomo central.</KText>}
          {status.kind === 'incomplete' && (
            <KText>
              {pretty(status.formula)}: quedan {status.free} enlace{status.free === 1 ? '' : 's'} por formar (número amarillo en cada átomo).
            </KText>
          )}
          {status.kind === 'disconnected' && <KText>Hay piezas sueltas: todos los átomos deben formar una sola molécula.</KText>}
          {status.kind === 'valid' && (
            <>
              <KText style={{ fontWeight: '800' }} color={matches ? colors.success : colors.text}>
                {matches ? `¡${goal.name}!` : `Estructura válida: ${pretty(status.formula)}${status.known ? ` (${status.known.name})` : ''}`}
              </KText>
              <KText variant="caption">{(matches ? goal : status.known)?.note ?? 'Molécula con todas las valencias completas.'}</KText>
            </>
          )}
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View style={{ flex: 1 }}>
          <Button label="Quitar seleccionado" variant="secondary" disabled={selected === null} onPress={() => selected !== null && remove(selected)} />
        </View>
        <View style={{ flex: 1 }}>
          <Button label="Vaciar" variant="ghost" onPress={clear} />
        </View>
      </View>
      <KText variant="caption" muted>
        Modelo de valencias de Lewis para moléculas neutras (H 1, O 2, N 3, C 4, Cl 1, S 2). Es un esquema plano: no
        muestra la geometría 3D real ni los pares libres. Fuente: OpenStax Chemistry 2e, 7.3.
      </KText>
    </View>
  );
}
