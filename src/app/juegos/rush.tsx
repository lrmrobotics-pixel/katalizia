import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { KataAvatar } from '@/components/pet/KataAvatar';
import { Button, Card, KText, ProgressBar, Screen } from '@/components/ui';
import { alpha, Stage, StatPill } from '@/components/ui/scene';
import type { CatMood } from '@/core/pet/wellbeing';
import { makeRushRound, RUSH_SECONDS, rushPoints, type RushLevel, type RushRound } from '@/core/games';
import { useRewards } from '@/state/rewards';
import { useStudyTimer } from '@/state/useStudyTimer';
import { CATEGORY_COLORS, MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const LEVELS: { id: RushLevel; label: string; detail: string }[] = [
  { id: 'facil', label: 'Fácil', detail: 'Elementos 1–20' },
  { id: 'medio', label: 'Medio', detail: 'Elementos 1–36' },
  { id: 'dificil', label: 'Difícil', detail: 'Elementos 1–86' },
];

type Phase = 'menu' | 'playing' | 'done';

/** Rondas del modo zen (sin cronómetro). */
const ZEN_ROUNDS = 20;

export default function PeriodicRush() {
  useStudyTimer();
  const { colors } = useTheme();
  const best = useRewards((s) => s.bestScores.rush ?? 0);
  const [phase, setPhase] = useState<Phase>('menu');
  const [level, setLevel] = useState<RushLevel>('facil');
  const [round, setRound] = useState<RushRound | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [hits, setHits] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [left, setLeft] = useState(RUSH_SECONDS);
  const [record, setRecord] = useState(false);
  const [zen, setZen] = useState(false);
  const [mood, setMood] = useState<CatMood>('curioso');
  const scoreRef = useRef(0);
  const endAt = useRef(0);

  const finish = () => {
    const r = useRewards.getState();
    r.award('minigamePlayed');
    // El modo zen no compite por récord: es para practicar sin presión.
    setRecord(zen ? false : r.submitScore('rush', scoreRef.current));
    setPhase('done');
  };

  useEffect(() => {
    if (phase !== 'playing' || zen) return;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        clearInterval(id);
        finish();
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, zen]);

  const start = () => {
    scoreRef.current = 0;
    endAt.current = Date.now() + RUSH_SECONDS * 1000;
    setScore(0);
    setStreak(0);
    setAnswered(0);
    setHits(0);
    setPicked(null);
    setLeft(RUSH_SECONDS);
    setRecord(false);
    setRound(makeRushRound(Math.random, level));
    setPhase('playing');
  };

  const choose = (opt: string) => {
    if (!round || picked) return;
    const ok = opt === round.answer;
    const pts = rushPoints(ok, streak);
    scoreRef.current += pts;
    setScore(scoreRef.current);
    setStreak(ok ? streak + 1 : 0);
    setAnswered(answered + 1);
    if (ok) setHits(hits + 1);
    setPicked(opt);
    setMood(ok ? 'celebrando' : 'pensativo');
    // Breve pausa para ver la corrección y pasar a la siguiente.
    setTimeout(() => {
      setPicked(null);
      setMood('concentrado');
      if (zen && answered + 1 >= ZEN_ROUNDS) finish();
      else setRound(makeRushRound(Math.random, level));
    }, ok ? 450 : 1100);
  };

  if (phase === 'menu') {
    return (
      <Screen>
        <View style={{ alignItems: 'center' }}>
          <KataAvatar mood="experimentando" size={110} />
        </View>
        <KText variant="title">Periodic Rush</KText>
        <KText>
          Tienes {RUSH_SECONDS} segundos. Te mostraré un elemento y eliges su símbolo (o al revés). Fallar no resta: solo
          reinicia la racha.
        </KText>
        {best > 0 && <KText muted>Tu récord: {best} puntos</KText>}
        <View style={{ gap: spacing.sm }}>
          {LEVELS.map((l) => (
            <Pressable
              key={l.id}
              onPress={() => setLevel(l.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: level === l.id }}
              style={{
                minHeight: MIN_TOUCH,
                padding: spacing.sm,
                borderWidth: 2,
                borderRadius: radius.md,
                borderColor: level === l.id ? colors.accent : colors.border,
                backgroundColor: level === l.id ? colors.surfaceAlt : 'transparent',
              }}>
              <KText style={{ fontWeight: '700' }}>{l.label}</KText>
              <KText muted variant="caption">
                {l.detail}
              </KText>
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={() => setZen(!zen)}
          accessibilityRole="switch"
          accessibilityState={{ checked: zen }}
          style={{ minHeight: MIN_TOUCH, padding: spacing.sm, borderRadius: radius.md, borderWidth: 2, borderColor: zen ? colors.accent : colors.border }}>
          <KText style={{ fontWeight: '700' }}>{zen ? 'Modo zen: activado' : 'Modo zen: desactivado'}</KText>
          <KText muted variant="caption">
            Sin cronómetro: {ZEN_ROUNDS} preguntas a tu ritmo (no cuenta para el récord).
          </KText>
        </Pressable>
        <Button label="¡Empezar!" onPress={start} testID="rush-start" />
      </Screen>
    );
  }

  if (phase === 'done') {
    return (
      <Screen>
        <View style={{ alignItems: 'center' }}>
          <KataAvatar mood="celebrando" size={110} />
        </View>
        <KText variant="title">{record ? '¡Nuevo récord!' : '¡Tiempo!'}</KText>
        <KText variant="bodyLg">
          {score} puntos · {hits} de {answered} aciertos
        </KText>
        <KText muted>Cada partida suma experiencia, ganes o no.</KText>
        <Button label="Jugar otra vez" onPress={start} />
        <Button label="Volver" variant="ghost" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stage tint={round ? CATEGORY_COLORS[round.element.category] : colors.primary} glow="top-right" particles={10}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md }}>
          <KataAvatar mood={mood} size={60} />
          <View style={{ flex: 1, gap: 6 }}>
            {zen ? (
              <ProgressBar value={answered / ZEN_ROUNDS} label={`Pregunta ${answered + 1} de ${ZEN_ROUNDS}`} />
            ) : (
              <ProgressBar value={left / RUSH_SECONDS} label={`Tiempo restante: ${left} segundos`} />
            )}
            <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
              <StatPill icon={zen ? 'target' : 'thermo'} value={zen ? `${answered}/${ZEN_ROUNDS}` : `${left} s`} color={colors.accent} label={zen ? `${answered} de ${ZEN_ROUNDS}` : `${left} segundos`} />
              <StatPill icon="trophy" value={`${score} pts`} color={colors.warning} label={`${score} puntos`} />
              {streak >= 2 && <StatPill icon="bolt" value={`Combo ×${streak}`} color={alpha(colors.danger, 1)} label={`Combo de ${streak}`} />}
            </View>
          </View>
        </View>
      </Stage>
      {round && (
        <Card>
          <KText muted>{round.mode === 'symbol' ? '¿Cuál es el símbolo de…?' : '¿Qué elemento tiene el símbolo…?'}</KText>
          <KText variant="display" style={{ textAlign: 'center' }}>
            {round.mode === 'symbol' ? round.element.name : round.element.symbol}
          </KText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {round.options.map((o) => {
              const state = picked ? (o === round.answer ? 'right' : o === picked ? 'wrong' : null) : null;
              return (
                <Pressable
                  key={o}
                  onPress={() => choose(o)}
                  accessibilityRole="button"
                  accessibilityLabel={o}
                  style={{
                    flexBasis: '47%',
                    flexGrow: 1,
                    minHeight: MIN_TOUCH + 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderRadius: radius.md,
                    borderColor: state === 'right' ? colors.success : state === 'wrong' ? colors.danger : colors.border,
                    backgroundColor: colors.surfaceAlt,
                  }}>
                  <KText variant="bodyLg">{o}</KText>
                </Pressable>
              );
            })}
          </View>
          {picked && picked !== round.answer && (
            <KText muted variant="caption">
              {round.element.name} = {round.element.symbol} (Z = {round.element.z})
            </KText>
          )}
        </Card>
      )}
    </Screen>
  );
}
