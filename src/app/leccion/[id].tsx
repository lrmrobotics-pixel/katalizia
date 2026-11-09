import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuestionView, type QuestionOutcome } from '@/components/lesson/QuestionView';
import { LessonVisual } from '@/components/lesson/Visuals';
import { PixelCat } from '@/components/pet/PixelCat';
import { Button, Card, Chip, KText, ProgressBar, StateView } from '@/components/ui';
import { conceptName, findUnit } from '@/content/curriculum';
import { scoreOf } from '@/core/learning/grading';
import { isUnitUnlocked } from '@/core/learning/unlock';
import type { LessonStep, Question } from '@/core/learning/types';
import { useLearning } from '@/state/learning';
import { useRewards } from '@/state/rewards';
import { useStudyTimer } from '@/state/useStudyTimer';
import { useSettings } from '@/state/settings';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const STATUS_LABEL = {
  new: 'Sin empezar',
  learning: 'Aprendiendo',
  'needs-retention': 'Falta repaso espaciado',
  mastered: 'Dominado',
  'needs-review': 'Necesita repaso',
} as const;

export default function Leccion() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const found = findUnit(id ?? '');
  const { colors } = useTheme();
  const threshold = useSettings((s) => s.masteryThreshold);
  const recordAttempt = useLearning((s) => s.recordAttempt);
  const masteryOf = useLearning((s) => s.masteryOf);
  const completeUnit = useLearning((s) => s.completeUnit);
  const setLastUnit = useLearning((s) => s.setLastUnit);
  const award = useRewards((s) => s.award);
  useStudyTimer();

  const [stepIdx, setStepIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState<Question[]>([]);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);

  const unit = found?.unit;
  const qById = useMemo(() => new Map(unit?.questions.map((q) => [q.id, q]) ?? []), [unit]);

  if (!found || !unit) {
    return <StateView state="error" message="Lección no encontrada." onRetry={() => router.back()} />;
  }

  const lookup = (cid: string) => masteryOf(cid, threshold);
  if (!isUnitUnlocked(unit, lookup)) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg, gap: spacing.lg }}>
        <Stack.Screen options={{ title: unit.title }} />
        <PixelCat mood="pensativo" size={100} />
        <KText>Esta unidad necesita que antes domines:</KText>
        {unit.concepts
          .flatMap((c) => c.prerequisites)
          .filter((p) => !unit.concepts.some((c) => c.id === p))
          .map((p) => (
            <Chip key={p} label={`${conceptName(p)} · ${STATUS_LABEL[lookup(p).status]}`} />
          ))}
        <Button label="Volver" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const step: LessonStep = unit.steps[stepIdx];
  const isReview = step.kind === 'error-review';
  const questions: Question[] = isReview
    ? failed
    : (step.questionIds ?? []).map((qid) => qById.get(qid)!).filter(Boolean);
  const hasQuestions = questions.length > 0;

  const next = (results: boolean[] = quizResults) => {
    setQIdx(0);
    if (stepIdx + 1 < unit.steps.length) {
      setStepIdx(stepIdx + 1);
      setLastUnit(unit.id);
    } else {
      const quizScore = scoreOf(results);
      if (quizScore >= threshold) {
        completeUnit(unit.id);
        award('lessonCompleted');
        if (quizScore === 1) award('assessmentPassed');
      }
      setFinished(true);
    }
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  const onAnswered = (q: Question, o: QuestionOutcome) => {
    recordAttempt({ questionId: q.id, conceptId: q.conceptId, kind: q.kind, correct: o.correct, hintsUsed: o.hintsUsed });
    award(o.correct ? (o.hintsUsed ? 'exerciseCorrectWithHints' : 'exerciseCorrect') : 'exerciseAttempted');
    const results = step.kind === 'quiz' ? [...quizResults, o.correct && o.hintsUsed === 0] : quizResults;
    setQuizResults(results);
    if (!o.correct && !isReview && !failed.includes(q)) setFailed([...failed, q]);
    if (qIdx + 1 < questions.length) setQIdx(qIdx + 1);
    else next(results);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  if (finished) {
    const quizScore = scoreOf(quizResults);
    const passed = quizScore >= threshold;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Resultado' }} />
        <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
          <View style={{ alignItems: 'center' }}>
            <PixelCat mood={passed ? 'celebrando' : 'pensativo'} size={130} />
          </View>
          <KText variant="title">{passed ? '¡Unidad superada!' : 'Casi: repasemos un poco más'}</KText>
          <KText>
            Evaluación: {Math.round(quizScore * 100)} % (necesitas {Math.round(threshold * 100)} % sin pistas).
          </KText>
          <Card>
            <KText style={{ fontWeight: '700' }}>Tu dominio por concepto</KText>
            {unit.concepts.map((c) => {
              const m = lookup(c.id);
              return (
                <View key={c.id} style={{ gap: spacing.xs }}>
                  <KText>
                    {c.name} · {STATUS_LABEL[m.status]}
                  </KText>
                  <ProgressBar value={m.pKnown} label={`Dominio de ${c.name}`} />
                </View>
              );
            })}
            <KText muted variant="caption">
              Para dominar un concepto hace falta acertar varias veces, en tipos de ejercicio distintos, y volver a
              acertarlo otro día. Te avisaremos cuando toque repasar.
            </KText>
          </Card>
          <Button label={passed ? 'Volver a la Academia' : 'Repetir la unidad'} onPress={() => (passed ? router.back() : router.replace({ pathname: '/leccion/[id]', params: { id: unit.id } }))} />
          {!passed && <Button label="Volver a la Academia" variant="ghost" onPress={() => router.back()} />}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: unit.title }} />
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}>
        <ProgressBar value={(stepIdx + (hasQuestions ? qIdx / questions.length : 0)) / unit.steps.length} label="Progreso de la lección" />
      </View>
      <ScrollView ref={scroll} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl * 2 }}>
        <Chip label={`Paso ${stepIdx + 1} de ${unit.steps.length}`} />
        <KText variant="title" accessibilityRole="header">
          {step.title}
        </KText>
        {step.body?.split('\n').map((line, i) => (
          <KText key={i} variant="bodyLg">
            {line}
          </KText>
        ))}
        {step.visualId && <LessonVisual id={step.visualId} />}
        {step.analogy && (
          <Card accent={colors.warning}>
            <KText variant="pixel" color={colors.warning}>
              METÁFORA
            </KText>
            <KText>{step.analogy.text}</KText>
            <KText muted variant="caption">
              Límite: {step.analogy.limits}
            </KText>
          </Card>
        )}
        {stepIdx === 0 && (
          <Card>
            <KText style={{ fontWeight: '700' }}>Objetivos</KText>
            {unit.objectives.map((o) => (
              <KText key={o}>• {o}</KText>
            ))}
          </Card>
        )}

        {hasQuestions ? (
          <Card>
            <KText muted variant="caption">
              Pregunta {qIdx + 1} de {questions.length}
              {isReview ? ' · repaso de errores' : ''}
            </KText>
            <QuestionView key={`${step.kind}-${questions[qIdx].id}`} question={questions[qIdx]} onDone={(o) => onAnswered(questions[qIdx], o)} />
          </Card>
        ) : (
          <>
            {isReview && <KText>¡No tuviste errores en esta lección! Nada que repasar.</KText>}
            <Button label={stepIdx + 1 < unit.steps.length ? 'Siguiente' : 'Terminar'} onPress={() => next()} testID="lesson-next" />
          </>
        )}
        <KText muted variant="caption">
          Fuente: {unit.sources.map((s) => `${s.institution}, ${s.title}${s.section ? ` (${s.section})` : ''}`).join(' · ')}
        </KText>
      </ScrollView>
    </SafeAreaView>
  );
}
