/** Piezas comunes de los minijuegos: marcador con combo, reacción de Kata y pantalla final. */
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { KataAvatar } from '@/components/pet/KataAvatar';
import { Button, KText, Screen } from '@/components/ui';
import { GlowBar, Stage, StatPill } from '@/components/ui/scene';
import type { CatMood } from '@/core/pet/wellbeing';
import { useRewards } from '@/state/rewards';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Puntos: 10 por acierto + 2 por cada acierto seguido (máx. +10). Fallar no resta. */
export const comboPoints = (combo: number) => 10 + Math.min(combo, 5) * 2;

export function useGameSession(gameId: string, rounds: number) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hits, setHits] = useState(0);
  const [mood, setMood] = useState<CatMood>('curioso');
  const [finished, setFinished] = useState<{ record: boolean } | null>(null);

  const answer = (correct: boolean) => {
    if (correct) {
      setScore((s) => s + comboPoints(combo));
      setCombo((c) => c + 1);
      setHits((h) => h + 1);
      setMood('celebrando');
    } else {
      setCombo(0);
      setMood('pensativo');
    }
  };

  const next = () => {
    if (round + 1 >= rounds) {
      const r = useRewards.getState();
      r.award('minigamePlayed');
      setFinished({ record: r.submitScore(gameId, score) });
    } else {
      setRound(round + 1);
      setMood('curioso');
    }
  };

  const restart = () => {
    setRound(0);
    setScore(0);
    setCombo(0);
    setHits(0);
    setMood('curioso');
    setFinished(null);
  };

  return { round, rounds, score, combo, hits, mood, finished, answer, next, restart };
}

export function GameHeader({ title, s, tint }: { title: string; s: ReturnType<typeof useGameSession>; tint: string }) {
  const { colors } = useTheme();
  return (
    <Stage tint={tint} glow="top-right" particles={10}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md }}>
        <KataAvatar mood={s.mood} size={64} />
        <View style={{ flex: 1, gap: 6 }}>
          <KText variant="caption" color={tint} style={{ fontWeight: '800' }}>
            {title.toUpperCase()} · RONDA {Math.min(s.round + 1, s.rounds)}/{s.rounds}
          </KText>
          <GlowBar value={s.round / s.rounds} color={tint} label={`Ronda ${s.round + 1} de ${s.rounds}`} />
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <StatPill icon="trophy" value={`${s.score} pts`} color={colors.warning} label={`${s.score} puntos`} />
            {s.combo >= 2 && <StatPill icon="bolt" value={`Combo ×${s.combo}`} color={colors.accent} label={`Combo de ${s.combo}`} />}
          </View>
        </View>
      </View>
    </Stage>
  );
}

export function GameOver({ s, gameId, children }: { s: ReturnType<typeof useGameSession>; gameId: string; children?: ReactNode }) {
  const best = useRewards((r) => r.bestScores[gameId] ?? 0);
  return (
    <Screen>
      <Stage glow="center" particles={30}>
        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <KataAvatar mood="celebrando" size={130} />
          <KText variant="title">{s.finished?.record ? '¡Nuevo récord!' : '¡Partida completada!'}</KText>
          <KText variant="bodyLg">
            {s.score} puntos · {s.hits} de {s.rounds} aciertos
          </KText>
          <KText muted>Récord: {best} puntos. Cada partida suma experiencia, ganes o no.</KText>
        </View>
      </Stage>
      {children}
      <Button label="Jugar otra vez" onPress={s.restart} />
      <Button label="Volver" variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
