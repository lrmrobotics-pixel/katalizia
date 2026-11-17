import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { ACCESSORIES, type AccessorySlot } from '@/components/pet/catSprite';
import { KataAvatar, kataNow } from '@/components/pet/KataAvatar';
import { Button, KText, Screen } from '@/components/ui';
import { alpha, GlowBar, SectionHeader, Stage, StatPill } from '@/components/ui/scene';
import { SciIcon } from '@/components/ui/SciIcon';
import { levelFromXp } from '@/core/gamification/progress';
import { KATA_STYLES, TRICKS, type KataTrick } from '@/core/pet/animation';
import type { CatMood } from '@/core/pet/wellbeing';
import { useLearning } from '@/state/learning';
import { usePet } from '@/state/pet';
import { useRewards } from '@/state/rewards';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const CURIOSIDADES = [
  'El cuerpo humano adulto contiene alrededor de un 60 % de agua en masa.',
  'El oro es tan maleable que puede laminarse en hojas de menos de una micra de grosor.',
  'El helio es el único elemento que no solidifica a presión atmosférica, ni siquiera cerca del cero absoluto.',
  'La hemoglobina transporta el oxígeno gracias a un átomo de hierro en cada grupo hemo.',
  'El pH de la sangre arterial se mantiene entre 7.35 y 7.45 gracias, sobre todo, al amortiguador bicarbonato.',
];

const SLOT_LABEL: Record<AccessorySlot, string> = {
  body: 'Batas',
  eyes: 'Gafas',
  head: 'Sombreros',
  hand: 'Elementos científicos',
  back: 'Espalda',
};
const SLOT_ORDER: AccessorySlot[] = ['body', 'eyes', 'head', 'hand', 'back'];

/** Expresiones para probar; las últimas se desbloquean con el nivel. */
const EXPRESSIONS: { mood: CatMood; label: string; level: number }[] = [
  { mood: 'feliz', label: 'Feliz', level: 1 },
  { mood: 'curioso', label: 'Curioso', level: 1 },
  { mood: 'pensativo', label: 'Pensando', level: 1 },
  { mood: 'explicando', label: 'Explicando', level: 1 },
  { mood: 'sorprendido', label: 'Sorprendido', level: 2 },
  { mood: 'concentrado', label: 'Concentrado', level: 3 },
  { mood: 'confundido', label: 'Confundido', level: 3 },
  { mood: 'experimentando', label: 'Experimentando', level: 5 },
  { mood: 'celebrando', label: 'Celebrando', level: 5 },
];

function Pill({ label, on, locked, onPress, hint }: { label: string; on?: boolean; locked?: boolean; onPress: () => void; hint?: string }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      accessibilityRole="button"
      accessibilityLabel={locked && hint ? `${label}, ${hint}` : label}
      accessibilityState={{ selected: !!on, disabled: !!locked }}
      style={({ pressed }) => ({
        minHeight: MIN_TOUCH - 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: spacing.md,
        borderRadius: 999,
        backgroundColor: on ? colors.primary : alpha(colors.text, 0.08),
        opacity: locked ? 0.45 : 1,
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}>
      {locked && <SciIcon name="lock" color={colors.textMuted} size={14} />}
      <KText variant="caption" color={on ? colors.onPrimary : colors.text} style={{ fontWeight: '700' }}>
        {locked && hint ? `${label} · ${hint}` : label}
      </KText>
    </Pressable>
  );
}

export default function Yo() {
  const { colors } = useTheme();
  const pet = usePet();
  const rewards = useRewards();
  const attempts = useLearning((s) => s.attempts);
  const [mood, setMood] = useState<CatMood>('feliz');
  const [fact, setFact] = useState<string | null>(null);
  const [trick, setTrick] = useState<{ id: KataTrick; startedAt: number } | null>(null);
  const lvl = levelFromXp(rewards.xp);

  useEffect(() => {
    pet.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const react = (m: CatMood) => {
    setMood(m);
    setTimeout(() => setMood('feliz'), 1800);
  };

  const correct = attempts.filter((a) => a.correct).length;

  return (
    <Screen>
      {/* Escenario de Kata */}
      <Stage particles={24} glow="center" tint={colors.accent}>
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <KataAvatar mood={mood} size={170} trick={trick} interactive />
          <KText variant="pixel" color={colors.accent}>
            {pet.name.toUpperCase()}
          </KText>
          {pet.style === 'tres-d' && (
            <KText variant="caption" muted>
              Arrastra a {pet.name} para girarlo.
            </KText>
          )}
        </View>
        <SectionHeader title="Trucos" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {TRICKS.map((t) => (
            <Pill
              key={t.id}
              label={t.name}
              locked={lvl.level < t.level}
              hint={`nivel ${t.level}`}
              onPress={() => setTrick({ id: t.id, startedAt: kataNow() })}
            />
          ))}
        </View>
        <SectionHeader title="Expresiones" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {EXPRESSIONS.map((e) => (
            <Pill key={e.mood} label={e.label} on={mood === e.mood} locked={lvl.level < e.level} hint={`nivel ${e.level}`} onPress={() => setMood(e.mood)} />
          ))}
        </View>
      </Stage>

      {/* Selector de estilo */}
      <SectionHeader title="Estilo de Kata" />
      <KText muted variant="caption">
        Mismo Kata, mismo progreso, mismos accesorios: solo cambia cómo se dibuja.
      </KText>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {KATA_STYLES.map((s) => {
          const on = pet.style === s.id;
          return (
            <Pressable
              key={s.id}
              onPress={() => pet.setStyle(s.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`Estilo ${s.name}. ${s.detail}`}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: 'center',
                gap: 4,
                paddingVertical: spacing.sm,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: on ? colors.accent : 'transparent',
                backgroundColor: on ? alpha(colors.accent, 0.12) : alpha(colors.text, 0.05),
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}>
              <KataAvatar styleOverride={s.id} size={78} mood={on ? 'feliz' : 'curioso'} />
              <KText variant="caption" style={{ fontWeight: '800' }}>
                {s.name}
              </KText>
            </Pressable>
          );
        })}
      </View>
      <KText variant="caption" muted>
        {KATA_STYLES.find((s) => s.id === pet.style)?.detail}
      </KText>

      {/* Bienestar sin culpa */}
      <Stage glow="none">
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1, gap: 4 }}>
            <KText variant="caption" muted>
              Energía
            </KText>
            <GlowBar value={pet.energy / 100} color={colors.success} label="Energía de Kata" />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <KText variant="caption" muted>
              Alegría
            </KText>
            <GlowBar value={pet.joy / 100} color={colors.warning} label="Alegría de Kata" />
          </View>
        </View>
        <KText variant="caption" muted>
          El bienestar de {pet.name} nunca afecta a tu progreso, y no se pone triste si descansas.
        </KText>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Button label="Alimentar" variant="secondary" onPress={() => { pet.feed(); react('celebrando'); }} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Jugar" variant="secondary" onPress={() => { pet.play(); setTrick({ id: 'saltar', startedAt: kataNow() }); react('sorprendido'); }} />
          </View>
        </View>
        <Button
          label="Cuéntame una curiosidad"
          variant="ghost"
          onPress={() => {
            setFact(CURIOSIDADES[Math.floor(Math.random() * CURIOSIDADES.length)]);
            react('explicando');
          }}
        />
        {fact && <KText>{fact}</KText>}
      </Stage>

      {/* Vestuario */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionHeader title="Vestuario" />
        <StatPill icon="coin" value={String(rewards.coins)} color={colors.warning} label={`${rewards.coins} monedas`} />
      </View>
      {SLOT_ORDER.map((slot) => (
        <View key={slot} style={{ gap: spacing.sm }}>
          <KText variant="caption" muted style={{ fontWeight: '700' }}>
            {SLOT_LABEL[slot]}
          </KText>
          {ACCESSORIES.filter((a) => a.slot === slot).map((a) => {
            const owned = rewards.inventory.includes(a.id);
            const on = rewards.equipped[a.slot] === a.id;
            return (
              <View key={a.id} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <KataAvatar size={40} mood="feliz" animated={false} accessoryIds={[...Object.values(rewards.equipped).filter((id) => ACCESSORIES.find((x) => x.id === id)?.slot !== slot), a.id]} />
                <KText style={{ flex: 1 }}>
                  {a.name}
                  {owned ? '' : ` · ${a.price} monedas`}
                </KText>
                {owned ? (
                  <Button label={on ? 'Quitar' : 'Poner'} variant={on ? 'ghost' : 'secondary'} onPress={() => { rewards.equip(a.slot, on ? null : a.id); if (!on) react('celebrando'); }} />
                ) : (
                  <Button
                    label={a.price === 0 ? 'Obtener' : 'Comprar'}
                    variant="secondary"
                    disabled={rewards.coins < a.price}
                    onPress={() => rewards.buy(a.id, a.price) && react('celebrando')}
                  />
                )}
              </View>
            );
          })}
        </View>
      ))}
      <KText muted variant="caption">
        Las monedas se ganan estudiando: 1 moneda por cada 5 XP. Los accesorios se ven en los tres estilos.
      </KText>

      {/* Progreso */}
      <Stage glow="none">
        <KText variant="bodyLg" style={{ fontWeight: '800' }}>
          Mi progreso
        </KText>
        <KText>
          Nivel {lvl.level} · {rewards.xp} XP
        </KText>
        <KText>
          Ejercicios respondidos: {attempts.length} ({correct} correctos)
        </KText>
        <KText>Insignias: {rewards.badges.length}</KText>
        <Button label="Estadísticas y dominio por tema" variant="secondary" onPress={() => router.push('/estadisticas')} />
        <Button label="Misiones e insignias" variant="secondary" onPress={() => router.push('/misiones')} />
      </Stage>
      <Button label="Ajustes" variant="ghost" onPress={() => router.push('/ajustes')} />
    </Screen>
  );
}
