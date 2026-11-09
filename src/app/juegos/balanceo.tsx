import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { PixelCat } from '@/components/pet/PixelCat';
import { Button, Card, KText, ProgressBar, Screen } from '@/components/ui';
import { Stepper } from '@/components/ui/Stepper';
import { balanceEquation } from '@/core/chemistry/balance';
import { checkCoefficients, equationParts, EQUATIONS, MAX_COEFFICIENT } from '@/core/games';
import { useRewards } from '@/state/rewards';
import { useStudyTimer } from '@/state/useStudyTimer';
import { spacing } from '@/theme/tokens';

const SUB = '₀₁₂₃₄₅₆₇₈₉';
const pretty = (f: string) => f.replace(/\d/g, (d) => SUB[Number(d)]);
const ROUNDS = 6;

/** Las 2 primeras ecuaciones son de calentamiento; el resto se elige al azar. */
function pick() {
  const rest = EQUATIONS.slice(2).sort(() => Math.random() - 0.5);
  return [...EQUATIONS.slice(0, 2), ...rest].slice(0, ROUNDS);
}

type Feedback = { kind: 'ok' | 'multiple' | 'wrong' | 'revealed'; text: string } | null;

export default function BalanceExpress() {
  useStudyTimer();
  const [list, setList] = useState(pick);
  const [idx, setIdx] = useState(0);
  const [coefs, setCoefs] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [tries, setTries] = useState(0);
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(false);

  if (idx >= list.length) {
    return (
      <Screen>
        <View style={{ alignItems: 'center' }}>
          <PixelCat mood="celebrando" size={110} />
        </View>
        <KText variant="title">{record ? '¡Nuevo récord!' : '¡Ecuaciones balanceadas!'}</KText>
        <KText variant="bodyLg">{score} puntos</KText>
        <Button
          label="Jugar otra vez"
          onPress={() => {
            setList(pick());
            setIdx(0);
            setScore(0);
            setRecord(false);
          }}
        />
        <Button label="Volver" variant="ghost" onPress={() => router.back()} />
      </Screen>
    );
  }

  const eq = list[idx];
  const { reactants, products } = equationParts(eq);
  const species = [...reactants, ...products];
  const c = species.map((_, i) => coefs[i] ?? 1);
  const done = feedback?.kind === 'ok' || feedback?.kind === 'revealed';

  const check = () => {
    const rc = c.slice(0, reactants.length);
    const pc = c.slice(reactants.length);
    const r = checkCoefficients(eq, rc, pc);
    setTries(tries + 1);
    if (r.minimal) {
      setScore(score + (tries === 0 ? 10 : 5));
      setFeedback({ kind: 'ok', text: '¡Balanceada! Mismo número de átomos de cada elemento a ambos lados.' });
    } else if (r.balanced) {
      setFeedback({ kind: 'multiple', text: 'Está balanceada, pero se puede simplificar: usa los coeficientes enteros más pequeños.' });
    } else {
      setFeedback({ kind: 'wrong', text: 'Aún no: cuenta los átomos de cada elemento a cada lado. Deja el O₂ o el H₂ para el final.' });
    }
  };

  const reveal = () => {
    const b = balanceEquation(eq);
    setCoefs([...b.reactantCoefficients, ...b.productCoefficients]);
    setFeedback({ kind: 'revealed', text: `Solución: ${pretty(b.text)}` });
  };

  const next = () => {
    if (idx + 1 >= list.length) {
      const r = useRewards.getState();
      r.award('minigamePlayed');
      setRecord(r.submitScore('balanceo', score));
    }
    setIdx(idx + 1);
    setCoefs([]);
    setFeedback(null);
    setTries(0);
  };

  const line = [
    reactants.map((f, i) => `${c[i] > 1 ? c[i] : ''}${pretty(f)}`).join(' + '),
    products.map((f, i) => `${c[reactants.length + i] > 1 ? c[reactants.length + i] : ''}${pretty(f)}`).join(' + '),
  ].join('  →  ');

  return (
    <Screen>
      <ProgressBar value={idx / list.length} label={`Ecuación ${idx + 1} de ${list.length}`} />
      <KText muted variant="caption">
        Ecuación {idx + 1} de {list.length} · {score} puntos
      </KText>
      <Card>
        <KText variant="title" style={{ textAlign: 'center' }}>
          {line}
        </KText>
      </Card>
      <Card>
        {species.map((f, i) => (
          <Stepper
            key={`${f}-${i}`}
            label={`Coeficiente de ${pretty(f)}${i < reactants.length ? ' (reactivo)' : ' (producto)'}`}
            value={c[i]}
            min={1}
            max={MAX_COEFFICIENT}
            onChange={(v) => {
              if (done) return;
              const nextC = [...c];
              nextC[i] = v;
              setCoefs(nextC);
              setFeedback(null);
            }}
          />
        ))}
      </Card>
      {feedback && (
        <Card>
          <KText>{feedback.text}</KText>
        </Card>
      )}
      {done ? (
        <Button label={idx + 1 >= list.length ? 'Ver resultado' : 'Siguiente ecuación'} onPress={next} />
      ) : (
        <View style={{ gap: spacing.sm }}>
          <Button label="Comprobar" onPress={check} />
          {tries >= 2 && <Button label="Ver solución (sin puntos)" variant="ghost" onPress={reveal} />}
        </View>
      )}
    </Screen>
  );
}
