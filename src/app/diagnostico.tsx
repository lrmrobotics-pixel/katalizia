import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { View } from 'react-native';

import { QuestionView } from '@/components/lesson/QuestionView';
import { PixelCat } from '@/components/pet/PixelCat';
import { Button, Card, KText, ProgressBar, Screen } from '@/components/ui';
import { AREA_LABELS, DIAGNOSTIC, summarizeDiagnostic, type DiagnosticArea, type DiagnosticResult } from '@/content/diagnostic';
import { useProfile } from '@/state/profile';
import { spacing } from '@/theme/tokens';

export default function Diagnostico() {
  const markDone = useProfile((s) => s.markDiagnosticDone);
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const answers = useRef<Record<string, boolean>>({});

  if (!started) {
    return (
      <Screen>
        <View style={{ alignItems: 'center' }}>
          <PixelCat mood="pensativo" size={120} />
        </View>
        <KText variant="title">Diagnóstico inicial</KText>
        <KText variant="bodyLg">
          Son {DIAGNOSTIC.length} preguntas cortas para conocer tu punto de partida en matemáticas, conceptos y lectura de
          problemas. No es un examen: no hay nota, y equivocarse aquí no te quita nada.
        </KText>
        <KText muted>No sabes una respuesta? Elige la que te parezca: nos ayuda a ajustar tu ruta.</KText>
        <Button label="Empezar" onPress={() => setStarted(true)} />
        <Button label="Ahora no" variant="ghost" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (result) {
    return (
      <Screen>
        <View style={{ alignItems: 'center' }}>
          <PixelCat mood="celebrando" size={120} />
        </View>
        <KText variant="title">Tu punto de partida</KText>
        <Card>
          {(Object.keys(result.byArea) as DiagnosticArea[]).map((a) => (
            <View key={a} style={{ gap: spacing.xs }}>
              <KText>
                {AREA_LABELS[a]}: {Math.round(result.byArea[a] * 100)} %
              </KText>
              <ProgressBar value={result.byArea[a]} label={AREA_LABELS[a]} />
            </View>
          ))}
        </Card>
        <Card>
          <KText style={{ fontWeight: '700' }}>Tu ruta recomendada</KText>
          {result.recommendations.map((r) => (
            <KText key={r}>• {r}</KText>
          ))}
        </Card>
        <Button label="Ir a la Academia" onPress={() => router.replace('/academia')} />
      </Screen>
    );
  }

  const q = DIAGNOSTIC[idx];
  return (
    <Screen>
      <ProgressBar value={idx / DIAGNOSTIC.length} label="Progreso del diagnóstico" />
      <KText muted variant="caption">
        Pregunta {idx + 1} de {DIAGNOSTIC.length} · {AREA_LABELS[q.area]}
      </KText>
      <Card>
        <QuestionView
          key={q.id}
          question={q}
          onDone={(o) => {
            answers.current[q.id] = o.correct;
            if (idx + 1 < DIAGNOSTIC.length) setIdx(idx + 1);
            else {
              const r = summarizeDiagnostic(answers.current);
              markDone(r.byArea);
              setResult(r);
            }
          }}
        />
      </Card>
    </Screen>
  );
}
