/**
 * Inicio — centro de operaciones: Kata y saludo, progreso, misión principal,
 * mapa de mundos, continuar aprendiendo y accesos rápidos.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { KataAvatar } from '@/components/pet/KataAvatar';
import { Button, KText, Screen } from '@/components/ui';
import { ActionTile, alpha, GlowBar, ProgressRing, SectionHeader, Stage, StatPill } from '@/components/ui/scene';
import { SciIcon } from '@/components/ui/SciIcon';
import { WorldArt } from '@/components/WorldArt';
import { findUnit, WORLDS } from '@/content/curriculum';
import { computeConsistency, dayKey, levelFromXp, XP_REWARDS } from '@/core/gamification/progress';
import { isUnitUnlocked, isWorldUnlocked, worldProgress } from '@/core/learning/unlock';
import { dueConcepts } from '@/core/learning/review';
import { kataMessage, timeGreeting, worldDifficulty } from '@/core/pet/messages';
import { useLearning } from '@/state/learning';
import { useProfile } from '@/state/profile';
import { useRewards } from '@/state/rewards';
import { useSettings } from '@/state/settings';
import { useMissions } from '@/state/useGamification';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const DAY_MS = 86_400_000;

export default function Home() {
  const { colors } = useTheme();
  const name = useProfile((s) => s.displayName);
  const diagnosticDone = useProfile((s) => s.diagnosticDone);
  const lastUnitId = useLearning((s) => s.lastUnitId);
  const completedUnits = useLearning((s) => s.completedUnits);
  const cards = useLearning((s) => s.cards);
  const masteryOf = useLearning((s) => s.masteryOf);
  useLearning((s) => s.attempts); // re-render cuando cambia el historial
  const threshold = useSettings((s) => s.masteryThreshold);
  const { xp, coins, activeDays } = useRewards();
  const weeklyGoal = useSettings((s) => s.weeklyGoalDays);
  const [now] = useState(() => Date.now());
  const hour = new Date(now).getHours();
  const lvl = levelFromXp(xp);
  const due = dueConcepts(cards, now).length;
  const consistency = computeConsistency(activeDays, weeklyGoal, now);
  const missions = useMissions(now);
  const lookup = (id: string) => masteryOf(id, threshold);

  const lastDay = activeDays.length ? [...activeDays].sort().at(-1)! : null;
  const daysAway = lastDay ? Math.round((Date.parse(dayKey(now)) - Date.parse(lastDay)) / DAY_MS) : null;
  const missionsLeft = missions.daily.filter((m) => !m.done).length;
  const claimable = [...missions.daily, ...missions.weekly].filter((m) => m.done && !m.claimed).length;
  const message = kataMessage({ hour, diagnosticDone, dueReviews: due, missionsLeft, daysThisWeek: consistency.daysThisWeek, weeklyGoal, daysAway });
  const alerts = due + claimable;

  // Misión principal: la siguiente unidad abierta (o el diagnóstico si falta).
  const allUnits = WORLDS.flatMap((w) => w.modules.flatMap((m) => m.units));
  const nextOpen = allUnits.find((u) => !completedUnits.includes(u.id) && isUnitUnlocked(u, lookup));
  const main = findUnit(nextOpen?.id ?? lastUnitId ?? allUnits[0].id);
  const continueUnit = lastUnitId ? findUnit(lastUnitId) : null;

  return (
    <Screen>
      {/* A. Encabezado */}
      <Stage particles={18} glow="top-right">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable onPress={() => router.push('/yo')} accessibilityRole="button" accessibilityLabel="Ir a mi perfil" style={{ minHeight: MIN_TOUCH, justifyContent: 'center' }}>
            <KText variant="caption" muted>
              {timeGreeting(hour)}
            </KText>
            <KText variant="title" accessibilityRole="header">
              {name}
            </KText>
          </Pressable>
          <Pressable
            onPress={() => router.push(due > 0 ? '/repaso' : '/misiones')}
            accessibilityRole="button"
            accessibilityLabel={alerts > 0 ? `${alerts} avisos: repasos o misiones por reclamar` : 'Sin avisos pendientes'}
            style={{ width: MIN_TOUCH, height: MIN_TOUCH, borderRadius: MIN_TOUCH / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: alpha(colors.text, 0.08) }}>
            <SciIcon name="bell" color={colors.text} size={22} />
            {alerts > 0 && (
              <View style={{ position: 'absolute', top: 6, right: 6, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: colors.warning, alignItems: 'center', justifyContent: 'center' }}>
                <KText variant="caption" color="#0B1230" style={{ fontSize: 11, lineHeight: 14, fontWeight: '800' }}>
                  {String(alerts)}
                </KText>
              </View>
            )}
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md }}>
          <Pressable onPress={() => router.push('/yo')} accessibilityRole="button" accessibilityLabel="Ver a Kata">
            <KataAvatar mood={message.mood} size={104} />
          </Pressable>
          <View style={{ flex: 1, marginBottom: spacing.md }}>
            <View style={{ backgroundColor: alpha(colors.text, 0.08), borderRadius: 16, borderBottomLeftRadius: 4, padding: spacing.md }}>
              <KText>{message.text}</KText>
            </View>
          </View>
        </View>

        {/* B. Progreso */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <ProgressRing value={lvl.progress} size={60} label={`Nivel ${lvl.level}, ${Math.round(lvl.progress * 100)} % hacia el siguiente`}>
            <KText variant="caption" muted style={{ fontSize: 10, lineHeight: 12 }}>
              NIVEL
            </KText>
            <KText style={{ fontWeight: '800', fontSize: 18, lineHeight: 20 }}>{String(lvl.level)}</KText>
          </ProgressRing>
          <View style={{ flex: 1, gap: 6 }}>
            <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
              <StatPill icon="bolt" value={`${xp} XP`} color={colors.accent} label={`${xp} puntos de experiencia`} />
              <StatPill icon="coin" value={String(coins)} color={colors.warning} label={`${coins} monedas`} />
            </View>
            <GlowBar value={lvl.progress} label={`Progreso al nivel ${lvl.level + 1}`} />
            <KText variant="caption" muted>
              {xp - lvl.current} / {lvl.next - lvl.current} XP para el nivel {lvl.level + 1}
            </KText>
          </View>
        </View>
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <KText variant="caption" style={{ fontWeight: '700' }}>
              Ritmo semanal
            </KText>
            <KText variant="caption" muted>
              {consistency.daysThisWeek} de {consistency.weeklyGoal} días
              {consistency.weekStreak > 0 ? ` · ${consistency.weekStreak} sem. cumpliendo` : ''}
            </KText>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }} accessible accessibilityLabel={`${consistency.daysThisWeek} de ${consistency.weeklyGoal} días de estudio esta semana`}>
            {Array.from({ length: consistency.weeklyGoal }, (_, i) => (
              <View key={i} style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: i < consistency.daysThisWeek ? colors.warning : alpha(colors.text, 0.1) }} />
            ))}
          </View>
          <KText variant="caption" muted>
            Descansar no rompe nada.
          </KText>
        </View>
      </Stage>

      {/* C. Misión principal */}
      {!diagnosticDone ? (
        <Stage tint={colors.warning} glow="top-left">
          <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
            <WorldArt worldId="m12-preu" color={colors.warning} size={76} />
            <View style={{ flex: 1, gap: 2 }}>
              <KText variant="caption" color={colors.warning} style={{ fontWeight: '800' }}>
                TU MISIÓN DE HOY
              </KText>
              <KText variant="bodyLg" style={{ fontWeight: '800' }}>
                Diagnóstico inicial
              </KText>
              <KText muted variant="caption">
                10 preguntas sin nota para ajustar tu ruta.
              </KText>
            </View>
          </View>
          <Button label="Comenzar diagnóstico" onPress={() => router.push('/diagnostico')} />
        </Stage>
      ) : (
        main && (
          <Stage tint={main.world.color} glow="top-left">
            <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
              <WorldArt worldId={main.world.id} color={main.world.color} size={76} />
              <View style={{ flex: 1, gap: 2 }}>
                <KText variant="caption" color={main.world.color} style={{ fontWeight: '800' }}>
                  TU MISIÓN DE HOY
                </KText>
                <KText variant="bodyLg" style={{ fontWeight: '800' }}>
                  {main.unit.title}
                </KText>
                <KText muted variant="caption" numberOfLines={2}>
                  {main.unit.objectives[0]}
                </KText>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
              <StatPill icon="map" value={`Mundo ${main.world.order}`} color={main.world.color} label={`Mundo ${main.world.order}`} />
              <StatPill icon="target" value={worldDifficulty(main.world.order)} color={colors.accent} label={`Dificultad ${worldDifficulty(main.world.order)}`} />
              <StatPill icon="bolt" value={`+${XP_REWARDS.lessonCompleted} XP`} color={colors.warning} label={`Recompensa ${XP_REWARDS.lessonCompleted} XP al superarla`} />
            </View>
            <Button label="Comenzar" onPress={() => router.push({ pathname: '/leccion/[id]', params: { id: main.unit.id } })} />
          </Stage>
        )
      )}

      {/* F. Actividades rápidas */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ActionTile icon="flask" label="Laboratorio" color={colors.accent} onPress={() => router.push('/laboratorio')} />
        <ActionTile icon="game" label="Juegos" color="#F472B6" onPress={() => router.push('/explorar')} />
        <ActionTile icon="table" label="Tabla" color="#A78BFA" onPress={() => router.push('/tabla')} />
        <ActionTile icon="kata" label="Tutor" color={colors.primary} onPress={() => router.push('/tutor')} />
        <ActionTile
          icon="review"
          label={due > 0 ? `Repaso (${due})` : 'Repaso'}
          color={colors.warning}
          onPress={() => router.push('/repaso')}
          caption={due > 0 ? `${due} conceptos listos` : 'Nada pendiente'}
        />
      </View>

      {/* D. Mapa de mundos */}
      <SectionHeader title="Mapa de mundos" action="Abrir Academia" onAction={() => router.push('/academia')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingVertical: spacing.xs }}>
        {WORLDS.map((w, i) => {
          const unlocked = isWorldUnlocked(w, WORLDS, lookup);
          const prog = worldProgress(w, lookup);
          return (
            <View key={w.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              {i > 0 && <View style={{ width: 14, height: 3, borderRadius: 2, backgroundColor: unlocked ? w.color : alpha(colors.text, 0.15), marginRight: spacing.sm }} />}
              <Pressable
                onPress={() => router.push('/academia')}
                accessibilityRole="button"
                accessibilityLabel={`Mundo ${w.order}: ${w.title}. ${unlocked ? `${Math.round(prog * 100)} % de dominio` : 'bloqueado'}`}
                style={({ pressed }) => ({ width: 104, alignItems: 'center', gap: 4, transform: [{ scale: pressed ? 0.95 : 1 }] })}>
                <ProgressRing value={prog} size={86} stroke={5} color={w.color} label={`Dominio del mundo ${w.order}`}>
                  <WorldArt worldId={w.id} color={w.color} size={70} locked={!unlocked} />
                </ProgressRing>
                <KText variant="caption" color={w.color} style={{ fontWeight: '800' }}>
                  MUNDO {w.order}
                </KText>
                <KText variant="caption" style={{ textAlign: 'center' }} numberOfLines={2} muted={!unlocked}>
                  {w.title}
                </KText>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      {/* E. Continuar aprendiendo */}
      {continueUnit && continueUnit.unit.id !== main?.unit.id && (
        <Pressable
          onPress={() => router.push({ pathname: '/leccion/[id]', params: { id: continueUnit.unit.id } })}
          accessibilityRole="button"
          accessibilityLabel={`Continuar: ${continueUnit.unit.title}`}>
          <Stage tint={continueUnit.world.color} glow="none">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <WorldArt worldId={continueUnit.world.id} color={continueUnit.world.color} size={48} />
              <View style={{ flex: 1 }}>
                <KText variant="caption" muted>
                  Continuar aprendiendo · Mundo {continueUnit.world.order}
                </KText>
                <KText style={{ fontWeight: '700' }}>{continueUnit.unit.title}</KText>
              </View>
              <SciIcon name="play" color={continueUnit.world.color} size={22} />
            </View>
          </Stage>
        </Pressable>
      )}

      {/* Misiones de hoy */}
      <SectionHeader title="Misiones de hoy" action={`${missions.daily.filter((m) => m.done).length}/${missions.daily.length} · ver todas`} onAction={() => router.push('/misiones')} />
      <View style={{ gap: spacing.sm }}>
        {missions.daily.map((m) => (
          <View key={m.key} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View style={{ width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: m.done ? alpha(colors.success, 0.2) : alpha(colors.text, 0.08) }}>
              <SciIcon name={m.done ? 'check' : 'target'} color={m.done ? colors.success : colors.textMuted} size={16} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <KText muted={m.done}>{m.def.title}</KText>
              <GlowBar value={m.progress / m.target} height={5} color={m.done ? colors.success : colors.primary} label={`${m.def.title}: ${m.progress} de ${m.target}`} />
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}
