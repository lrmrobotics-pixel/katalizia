import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { KataAvatar } from '@/components/pet/KataAvatar';
import { Button, Card, KText, Screen } from '@/components/ui';
import type { CatMood } from '@/core/pet/wellbeing';
import { useProfile, type StudyGoal } from '@/state/profile';
import { useSettings } from '@/state/settings';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const GOALS: { id: StudyGoal; label: string }[] = [
  { id: 'medicina', label: 'Prepararme para Medicina' },
  { id: 'bases', label: 'Construir bases desde cero' },
  { id: 'examen', label: 'Aprobar un examen' },
  { id: 'curiosidad', label: 'Por curiosidad científica' },
];

const STEPS: { mood: CatMood; title: string; body: string }[] = [
  {
    mood: 'feliz',
    title: '¡Hola! Soy Kata.',
    body: 'Soy un gato científico y voy a acompañarte a aprender química paso a paso, desde lo más básico hasta la bioquímica que se usa en Medicina.',
  },
  {
    mood: 'explicando',
    title: 'Así aprenderemos',
    body: 'Lecciones cortas, ejercicios guiados y repasos en el momento justo. Solo avanzas cuando dominas un tema, nunca por haber pasado rápido.',
  },
  {
    mood: 'experimentando',
    title: 'Y también jugaremos',
    body: 'Laboratorio virtual, tabla periódica y minijuegos. Descansar nunca te quita progreso: aquí no hay castigos por tomarte un día libre.',
  },
];

export default function Onboarding() {
  const { colors, fontSize } = useTheme();
  const completeOnboarding = useProfile((s) => s.completeOnboarding);
  const setSettings = useSettings((s) => s.set);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goals, setGoals] = useState<StudyGoal[]>(['medicina']);
  const [weekly, setWeekly] = useState(4);

  const isSetup = step === STEPS.length;
  const current = STEPS[step];

  const finish = () => {
    setSettings({ weeklyGoalDays: weekly });
    completeOnboarding({ displayName: name || 'Científica', goals });
    router.replace('/');
  };

  const toggle = (g: StudyGoal) => setGoals((gs) => (gs.includes(g) ? gs.filter((x) => x !== g) : [...gs, g]));

  return (
    <Screen>
      <View style={{ alignItems: 'center', paddingTop: spacing.xl }}>
        <KataAvatar mood={isSetup ? 'pensativo' : current.mood} size={150} />
      </View>

      {!isSetup ? (
        <Card>
          <KText variant="title" accessibilityRole="header">
            {current.title}
          </KText>
          <KText variant="bodyLg">{current.body}</KText>
        </Card>
      ) : (
        <>
          <Card>
            <KText variant="title" accessibilityRole="header">
              ¿Cómo te llamo?
            </KText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre o apodo"
              placeholderTextColor={colors.textMuted}
              maxLength={24}
              accessibilityLabel="Nombre o apodo"
              style={{
                minHeight: MIN_TOUCH,
                borderWidth: 2,
                borderColor: colors.border,
                borderRadius: radius.md,
                paddingHorizontal: spacing.md,
                color: colors.text,
                fontSize: fontSize.body,
                backgroundColor: colors.surfaceAlt,
              }}
            />
            <KText muted variant="caption">
              Se guarda solo en este dispositivo.
            </KText>
          </Card>

          <Card>
            <KText variant="title" accessibilityRole="header">
              ¿Qué quieres lograr?
            </KText>
            {GOALS.map((g) => {
              const on = goals.includes(g.id);
              return (
                <Pressable
                  key={g.id}
                  onPress={() => toggle(g.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  style={{
                    minHeight: MIN_TOUCH,
                    justifyContent: 'center',
                    paddingHorizontal: spacing.md,
                    borderWidth: 2,
                    borderRadius: radius.md,
                    borderColor: on ? colors.accent : colors.border,
                    backgroundColor: on ? colors.surfaceAlt : 'transparent',
                  }}>
                  <KText>{(on ? '■ ' : '□ ') + g.label}</KText>
                </Pressable>
              );
            })}
          </Card>

          <Card>
            <KText variant="title" accessibilityRole="header">
              Tu ritmo semanal
            </KText>
            <KText muted>¿Cuántos días por semana quieres estudiar? Puedes cambiarlo cuando quieras.</KText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setWeekly(d)}
                  accessibilityRole="radio"
                  accessibilityLabel={`${d} días`}
                  accessibilityState={{ selected: weekly === d }}
                  style={{
                    width: MIN_TOUCH,
                    height: MIN_TOUCH,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderRadius: radius.md,
                    borderColor: weekly === d ? colors.accent : colors.border,
                    backgroundColor: weekly === d ? colors.primary : 'transparent',
                  }}>
                  <KText color={weekly === d ? colors.onPrimary : undefined}>{String(d)}</KText>
                </Pressable>
              ))}
            </View>
          </Card>
        </>
      )}

      <View style={{ gap: spacing.sm }}>
        {isSetup ? (
          <Button label="Empezar mi aventura" onPress={finish} disabled={goals.length === 0} testID="onboarding-finish" />
        ) : (
          <Button label="Siguiente" onPress={() => setStep(step + 1)} testID="onboarding-next" />
        )}
        {step > 0 && <Button label="Atrás" variant="ghost" onPress={() => setStep(step - 1)} />}
      </View>
      <KText muted variant="caption" style={{ textAlign: 'center' }}>
        Después podrás hacer un diagnóstico corto (opcional) para ajustar tu ruta.
      </KText>
    </Screen>
  );
}
