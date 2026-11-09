import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Card, Chip, KText, ProgressBar, Screen } from '@/components/ui';
import { WORLDS } from '@/content/curriculum';
import { isUnitUnlocked, isWorldUnlocked, worldProgress } from '@/core/learning/unlock';
import { useLearning } from '@/state/learning';
import { useSettings } from '@/state/settings';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function Academia() {
  const { colors } = useTheme();
  const masteryOf = useLearning((s) => s.masteryOf);
  const completed = useLearning((s) => s.completedUnits);
  useLearning((s) => s.attempts); // re-render cuando cambia el historial
  const threshold = useSettings((s) => s.masteryThreshold);
  const lookup = (id: string) => masteryOf(id, threshold);

  return (
    <Screen>
      <KText variant="display" accessibilityRole="header">
        Academia
      </KText>
      <KText muted>
        12 mundos del átomo a la Medicina. Cada mundo se abre cuando dominas el anterior (umbral{' '}
        {Math.round(threshold * 100)} % + repaso espaciado).
      </KText>
      {WORLDS.map((w) => {
        const unlocked = isWorldUnlocked(w, WORLDS, lookup);
        const units = w.modules.flatMap((m) => m.units);
        return (
          <Card key={w.id} accent={unlocked ? w.color : undefined} style={{ opacity: unlocked ? 1 : 0.6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <KText variant="pixel" color={w.color}>
                MUNDO {w.order}
              </KText>
              <Chip label={unlocked ? 'Abierto' : 'Bloqueado'} color={unlocked ? colors.success : colors.border} />
            </View>
            <KText variant="bodyLg" style={{ fontWeight: '700' }}>
              {w.title}
            </KText>
            <KText muted>{w.subtitle}</KText>
            <ProgressBar value={worldProgress(w, lookup)} color={w.color} label={`Dominio del mundo ${w.order}`} />

            {unlocked && units.length > 0 ? (
              units.map((u, i) => {
                const open = isUnitUnlocked(u, lookup);
                const done = completed.includes(u.id);
                return (
                  <Pressable
                    key={u.id}
                    disabled={!open}
                    onPress={() => router.push({ pathname: '/leccion/[id]', params: { id: u.id } })}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !open }}
                    accessibilityLabel={`Unidad ${i + 1}: ${u.title}${open ? '' : ', bloqueada'}`}
                    style={{
                      minHeight: MIN_TOUCH,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.sm,
                      paddingHorizontal: spacing.md,
                      borderWidth: 2,
                      borderRadius: radius.md,
                      borderColor: done ? colors.success : open ? w.color : colors.border,
                      opacity: open ? 1 : 0.5,
                    }}>
                    <KText style={{ flex: 1 }}>
                      {i + 1}. {u.title}
                    </KText>
                    <KText muted variant="caption">
                      {done ? '✓ superada' : open ? 'Empezar' : 'Bloqueada'}
                    </KText>
                  </Pressable>
                );
              })
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
                {w.topics.slice(0, 4).map((t) => (
                  <Chip key={t} label={t} />
                ))}
                {w.topics.length > 4 && <Chip label={`+${w.topics.length - 4}`} />}
              </View>
            )}
            {unlocked && units.length === 0 && (
              <KText muted variant="caption">
                Contenido en preparación.
              </KText>
            )}
            {!unlocked && w.requires.length > 0 && (
              <KText muted variant="caption">
                Se abre al dominar el Mundo {w.order - 1}.
              </KText>
            )}
          </Card>
        );
      })}
    </Screen>
  );
}
