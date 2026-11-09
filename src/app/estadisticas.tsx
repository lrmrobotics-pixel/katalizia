import { useState } from 'react';
import { View } from 'react-native';
import Svg, { G, Line, Rect, Text as SvgText } from 'react-native-svg';

import { Card, KText, ProgressBar, Screen } from '@/components/ui';
import { WORLDS } from '@/content/curriculum';
import { computeConsistency, levelFromXp } from '@/core/gamification/progress';
import { computeMastery, DEFAULT_MASTERY } from '@/core/learning/mastery';
import { computeStats, type DayStat } from '@/core/learning/stats';
import { worldConcepts, worldProgress } from '@/core/learning/unlock';
import { useLearning } from '@/state/learning';
import { useRewards } from '@/state/rewards';
import { useSettings } from '@/state/settings';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const pct = (v: number | null) => (v === null ? '—' : `${Math.round(v * 100)} %`);
const WEEKDAY = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

function ActivityChart({ days }: { days: DayStat[] }) {
  const { colors } = useTheme();
  const max = Math.max(1, ...days.map((d) => d.attempts));
  const w = 300 / days.length;
  const total = days.reduce((s, d) => s + d.attempts, 0);
  return (
    <Svg
      width="100%"
      height={140}
      viewBox="0 0 320 140"
      accessibilityLabel={`Ejercicios por día en los últimos ${days.length} días: ${total} en total`}>
      <Line x1={10} y1={110} x2={310} y2={110} stroke={colors.border} strokeWidth={1} />
      {days.map((d, i) => {
        const h = (d.attempts / max) * 90;
        const hc = (d.correct / max) * 90;
        const [y, m, dd] = d.day.split('-').map(Number);
        const wd = new Date(y, m - 1, dd).getDay();
        return (
          <G key={d.day}>
            <Rect x={10 + i * w + 2} y={110 - h} width={w - 4} height={h} fill={colors.surfaceAlt} stroke={colors.border} />
            <Rect x={10 + i * w + 2} y={110 - hc} width={w - 4} height={hc} fill={colors.accent} />
            <SvgText x={10 + i * w + w / 2} y={126} fill={colors.textMuted} fontSize={9} textAnchor="middle">
              {WEEKDAY[wd]}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

export default function Estadisticas() {
  const { colors } = useTheme();
  const [now] = useState(() => Date.now());
  const attempts = useLearning((s) => s.attempts);
  const completedUnits = useLearning((s) => s.completedUnits);
  const studyMs = useRewards((s) => s.studyMs);
  const xp = useRewards((s) => s.xp);
  const activeDays = useRewards((s) => s.activeDays);
  const counts = useRewards((s) => s.counts);
  const threshold = useSettings((s) => s.masteryThreshold);
  const weeklyGoal = useSettings((s) => s.weeklyGoalDays);

  const stats = computeStats(attempts, studyMs, now, 14);
  const level = levelFromXp(xp);
  const consistency = computeConsistency(activeDays, weeklyGoal, now);
  const lookup = (cid: string) => computeMastery(cid, attempts, { ...DEFAULT_MASTERY, threshold });
  const allConcepts = WORLDS.flatMap(worldConcepts);
  const mastered = allConcepts.filter((c) => lookup(c).status === 'mastered').length;
  const weekMinutes = stats.daily.slice(-7).reduce((s, d) => s + d.minutes, 0);

  const tile = (label: string, value: string) => (
    <View style={{ flexBasis: '47%', flexGrow: 1 }}>
      <Card>
        <KText muted variant="caption">
          {label}
        </KText>
        <KText variant="title">{value}</KText>
      </Card>
    </View>
  );

  return (
    <Screen>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {tile('Nivel', `${level.level} · ${xp} XP`)}
        {tile('Conceptos dominados', `${mastered} / ${allConcepts.length}`)}
        {tile('Precisión', pct(stats.accuracy))}
        {tile('Sin pistas', pct(stats.accuracyNoHints))}
        {tile('Estudio esta semana', `${weekMinutes} min`)}
        {tile('Estudio total', `${Math.floor(stats.totalMinutes / 60)} h ${stats.totalMinutes % 60} min`)}
        {tile('Días de estudio', String(consistency.totalActiveDays))}
        {tile('Semanas con meta', String(consistency.weekStreak))}
      </View>

      <Card>
        <KText variant="title">Últimos 14 días</KText>
        {stats.totalAttempts === 0 ? (
          <KText muted>Aún no hay ejercicios registrados. Tu gráfica aparecerá aquí.</KText>
        ) : (
          <>
            <ActivityChart days={stats.daily} />
            <KText muted variant="caption">
              Barra completa: ejercicios respondidos · parte de color: aciertos.
            </KText>
          </>
        )}
      </Card>

      <Card>
        <KText variant="title">Progreso por mundo</KText>
        {WORLDS.map((w) => (
          <View key={w.id} style={{ gap: spacing.xs }}>
            <KText>
              {w.order}. {w.title}
            </KText>
            <ProgressBar value={worldProgress(w, lookup)} color={w.color} label={`Dominio del mundo ${w.order}`} />
          </View>
        ))}
      </Card>

      <Card>
        <KText variant="title">Tipos de evidencia</KText>
        <KText muted variant="caption">
          El dominio exige acertar en tipos distintos de ejercicio, no solo repetir el mismo.
        </KText>
        {(
          [
            ['concept', 'Conceptos'],
            ['application', 'Aplicación'],
            ['problem', 'Problemas'],
            ['retention', 'Retención'],
          ] as const
        ).map(([k, label]) => {
          const v = stats.byKind[k];
          return (
            <KText key={k}>
              {label}: {v.correct}/{v.attempts} {v.attempts ? `(${Math.round((v.correct / v.attempts) * 100)} %)` : ''}
            </KText>
          );
        })}
      </Card>

      <Card>
        <KText variant="title">Historial</KText>
        <KText>Unidades superadas: {completedUnits.length}</KText>
        <KText>Repasos completados: {counts.reviewCompleted ?? 0}</KText>
        <KText>Minijuegos jugados: {counts.minigamePlayed ?? 0}</KText>
        <KText>Experimentos de laboratorio: {counts.labExperiment ?? 0}</KText>
        <KText color={colors.textMuted} variant="caption">
          El tiempo de estudio se cuenta en lecciones, repasos, juegos y laboratorio (máx. 60 min por sesión).
        </KText>
      </Card>
    </Screen>
  );
}
