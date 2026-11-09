import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { PixelCat } from '@/components/pet/PixelCat';
import { Button, Card, Chip, KText, ProgressBar, Screen } from '@/components/ui';
import { findUnit, WORLDS } from '@/content/curriculum';
import { computeConsistency, levelFromXp } from '@/core/gamification/progress';
import { dueConcepts } from '@/core/learning/review';
import { idleMood } from '@/core/pet/wellbeing';
import { useLearning } from '@/state/learning';
import { usePet } from '@/state/pet';
import { useProfile } from '@/state/profile';
import { useRewards } from '@/state/rewards';
import { useSettings } from '@/state/settings';
import { useMissions } from '@/state/useGamification';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function greeting(hour: number) {
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function Home() {
  const { colors } = useTheme();
  const name = useProfile((s) => s.displayName);
  const diagnosticDone = useProfile((s) => s.diagnosticDone);
  const lastUnitId = useLearning((s) => s.lastUnitId);
  const completedUnits = useLearning((s) => s.completedUnits);
  const cards = useLearning((s) => s.cards);
  const nextUnit = (lastUnitId ? findUnit(lastUnitId) : null) ?? findUnit(WORLDS[0].modules[0].units[0].id);
  const { xp, coins, activeDays, equipped } = useRewards();
  const weeklyGoal = useSettings((s) => s.weeklyGoalDays);
  const pet = usePet();
  const [now] = useState(() => Date.now());
  const hour = new Date(now).getHours();
  const lvl = levelFromXp(xp);
  const due = dueConcepts(cards, now).length;
  const consistency = computeConsistency(activeDays, weeklyGoal, now);
  const missions = useMissions(now);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
        <PixelCat mood={idleMood(pet, hour)} size={96} accessoryIds={Object.values(equipped)} />
        <View style={{ flex: 1, gap: spacing.xs }}>
          <KText variant="title" accessibilityRole="header">
            {greeting(hour)}, {name}
          </KText>
          <KText muted>¿Lista para una reacción nueva hoy?</KText>
        </View>
      </View>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <KText variant="pixel" color={colors.accent}>
            NIVEL {lvl.level}
          </KText>
          <Chip label={`${coins} monedas`} color={colors.warning} />
        </View>
        <ProgressBar value={lvl.progress} label={`Progreso al nivel ${lvl.level + 1}`} />
        <KText muted variant="caption">
          {xp - lvl.current} / {lvl.next - lvl.current} XP para el nivel {lvl.level + 1}
        </KText>
      </Card>

      <Card>
        <KText variant="bodyLg" style={{ fontWeight: '700' }}>
          Tu ritmo de esta semana
        </KText>
        <KText>
          {consistency.daysThisWeek} de {consistency.weeklyGoal} días de estudio
          {consistency.weekStreak > 0 ? ` · ${consistency.weekStreak} semana(s) cumpliendo tu meta` : ''}
        </KText>
        <KText muted variant="caption">
          Descansar no rompe nada. Tus días activos totales: {consistency.totalActiveDays}.
        </KText>
      </Card>

      {!diagnosticDone && (
        <Card accent={colors.warning}>
          <KText variant="bodyLg" style={{ fontWeight: '700' }}>
            Diagnóstico inicial
          </KText>
          <KText muted>10 preguntas sin nota para ajustar tu ruta de aprendizaje.</KText>
          <Button label="Hacer diagnóstico" onPress={() => router.push('/diagnostico')} />
        </Card>
      )}

      {due > 0 && (
        <Card accent={colors.accent}>
          <KText variant="bodyLg" style={{ fontWeight: '700' }}>
            Repaso del día
          </KText>
          <KText muted>
            {due} concepto(s) listos para repasar. Recordar en el momento justo fija lo aprendido.
          </KText>
          <Button label="Repasar ahora" onPress={() => router.push('/repaso')} />
        </Card>
      )}

      {nextUnit && (
        <Card accent={nextUnit.world.color}>
          <KText variant="bodyLg" style={{ fontWeight: '700' }}>
            Continuar aprendiendo
          </KText>
          <KText muted>
            Mundo {nextUnit.world.order} · {nextUnit.unit.title}
            {completedUnits.includes(nextUnit.unit.id) ? ' (superada, puedes repasarla)' : ''}
          </KText>
          <Button
            label="Continuar"
            onPress={() => router.push({ pathname: '/leccion/[id]', params: { id: nextUnit.unit.id } })}
          />
          <Button label="Ver la Academia" variant="ghost" onPress={() => router.push('/academia')} />
        </Card>
      )}

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <KText variant="bodyLg" style={{ fontWeight: '700' }}>
            Misiones de hoy
          </KText>
          <KText muted variant="caption">
            {missions.daily.filter((m) => m.done).length}/{missions.daily.length}
          </KText>
        </View>
        {missions.daily.map((m) => (
          <KText key={m.key} muted={m.done}>
            {m.done ? '✔' : '○'} {m.def.title} ({m.progress}/{m.target})
          </KText>
        ))}
        <Button label="Ver misiones e insignias" variant="ghost" onPress={() => router.push('/misiones')} />
      </Card>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <View style={{ flex: 1 }}>
          <Button label="Tabla periódica" variant="secondary" onPress={() => router.push('/tabla')} />
        </View>
        <View style={{ flex: 1 }}>
          <Button label="Mi gato" variant="secondary" onPress={() => router.push('/yo')} />
        </View>
      </View>
    </Screen>
  );
}
