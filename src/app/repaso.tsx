import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { QuestionView } from '@/components/lesson/QuestionView';
import { PixelCat } from '@/components/pet/PixelCat';
import { Button, Card, KText, ProgressBar, Screen } from '@/components/ui';
import { WORLDS } from '@/content/curriculum';
import { buildReviewSession } from '@/core/learning/review';
import type { Question } from '@/core/learning/types';
import { useLearning } from '@/state/learning';
import { useRewards } from '@/state/rewards';
import { useStudyTimer } from '@/state/useStudyTimer';

const UNITS = WORLDS.flatMap((w) => w.modules.flatMap((m) => m.units));

export default function Repaso() {
  const recordAttempt = useLearning((s) => s.recordAttempt);
  const award = useRewards((s) => s.award);
  useStudyTimer();
  // La sesión se fija al abrir la pantalla para que no cambie mientras respondes.
  const [session] = useState<Question[]>(() => {
    const { cards, attempts } = useLearning.getState();
    return buildReviewSession(UNITS, cards, attempts, Date.now());
  });
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);

  if (session.length === 0) {
    return (
      <Screen>
        <View style={{ alignItems: 'center' }}>
          <PixelCat mood="feliz" size={120} />
        </View>
        <KText variant="title">Nada pendiente por ahora</KText>
        <KText>
          Los repasos aparecen cuando toca recordar un concepto (al día siguiente, a los 6 días, etc.). Descansar
          también es parte de aprender.
        </KText>
        <Button label="Volver" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (idx >= session.length) {
    return (
      <Screen>
        <View style={{ alignItems: 'center' }}>
          <PixelCat mood="celebrando" size={120} />
        </View>
        <KText variant="title">¡Repaso completado!</KText>
        <KText>
          Acertaste {correct} de {session.length}. Cada repaso fortalece la memoria a largo plazo.
        </KText>
        <Button label="Volver al inicio" onPress={() => router.back()} />
      </Screen>
    );
  }

  const q = session[idx];
  return (
    <Screen>
      <ProgressBar value={idx / session.length} label="Progreso del repaso" />
      <KText muted variant="caption">
        Repaso {idx + 1} de {session.length}
      </KText>
      <Card>
        <QuestionView
          key={q.id}
          question={q}
          onDone={(o) => {
            recordAttempt({ questionId: q.id, conceptId: q.conceptId, kind: q.kind, correct: o.correct, hintsUsed: o.hintsUsed });
            award(o.correct ? 'exerciseCorrect' : 'exerciseAttempted');
            if (o.correct) setCorrect((c) => c + 1);
            if (idx + 1 === session.length) award('reviewCompleted');
            setIdx(idx + 1);
          }}
        />
      </Card>
    </Screen>
  );
}
