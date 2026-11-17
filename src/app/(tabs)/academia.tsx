/** Academia: ruta visual de 12 mundos; cada unidad es una parada del camino. */
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { KText, Screen } from '@/components/ui';
import { alpha, ProgressRing, Stage } from '@/components/ui/scene';
import { SciIcon } from '@/components/ui/SciIcon';
import { WorldArt } from '@/components/WorldArt';
import { WORLDS } from '@/content/curriculum';
import { isUnitUnlocked, isWorldUnlocked, worldProgress } from '@/core/learning/unlock';
import { worldDifficulty } from '@/core/pet/messages';
import { useLearning } from '@/state/learning';
import { useSettings } from '@/state/settings';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const NODE = 58;

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
        Del átomo a la Medicina. Cada mundo se abre al dominar el anterior (umbral {Math.round(threshold * 100)} % + repaso espaciado).
      </KText>
      {WORLDS.map((w) => {
        const unlocked = isWorldUnlocked(w, WORLDS, lookup);
        const units = w.modules.flatMap((m) => m.units);
        const prog = worldProgress(w, lookup);
        return (
          <Stage key={w.id} tint={unlocked ? w.color : colors.border} glow="top-right" style={{ opacity: unlocked ? 1 : 0.7 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <ProgressRing value={prog} size={84} stroke={5} color={w.color} label={`Dominio del mundo ${w.order}: ${Math.round(prog * 100)} %`}>
                <WorldArt worldId={w.id} color={w.color} size={68} locked={!unlocked} />
              </ProgressRing>
              <View style={{ flex: 1, gap: 2 }}>
                <KText variant="caption" color={w.color} style={{ fontWeight: '800' }}>
                  MUNDO {w.order} · {worldDifficulty(w.order).toUpperCase()}
                </KText>
                <KText variant="bodyLg" style={{ fontWeight: '800' }}>
                  {w.title}
                </KText>
                <KText muted variant="caption">
                  {w.subtitle} · {Math.round(prog * 100)} % dominado
                </KText>
              </View>
            </View>

            {unlocked ? (
              <View style={{ paddingVertical: spacing.sm }}>
                {units.map((u, i) => {
                  const open = isUnitUnlocked(u, lookup);
                  const done = completed.includes(u.id);
                  const left = i % 2 === 0;
                  const c = done ? colors.success : open ? w.color : alpha(colors.text, 0.25);
                  return (
                    <View key={u.id}>
                      {i > 0 && <View style={{ height: 18, width: 3, borderRadius: 2, alignSelf: 'center', backgroundColor: alpha(w.color, 0.4) }} />}
                      <Pressable
                        disabled={!open}
                        onPress={() => router.push({ pathname: '/leccion/[id]', params: { id: u.id } })}
                        accessibilityRole="button"
                        accessibilityState={{ disabled: !open }}
                        accessibilityLabel={`Unidad ${i + 1}: ${u.title}${done ? ', superada' : open ? '' : ', bloqueada'}`}
                        style={({ pressed }) => ({
                          flexDirection: left ? 'row' : 'row-reverse',
                          alignItems: 'center',
                          gap: spacing.md,
                          minHeight: MIN_TOUCH,
                          transform: [{ scale: pressed ? 0.97 : 1 }],
                        })}>
                        <View
                          style={{
                            width: NODE,
                            height: NODE,
                            borderRadius: NODE / 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: alpha(c, done || open ? 0.25 : 0.1),
                            borderWidth: 3,
                            borderColor: c,
                            boxShadow: open && !done ? `0 0 14px ${alpha(w.color, 0.6)}` : undefined,
                          }}>
                          <SciIcon name={done ? 'check' : open ? 'play' : 'lock'} color={c} size={24} />
                        </View>
                        <View style={{ flex: 1, alignItems: left ? 'flex-start' : 'flex-end' }}>
                          <KText style={{ fontWeight: '700', textAlign: left ? 'left' : 'right' }} muted={!open}>
                            {u.title}
                          </KText>
                          <KText variant="caption" muted>
                            {done ? 'Superada · repásala cuando quieras' : open ? 'Empezar' : 'Domina la anterior para abrirla'}
                          </KText>
                        </View>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
                {w.topics.slice(0, 4).map((t) => (
                  <View key={t} style={{ paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 999, backgroundColor: alpha(colors.text, 0.08) }}>
                    <KText variant="caption">{t}</KText>
                  </View>
                ))}
                {w.topics.length > 4 && <KText variant="caption" muted>+{w.topics.length - 4}</KText>}
                <KText variant="caption" muted style={{ width: '100%' }}>
                  Se abre al dominar el Mundo {w.order - 1}.
                </KText>
              </View>
            )}
          </Stage>
        );
      })}
    </Screen>
  );
}
