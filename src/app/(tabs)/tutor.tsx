import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KataAvatar } from '@/components/pet/KataAvatar';
import { Chip, KText } from '@/components/ui';
import type { CatMood } from '@/core/pet/wellbeing';
import { router } from 'expo-router';

import { getTutor } from '@/services/ai';
import { labForText, type LabModule } from '@/services/ai/labLinks';
import { alpha } from '@/components/ui/scene';
import type { TutorMode } from '@/state/settings';
import { useSettings } from '@/state/settings';
import { useTutorChat } from '@/state/tutor';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const START = ['¿Qué es un mol?', 'Explícame el pH', 'El agua en modo chisme', 'Masa molar de C6H12O6'];

export default function Tutor() {
  const { colors, fontSize } = useTheme();
  const tutor = getTutor();
  const baseStyle = useSettings((s) => s.explanationStyle);
  const mode = useSettings((s) => s.tutorMode);
  const setSettings = useSettings((s) => s.set);
  // Chisme científico usa analogías; Profesor y Experimento usan el estilo elegido en Ajustes (sin chisme).
  const style = mode === 'chisme' ? 'chisme' : baseStyle === 'chisme' ? 'sencilla' : baseStyle;
  const [lab, setLab] = useState<{ module: LabModule; why: string } | null>(null);
  const { messages, add, clear } = useTutorChat();
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState(START);
  const [mood, setMood] = useState<CatMood>('feliz');
  const failures = useRef(0);
  const list = useRef<FlatList>(null);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setInput('');
    add({ role: 'student', text: t });
    failures.current = /no entiendo|sigo sin/i.test(t) ? failures.current + 1 : 0;
    setBusy(true);
    setMood('pensativo');
    setLab(mode === 'experimento' ? labForText(t) : null);
    try {
      const reply = await tutor.reply(useTutorChat.getState().messages, t, {
        style,
        weakConcepts: [],
        consecutiveFailures: failures.current,
      });
      reply.messages.forEach((m) => add(m));
      setSuggestions(reply.suggestions);
      setMood('explicando');
    } catch {
      add({ role: 'tutor', text: 'Algo falló al responder. Inténtalo de nuevo.' });
      setMood('confundido');
    } finally {
      setBusy(false);
      setTimeout(() => list.current?.scrollToEnd({ animated: true }), 50);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, paddingBottom: spacing.sm }}>
          <KataAvatar mood={mood} size={56} />
          <View style={{ flex: 1 }}>
            <KText variant="title">Kata</KText>
            <Chip label={tutor.isAI ? 'IA conectada' : 'Modo local · sin IA'} color={tutor.isAI ? colors.success : colors.warning} />
          </View>
          {messages.length > 0 && (
            <Pressable onPress={clear} accessibilityRole="button" accessibilityLabel="Borrar conversación" style={{ minHeight: MIN_TOUCH, justifyContent: 'center' }}>
              <KText muted>Borrar</KText>
            </Pressable>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }}>
          {(
            [
              ['profesor', 'Profesor'],
              ['experimento', 'Experimento'],
              ['chisme', 'Chisme científico'],
            ] as [TutorMode, string][]
          ).map(([id, label]) => (
            <Pressable
              key={id}
              onPress={() => setSettings({ tutorMode: id })}
              accessibilityRole="radio"
              accessibilityState={{ selected: mode === id }}
              style={{ flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 999, backgroundColor: mode === id ? colors.primary : alpha(colors.text, 0.08) }}>
              <KText variant="caption" color={mode === id ? colors.onPrimary : colors.text} style={{ fontWeight: '800', textAlign: 'center' }}>
                {label}
              </KText>
            </Pressable>
          ))}
        </View>

        <FlatList
          ref={list}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
          onContentSizeChange={() => list.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <KText muted>
              Pregúntame un concepto o pídeme un cálculo. En modo local respondo con explicaciones verificadas y
              ejercicios predefinidos; la IA conversacional llegará cuando se configure un servidor.
            </KText>
          }
          renderItem={({ item }) => {
            const mine = item.role === 'student';
            return (
              <View
                style={{
                  alignSelf: mine ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  padding: spacing.md,
                  borderRadius: radius.md,
                  borderWidth: 2,
                  borderColor: item.isAnalogy ? colors.warning : mine ? colors.primary : colors.border,
                  backgroundColor: mine ? colors.primary : colors.surface,
                }}>
                {item.isAnalogy && (
                  <KText variant="caption" color={colors.warning} style={{ fontWeight: '800' }}>
                    ANALOGÍA · no es literal
                  </KText>
                )}
                <KText color={mine ? colors.onPrimary : undefined}>{item.text}</KText>
              </View>
            );
          }}
        />

        {lab && (
          <Pressable
            onPress={() => router.push(`/laboratorio?modulo=${lab.module}`)}
            accessibilityRole="button"
            style={{ marginHorizontal: spacing.lg, marginBottom: spacing.sm, padding: spacing.md, borderRadius: 16, backgroundColor: alpha(colors.accent, 0.14), borderWidth: 1.5, borderColor: colors.accent }}>
            <KText variant="caption" color={colors.accent} style={{ fontWeight: '800' }}>
              EXPERIMENTA EN EL LABORATORIO
            </KText>
            <KText>{lab.why}</KText>
          </Pressable>
        )}

        <ScrollView horizontal keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.lg }} style={{ flexGrow: 0 }}>
          {suggestions.map((s) => (
            <Pressable
              key={s}
              onPress={() => send(s)}
              accessibilityRole="button"
              style={{ minHeight: 40, justifyContent: 'center', paddingHorizontal: spacing.md, borderWidth: 2, borderColor: colors.accent, borderRadius: radius.lg }}>
              <KText variant="caption">{s}</KText>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ flexDirection: 'row', gap: spacing.sm, padding: spacing.lg }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send(input)}
            placeholder="Escribe tu pregunta…"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Mensaje para Kata"
            returnKeyType="send"
            style={{
              flex: 1,
              minHeight: MIN_TOUCH,
              borderWidth: 2,
              borderColor: colors.border,
              borderRadius: radius.md,
              paddingHorizontal: spacing.md,
              color: colors.text,
              fontSize: fontSize.body,
              backgroundColor: colors.surface,
            }}
          />
          <Pressable
            onPress={() => send(input)}
            disabled={busy || !input.trim()}
            accessibilityRole="button"
            accessibilityLabel="Enviar"
            style={{
              width: MIN_TOUCH + 16,
              minHeight: MIN_TOUCH,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius.md,
              backgroundColor: colors.primary,
              opacity: busy || !input.trim() ? 0.5 : 1,
            }}>
            <KText color={colors.onPrimary} style={{ fontWeight: '800' }}>
              Enviar
            </KText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
