/**
 * Tabla periódica interactiva: 118 elementos en tres vistas (tabla con desplazamiento,
 * familias y lista), búsqueda, filtros, favoritos y comparación de dos elementos.
 */
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KText } from '@/components/ui';
import { alpha, Stage } from '@/components/ui/scene';
import { SciIcon } from '@/components/ui/SciIcon';
import { shorthandConfiguration, valenceElectronsForGroup } from '@/core/chemistry/electronConfig';
import { gridPosition, searchElements } from '@/core/chemistry/periodicLayout';
import { CATEGORY_LABELS, ELEMENTS, PHASE_LABELS, type ChemicalElement, type ElementCategory } from '@/data/elements';
import { useRewards } from '@/state/rewards';
import { CATEGORY_COLORS, MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const CELL = 48;
type View3 = 'tabla' | 'familias' | 'lista';

function Cell({ e, dim, picked, onPress, discovered }: { e: ChemicalElement; dim: boolean; picked: boolean; onPress: () => void; discovered: boolean }) {
  const { colors } = useTheme();
  const color = CATEGORY_COLORS[e.category];
  const { row, col } = gridPosition(e);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${e.name}, ${e.symbol}, número atómico ${e.z}`}
      style={({ pressed }) => ({
        position: 'absolute',
        left: col * (CELL + 3),
        top: row * (CELL + 3) + (row >= 8 ? 14 : 0),
        width: CELL,
        height: CELL,
        borderRadius: 10,
        borderWidth: picked ? 3 : 1.5,
        borderColor: picked ? colors.warning : alpha(color, 0.9),
        backgroundColor: alpha(color, discovered ? 0.34 : 0.16),
        alignItems: 'center',
        justifyContent: 'center',
        opacity: dim ? 0.2 : 1,
        transform: [{ scale: pressed ? 0.92 : 1 }],
      })}>
      <KText variant="caption" style={{ fontSize: 9, lineHeight: 10, position: 'absolute', top: 3, left: 4 }}>
        {String(e.z)}
      </KText>
      <KText style={{ fontWeight: '800', fontSize: 17, lineHeight: 20 }}>{e.symbol}</KText>
    </Pressable>
  );
}

function Segmented({ value, onChange }: { value: View3; onChange: (v: View3) => void }) {
  const { colors } = useTheme();
  const items: [View3, string][] = [
    ['tabla', 'Tabla'],
    ['familias', 'Familias'],
    ['lista', 'Lista'],
  ];
  return (
    <View style={{ flexDirection: 'row', backgroundColor: alpha(colors.text, 0.07), borderRadius: 14, padding: 3 }}>
      {items.map(([id, label]) => (
        <Pressable
          key={id}
          onPress={() => onChange(id)}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === id }}
          style={{ flex: 1, minHeight: MIN_TOUCH - 8, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: value === id ? colors.primary : 'transparent' }}>
          <KText variant="caption" color={value === id ? colors.onPrimary : colors.text} style={{ fontWeight: '800' }}>
            {label}
          </KText>
        </Pressable>
      ))}
    </View>
  );
}

function CompareRow({ label, a, b }: { label: string; a: string; b: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
      <KText style={{ flex: 1, textAlign: 'right', fontWeight: '700' }}>{a}</KText>
      <KText variant="caption" muted style={{ width: 92, textAlign: 'center' }}>
        {label}
      </KText>
      <KText style={{ flex: 1, fontWeight: '700' }}>{b}</KText>
    </View>
  );
}

function ComparePanel({ a, b, onClear }: { a: ChemicalElement; b: ChemicalElement; onClear: () => void }) {
  const { colors } = useTheme();
  const val = (e: ChemicalElement) => {
    const v = valenceElectronsForGroup(e.z, e.group);
    return v === null ? '—' : String(v);
  };
  const mass = (e: ChemicalElement) => (e.massIsMassNumber ? `[${e.mass}]` : `${e.mass} u`);
  return (
    <Stage tint={colors.warning} glow="center">
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <KText variant="title" color={CATEGORY_COLORS[a.category]}>
          {a.symbol}
        </KText>
        <KText variant="caption" muted>
          COMPARACIÓN
        </KText>
        <KText variant="title" color={CATEGORY_COLORS[b.category]}>
          {b.symbol}
        </KText>
      </View>
      <CompareRow label="Nombre" a={a.name} b={b.name} />
      <CompareRow label="Z" a={String(a.z)} b={String(b.z)} />
      <CompareRow label="Masa" a={mass(a)} b={mass(b)} />
      <CompareRow label="Grupo · período" a={`${a.group ?? 'f'} · ${a.period}`} b={`${b.group ?? 'f'} · ${b.period}`} />
      <CompareRow label="Familia" a={CATEGORY_LABELS[a.category]} b={CATEGORY_LABELS[b.category]} />
      <CompareRow label="Estado 25 °C" a={PHASE_LABELS[a.phase]} b={PHASE_LABELS[b.phase]} />
      <CompareRow label="e⁻ de valencia" a={val(a)} b={val(b)} />
      <CompareRow label="Configuración" a={shorthandConfiguration(a.z)} b={shorthandConfiguration(b.z)} />
      {a.group !== null && a.group === b.group && (
        <KText variant="caption">Mismo grupo: tienen los mismos electrones de valencia, por eso se parecen químicamente.</KText>
      )}
      {a.period === b.period && a.z !== b.z && <KText variant="caption">Mismo período: sus electrones externos están en la misma capa.</KText>}
      <Pressable onPress={onClear} accessibilityRole="button" style={{ minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
        <KText color={colors.accent} style={{ fontWeight: '700' }}>
          Elegir otros dos
        </KText>
      </Pressable>
    </Stage>
  );
}

export default function Tabla() {
  const { colors, fontSize } = useTheme();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<View3>('tabla');
  const [category, setCategory] = useState<ElementCategory | null>(null);
  const favorites = useRewards((s) => s.favorites);
  const discovered = useRewards((s) => s.discovered);
  const [onlyFav, setOnlyFav] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);

  const results = useMemo(
    () => searchElements(query).filter((e) => (!category || e.category === category) && (!onlyFav || favorites.includes(e.z))),
    [query, category, onlyFav, favorites],
  );
  const match = useMemo(() => new Set(results.map((e) => e.z)), [results]);

  const open = (e: ChemicalElement) => {
    if (!comparing) return router.push(`/tabla/${e.z}`);
    setPicked((p) => (p.includes(e.z) ? p.filter((z) => z !== e.z) : [...p, e.z].slice(-2)));
  };

  const chip = (label: string, on: boolean, onPress: () => void, color?: string) => (
    <Pressable
      key={label}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      style={{
        minHeight: 40,
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: color ?? colors.border,
        backgroundColor: on ? alpha(color ?? colors.primary, 0.35) : 'transparent',
      }}>
      <KText variant="caption" style={{ fontWeight: '700' }}>
        {label}
      </KText>
    </Pressable>
  );

  const pair = picked.map((z) => ELEMENTS.find((e) => e.z === z)!);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['left', 'right', 'bottom']}>
      <View style={{ padding: spacing.lg, paddingBottom: spacing.sm, gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderRadius: radius.lg, paddingHorizontal: spacing.md, backgroundColor: alpha(colors.text, 0.07) }}>
          <SciIcon name="target" color={colors.textMuted} size={18} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar: hierro, Fe o 26"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Buscar elemento"
            autoCorrect={false}
            style={{ flex: 1, minHeight: MIN_TOUCH, color: colors.text, fontSize: fontSize.body }}
          />
        </View>
        <Segmented value={mode} onChange={setMode} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.xs }}>
          {chip(comparing ? `Comparando (${picked.length}/2)` : 'Comparar', comparing, () => { setComparing(!comparing); setPicked([]); }, colors.warning)}
          {chip(`Favoritos (${favorites.length})`, onlyFav, () => setOnlyFav(!onlyFav), colors.accent)}
          {(Object.keys(CATEGORY_LABELS) as ElementCategory[]).map((c) => chip(CATEGORY_LABELS[c], category === c, () => setCategory(category === c ? null : c), CATEGORY_COLORS[c]))}
        </ScrollView>
        {comparing && pair.length < 2 && (
          <KText variant="caption" muted>
            Toca dos elementos para compararlos.
          </KText>
        )}
      </View>

      {comparing && pair.length === 2 && (
        <View style={{ paddingHorizontal: spacing.lg }}>
          <ComparePanel a={pair[0]} b={pair[1]} onClear={() => setPicked([])} />
        </View>
      )}

      {mode === 'tabla' && (
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
          <ScrollView horizontal contentContainerStyle={{ padding: spacing.lg }}>
            <View style={{ width: 18 * (CELL + 3), height: 10 * (CELL + 3) + 14 }}>
              {ELEMENTS.map((e) => (
                <Cell key={e.z} e={e} dim={!match.has(e.z)} picked={picked.includes(e.z)} onPress={() => open(e)} discovered={discovered.includes(e.z)} />
              ))}
            </View>
          </ScrollView>
          <KText variant="caption" muted style={{ paddingHorizontal: spacing.lg }}>
            Desliza horizontalmente para ver toda la tabla. Los elementos que ya consultaste se ven más intensos ({discovered.length}/118).
          </KText>
        </ScrollView>
      )}

      {mode === 'familias' && (
        <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl }}>
          {(Object.keys(CATEGORY_LABELS) as ElementCategory[]).map((c) => {
            const members = results.filter((e) => e.category === c);
            if (members.length === 0) return null;
            return (
              <View key={c} style={{ gap: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: CATEGORY_COLORS[c] }} />
                  <KText style={{ fontWeight: '800' }}>{CATEGORY_LABELS[c]}</KText>
                  <KText variant="caption" muted>
                    {members.length}
                  </KText>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {members.map((e) => (
                    <Pressable
                      key={e.z}
                      onPress={() => open(e)}
                      accessibilityRole="button"
                      accessibilityLabel={`${e.name}, ${e.symbol}`}
                      style={({ pressed }) => ({
                        width: 64,
                        height: 64,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: picked.includes(e.z) ? 3 : 1.5,
                        borderColor: picked.includes(e.z) ? colors.warning : CATEGORY_COLORS[c],
                        backgroundColor: alpha(CATEGORY_COLORS[c], 0.2),
                        transform: [{ scale: pressed ? 0.93 : 1 }],
                      })}>
                      <KText variant="caption" muted style={{ fontSize: 10, lineHeight: 12 }}>
                        {String(e.z)}
                      </KText>
                      <KText style={{ fontWeight: '800', fontSize: 18, lineHeight: 22 }}>{e.symbol}</KText>
                      <KText variant="caption" style={{ fontSize: 9, lineHeight: 11 }} numberOfLines={1}>
                        {e.name}
                      </KText>
                    </Pressable>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {mode === 'lista' && (
        <FlatList
          data={results}
          keyExtractor={(e) => String(e.z)}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.xs, paddingBottom: spacing.xxl }}
          ListEmptyComponent={<KText muted>Ningún elemento coincide con la búsqueda.</KText>}
          renderItem={({ item: e }) => (
            <Pressable
              onPress={() => open(e)}
              accessibilityRole="button"
              style={{
                minHeight: MIN_TOUCH,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                padding: spacing.sm,
                borderRadius: 12,
                borderWidth: picked.includes(e.z) ? 2 : 0,
                borderColor: colors.warning,
                backgroundColor: alpha(CATEGORY_COLORS[e.category], 0.12),
              }}>
              <View style={{ width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: alpha(CATEGORY_COLORS[e.category], 0.35) }}>
                <KText style={{ fontWeight: '800' }}>{e.symbol}</KText>
              </View>
              <KText style={{ flex: 1 }}>{e.name}</KText>
              <KText muted>Z = {e.z}</KText>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
