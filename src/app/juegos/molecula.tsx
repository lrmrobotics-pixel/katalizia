import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { KataAvatar } from '@/components/pet/KataAvatar';
import { Button, Card, KText, ProgressBar, Screen } from '@/components/ui';
import { Stepper } from '@/components/ui/Stepper';
import type { Composition } from '@/core/chemistry/formula';
import { checkMolecule, moleculePalette, MOLECULES, type MoleculeCheck } from '@/core/games';
import { useRewards } from '@/state/rewards';
import { useStudyTimer } from '@/state/useStudyTimer';
import { spacing } from '@/theme/tokens';

const ROUNDS = 6;
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = (n: number) => String(n).replace(/\d/g, (d) => SUB[Number(d)]);

/** Escribe la composición como fórmula legible (orden de la paleta). */
const asFormula = (c: Composition, order: string[]) =>
  order
    .filter((el) => (c[el] ?? 0) > 0)
    .map((el) => el + (c[el] > 1 ? sub(c[el]) : ''))
    .join('') || '—';

function newGame() {
  const targets = [...MOLECULES].sort(() => Math.random() - 0.5).slice(0, ROUNDS);
  return { targets, palettes: targets.map((t) => moleculePalette(t, Math.random)) };
}

export default function MolecularLab() {
  useStudyTimer();
  const [game, setGame] = useState(newGame);
  const [idx, setIdx] = useState(0);
  const [built, setBuilt] = useState<Composition>({});
  const [result, setResult] = useState<MoleculeCheck | null>(null);
  const [tries, setTries] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(false);

  const finished = idx >= ROUNDS;
  if (finished) {
    return (
      <Screen>
        <View style={{ alignItems: 'center' }}>
          <KataAvatar mood="celebrando" size={110} />
        </View>
        <KText variant="title">{record ? '¡Nuevo récord!' : '¡Laboratorio completado!'}</KText>
        <KText variant="bodyLg">{score} puntos</KText>
        <Button
          label="Jugar otra vez"
          onPress={() => {
            setGame(newGame());
            setIdx(0);
            setScore(0);
            setRecord(false);
          }}
        />
        <Button label="Volver" variant="ghost" onPress={() => router.back()} />
      </Screen>
    );
  }

  const target = game.targets[idx];
  const palette = game.palettes[idx];
  const solved = result?.correct ?? false;

  const check = () => {
    const r = checkMolecule(built, target.formula);
    setResult(r);
    setTries(tries + 1);
    if (r.correct) setScore(score + (tries === 0 && !showHint ? 10 : 5));
  };

  const next = () => {
    const last = idx + 1 >= ROUNDS;
    if (last) {
      const r = useRewards.getState();
      r.award('minigamePlayed');
      setRecord(r.submitScore('molecula', score));
    }
    setIdx(idx + 1);
    setBuilt({});
    setResult(null);
    setTries(0);
    setShowHint(false);
  };

  const describeDiff = (d: Composition) =>
    Object.entries(d)
      .map(([el, n]) => (n > 0 ? `te ${n === 1 ? 'falta' : 'faltan'} ${n} de ${el}` : `te ${-n === 1 ? 'sobra' : 'sobran'} ${-n} de ${el}`))
      .join(', ');

  return (
    <Screen>
      <ProgressBar value={idx / ROUNDS} label={`Molécula ${idx + 1} de ${ROUNDS}`} />
      <KText muted variant="caption">
        Molécula {idx + 1} de {ROUNDS} · {score} puntos
      </KText>
      <Card>
        <KText muted>Construye:</KText>
        <KText variant="title">{target.name}</KText>
        <KText variant="display" style={{ textAlign: 'center' }} accessibilityRole="text">
          {asFormula(built, palette)}
        </KText>
        {showHint && <KText muted>Pista: la fórmula es {target.formula.replace(/\d/g, (d) => SUB[Number(d)])}</KText>}
      </Card>
      <Card>
        {palette.map((el) => (
          <Stepper
            key={el}
            label={`Átomos de ${el}`}
            value={built[el] ?? 0}
            min={0}
            max={12}
            onChange={(v) => {
              setBuilt({ ...built, [el]: v });
              setResult(null);
            }}
          />
        ))}
      </Card>
      {result && !result.correct && (
        <Card>
          <KText>Casi: {describeDiff(result.diff)}.</KText>
        </Card>
      )}
      {solved ? (
        <Card>
          <KText style={{ fontWeight: '700' }}>¡Correcto! {target.name}</KText>
          <KText muted>{target.fact}</KText>
          <Button label={idx + 1 >= ROUNDS ? 'Ver resultado' : 'Siguiente molécula'} onPress={next} />
        </Card>
      ) : (
        <View style={{ gap: spacing.sm }}>
          <Button label="Comprobar" onPress={check} />
          {!showHint && <Button label="Pedir pista" variant="ghost" onPress={() => setShowHint(true)} />}
        </View>
      )}
    </Screen>
  );
}
