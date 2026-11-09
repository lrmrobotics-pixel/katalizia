import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, KText } from '@/components/ui';
import { gridPosition, searchElements } from '@/core/chemistry/periodicLayout';
import { CATEGORY_LABELS, ELEMENTS, type ChemicalElement, type ElementCategory } from '@/data/elements';
import { useRewards } from '@/state/rewards';
import { CATEGORY_COLORS, MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const CELL = 46;

function Cell({ e, dim }: { e: ChemicalElement; dim: boolean }) {
  const color = CATEGORY_COLORS[e.category];
  const { row, col } = gridPosition(e);
  return (
    <Pressable
      onPress={() => router.push(`/tabla/${e.z}`)}
      accessibilityRole="button"
      accessibilityLabel={`${e.name}, ${e.symbol}, número atómico ${e.z}`}
      style={{
        position: 'absolute',
        left: col * (CELL + 2),
        top: row * (CELL + 2) + (row >= 8 ? 12 : 0),
        width: CELL,
        height: CELL,
        borderWidth: 2,
        borderColor: color,
        backgroundColor: color + '33',
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: dim ? 0.25 : 1,
      }}>
      <KText variant="caption" style={{ fontSize: 9, lineHeight: 10, position: 'absolute', top: 2, left: 3 }}>
        {String(e.z)}
      </KText>
      <KText style={{ fontWeight: '800', fontSize: 16 }}>{e.symbol}</KText>
    </Pressable>
  );
}

export default function Tabla() {
  const { colors, fontSize } = useTheme();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'tabla' | 'lista'>('tabla');
  const [category, setCategory] = useState<ElementCategory | null>(null);
  const favorites = useRewards((s) => s.favorites);
  const [onlyFav, setOnlyFav] = useState(false);

  const results = useMemo(() => {
    return searchElements(query).filter(
      (e) => (!category || e.category === category) && (!onlyFav || favorites.includes(e.z)),
    );
  }, [query, category, onlyFav, favorites]);
  const match = useMemo(() => new Set(results.map((e) => e.z)), [results]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['left', 'right', 'bottom']}>
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar: hierro, Fe o 26"
          placeholderTextColor={colors.textMuted}
          accessibilityLabel="Buscar elemento"
          autoCorrect={false}
          style={{
            minHeight: MIN_TOUCH,
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            color: colors.text,
            fontSize: fontSize.body,
            backgroundColor: colors.surface,
          }}
        />
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Button
              label={mode === 'tabla' ? 'Ver lista' : 'Ver tabla'}
              variant="secondary"
              onPress={() => setMode(mode === 'tabla' ? 'lista' : 'tabla')}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label={onlyFav ? 'Todos' : `Favoritos (${favorites.length})`}
              variant="ghost"
              onPress={() => setOnlyFav(!onlyFav)}
            />
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.xs }}>
          {(Object.keys(CATEGORY_LABELS) as ElementCategory[]).map((c) => {
            const on = category === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCategory(on ? null : c)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                style={{
                  minHeight: 40,
                  justifyContent: 'center',
                  paddingHorizontal: spacing.sm,
                  borderWidth: 2,
                  borderRadius: radius.sm,
                  borderColor: CATEGORY_COLORS[c],
                  backgroundColor: on ? CATEGORY_COLORS[c] + '55' : 'transparent',
                }}>
                <KText variant="caption">{CATEGORY_LABELS[c]}</KText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {mode === 'tabla' ? (
        <ScrollView horizontal contentContainerStyle={{ padding: spacing.lg }}>
          <View style={{ width: 18 * (CELL + 2), height: 10 * (CELL + 2) + 12 }}>
            {ELEMENTS.map((e) => (
              <Cell key={e.z} e={e} dim={!match.has(e.z)} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(e) => String(e.z)}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.xs, paddingBottom: spacing.xxl }}
          ListEmptyComponent={<KText muted>Ningún elemento coincide con la búsqueda.</KText>}
          renderItem={({ item: e }) => (
            <Pressable
              onPress={() => router.push(`/tabla/${e.z}`)}
              accessibilityRole="button"
              style={{
                minHeight: MIN_TOUCH,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                padding: spacing.sm,
                borderWidth: 2,
                borderRadius: radius.md,
                borderColor: CATEGORY_COLORS[e.category],
                backgroundColor: colors.surface,
              }}>
              <KText style={{ width: 36, fontWeight: '800' }}>{e.symbol}</KText>
              <KText style={{ flex: 1 }}>{e.name}</KText>
              <KText muted>Z = {e.z}</KText>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
