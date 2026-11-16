import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { KataAvatar } from '@/components/pet/KataAvatar';
import { Button, Card, KText, ProgressBar, Screen } from '@/components/ui';
import { makeRushRound, RUSH_SECONDS, rushPoints, type RushLevel, type RushRound } from '@/core/games';
import { useRewards } from '@/state/rewards';
import { useStudyTimer } from '@/state/useStudyTimer';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const LEVELS: { id: RushLevel; label: string; detail: string }[] = [
  { id: 'facil', label: 'Fácil', detail: 'Elementos 1–20' },
  { id: 'medio', label: 'Medio', detail: 'Elementos 1–36' },
  { id: 'dificil', label: 'Difícil', detail: 'Elementos 1–86' },
];

type Phase = 'menu' | 'playing' | 'done';

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
  const scoreRef = useRef(0);
  const endAt = useRef(0);

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        clearInterval(id);
        const r = useRewards.getState();
        r.award('minigamePlayed');
        setRecord(r.submitScore('rush', scoreRef.current));
        setPhase('done');
      }
    }, 250);
    return () => clearInterval(id);
  }, [phase]);

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
    // Breve pausa para ver la corrección y pasar a la siguiente.
    setTimeout(() => {
      setPicked(null);
      setRound(makeRushRound(Math.random, level));
    }, ok ? 350 : 900);
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
      <ProgressBar value={left / RUSH_SECONDS} label={`Tiempo restante: ${left} segundos`} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <KText>⏱ {left} s</KText>
        <KText>Racha {streak}</KText>
        <KText style={{ fontWeight: '700' }}>{score} pts</KText>
      </View>
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
