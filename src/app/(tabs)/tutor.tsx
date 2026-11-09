import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PixelCat } from '@/components/pet/PixelCat';
import { Chip, KText } from '@/components/ui';
import type { CatMood } from '@/core/pet/wellbeing';
import { getTutor } from '@/services/ai';
import { useSettings } from '@/state/settings';
import { useTutorChat } from '@/state/tutor';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const START = ['¿Qué es un mol?', 'Explícame el pH', 'El agua en modo chisme', 'Masa molar de C6H12O6'];

export default function Tutor() {
  const { colors, fontSize } = useTheme();
  const tutor = getTutor();
  const style = useSettings((s) => s.explanationStyle);
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
          <PixelCat mood={mood} size={56} accessoryIds={['bata-clasica']} />
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
                <KText color={mine ? colors.onPrimary : undefined}>{item.text}</KText>
              </View>
            );
          }}
        />

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
