/**
 * Renderiza cualquier tipo de pregunta, gestiona pistas progresivas y devuelve el resultado.
 * Flujo: responder → comprobar → (si falla) ver error conceptual + explicación → continuar.
 */
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Button, Card, KText } from '@/components/ui';
import { grade, type Answer, type GradeResult } from '@/core/learning/grading';
import type { Question } from '@/core/learning/types';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface QuestionOutcome {
  correct: boolean;
  hintsUsed: number;
}

function Option({ label, selected, onPress, disabled, state }: {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  state?: 'right' | 'wrong';
}) {
  const { colors } = useTheme();
  const border = state === 'right' ? colors.success : state === 'wrong' ? colors.danger : selected ? colors.accent : colors.border;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      style={{
        minHeight: MIN_TOUCH,
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderWidth: 2,
        borderRadius: radius.md,
        borderColor: border,
        backgroundColor: selected ? colors.surfaceAlt : 'transparent',
      }}>
      <KText>{label}</KText>
    </Pressable>
  );
}

export function QuestionView({ question: q, onDone }: { question: Question; onDone: (o: QuestionOutcome) => void }) {
  const { colors, fontSize } = useTheme();
  const [selected, setSelected] = useState<string[]>([]);
  const [value, setValue] = useState('');
  const [order, setOrder] = useState<string[]>([]);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [hints, setHints] = useState(0);
  const [result, setResult] = useState<GradeResult | null>(null);

  const answer = (): Answer => {
    switch (q.type) {
      case 'single-choice':
      case 'multi-choice':
        return { type: q.type, selected };
      case 'numeric':
        return { type: 'numeric', value };
      case 'order':
        return { type: 'order', order };
      case 'match':
        return { type: 'match', pairs };
      default:
        return { type: 'short-text', text: value };
    }
  };

  const ready =
    q.type === 'single-choice' || q.type === 'multi-choice'
      ? selected.length > 0
      : q.type === 'order'
        ? order.length === q.items.length
        : q.type === 'match'
          ? Object.keys(pairs).length === q.left.length
          : value.trim().length > 0;

  const check = () => setResult(grade(q, answer()));

  const done = result !== null && !result.invalid;

  return (
    <View style={{ gap: spacing.md }}>
      <KText variant="bodyLg" style={{ fontWeight: '700' }}>
        {q.prompt}
      </KText>
      {q.type === 'multi-choice' && <KText muted variant="caption">Puede haber varias respuestas correctas.</KText>}

      {(q.type === 'single-choice' || q.type === 'multi-choice') &&
        q.options.map((o) => {
          const on = selected.includes(o.id);
          const state = done ? (q.correct.includes(o.id) ? 'right' : on ? 'wrong' : undefined) : undefined;
          return (
            <Option
              key={o.id}
              label={o.text}
              selected={on}
              disabled={done}
              state={state}
              onPress={() =>
                setSelected(q.type === 'single-choice' ? [o.id] : on ? selected.filter((x) => x !== o.id) : [...selected, o.id])
              }
            />
          );
        })}

      {q.type === 'numeric' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <TextInput
            value={value}
            onChangeText={setValue}
            editable={!done}
            keyboardType="decimal-pad"
            placeholder="Tu respuesta"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Respuesta numérica"
            style={{
              flex: 1,
              minHeight: MIN_TOUCH,
              borderWidth: 2,
              borderRadius: radius.md,
              borderColor: colors.border,
              paddingHorizontal: spacing.md,
              color: colors.text,
              fontSize: fontSize.bodyLg,
              backgroundColor: colors.surfaceAlt,
            }}
          />
          {q.unit && <KText variant="bodyLg">{q.unit}</KText>}
        </View>
      )}

      {q.type === 'order' && (
        <>
          <KText muted variant="caption">Toca en orden. Toca de nuevo para quitar.</KText>
          {q.items.map((it) => {
            const pos = order.indexOf(it.id);
            return (
              <Option
                key={it.id}
                label={(pos >= 0 ? `${pos + 1}. ` : '○ ') + it.text}
                selected={pos >= 0}
                disabled={done}
                onPress={() => setOrder(pos >= 0 ? order.filter((x) => x !== it.id) : [...order, it.id])}
              />
            );
          })}
        </>
      )}

      {q.type === 'match' && (
        <>
          <KText muted variant="caption">Toca un elemento de la izquierda y luego su pareja.</KText>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1, gap: spacing.sm }}>
              {q.left.map((l) => {
                const paired = pairs[l.id];
                const r = q.right.find((x) => x.id === paired);
                const state = done ? (q.pairs[l.id] === paired ? 'right' : 'wrong') : undefined;
                return (
                  <Option
                    key={l.id}
                    label={r ? `${l.text} → ${r.text}` : l.text}
                    selected={activeLeft === l.id}
                    disabled={done}
                    state={state}
                    onPress={() => setActiveLeft(l.id)}
                  />
                );
              })}
            </View>
            <View style={{ flex: 1, gap: spacing.sm }}>
              {q.right.map((r) => (
                <Option
                  key={r.id}
                  label={r.text}
                  selected={Object.values(pairs).includes(r.id)}
                  disabled={done || !activeLeft}
                  onPress={() => {
                    if (!activeLeft) return;
                    const next = Object.fromEntries(Object.entries(pairs).filter(([, v]) => v !== r.id));
                    next[activeLeft] = r.id;
                    setPairs(next);
                    setActiveLeft(null);
                  }}
                />
              ))}
            </View>
          </View>
        </>
      )}

      {q.type === 'short-text' && (
        <TextInput
          value={value}
          onChangeText={setValue}
          editable={!done}
          accessibilityLabel="Respuesta"
          style={{ minHeight: MIN_TOUCH, borderWidth: 2, borderRadius: radius.md, borderColor: colors.border, paddingHorizontal: spacing.md, color: colors.text }}
        />
      )}

      {hints > 0 && (
        <Card accent={colors.warning}>
          {q.hints.slice(0, hints).map((h, i) => (
            <KText key={i}>💡 {h}</KText>
          ))}
        </Card>
      )}

      {result?.invalid && <KText color={colors.danger}>No pude leer tu respuesta. Escribe un número (puedes usar coma o punto).</KText>}

      {done && (
        <Card accent={result.correct ? colors.success : colors.danger}>
          <KText variant="bodyLg" style={{ fontWeight: '800' }} color={result.correct ? colors.success : colors.danger}>
            {result.correct ? '¡Correcto!' : 'Todavía no, ¡pero así se aprende!'}
          </KText>
          {result.misconceptions.map((m) => (
            <KText key={m}>• {m}</KText>
          ))}
          <KText>{q.explanation}</KText>
        </Card>
      )}

      {!done ? (
        <View style={{ gap: spacing.sm }}>
          <Button label="Comprobar" onPress={check} disabled={!ready} testID="check" />
          {hints < q.hints.length && (
            <Button label={`Pedir pista (${hints + 1}/${q.hints.length})`} variant="ghost" onPress={() => setHints(hints + 1)} />
          )}
        </View>
      ) : (
        <Button label="Continuar" onPress={() => onDone({ correct: result.correct, hintsUsed: hints })} testID="continue" />
      )}
    </View>
  );
}
