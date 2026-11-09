import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ACCESSORIES } from '@/components/pet/catSprite';
import { PixelCat } from '@/components/pet/PixelCat';
import { Button, Card, Chip, KText, ProgressBar, Screen } from '@/components/ui';
import { levelFromXp } from '@/core/gamification/progress';
import type { CatMood } from '@/core/pet/wellbeing';
import { useLearning } from '@/state/learning';
import { usePet } from '@/state/pet';
import { useRewards } from '@/state/rewards';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const CURIOSIDADES = [
  'El cuerpo humano adulto contiene alrededor de un 60 % de agua en masa.',
  'El oro es tan maleable que puede laminarse en hojas de menos de una micra de grosor.',
  'El helio es el único elemento que no solidifica a presión atmosférica, ni siquiera cerca del cero absoluto.',
  'La hemoglobina transporta el oxígeno gracias a un átomo de hierro en cada grupo hemo.',
  'El pH de la sangre arterial se mantiene entre 7.35 y 7.45 gracias, sobre todo, al amortiguador bicarbonato.',
];

export default function Yo() {
  const { colors } = useTheme();
  const pet = usePet();
  const rewards = useRewards();
  const attempts = useLearning((s) => s.attempts);
  const [mood, setMood] = useState<CatMood>('feliz');
  const [fact, setFact] = useState<string | null>(null);
  const lvl = levelFromXp(rewards.xp);

  useEffect(() => {
    pet.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const react = (m: CatMood) => {
    setMood(m);
    setTimeout(() => setMood('feliz'), 1500);
  };

  const correct = attempts.filter((a) => a.correct).length;

  return (
    <Screen>
      <Card>
        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <PixelCat mood={mood} size={160} accessoryIds={Object.values(rewards.equipped)} />
          <KText variant="pixel" color={colors.accent}>
            {pet.name.toUpperCase()}
          </KText>
        </View>
        <KText variant="caption" muted>
          Energía
        </KText>
        <ProgressBar value={pet.energy / 100} color={colors.success} label="Energía del gato" />
        <KText variant="caption" muted>
          Alegría
        </KText>
        <ProgressBar value={pet.joy / 100} color={colors.warning} label="Alegría del gato" />
        <KText variant="caption" muted>
          El bienestar de {pet.name} nunca afecta a tu progreso.
        </KText>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Button label="Alimentar" variant="secondary" onPress={() => { pet.feed(); react('celebrando'); }} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Jugar" variant="secondary" onPress={() => { pet.play(); react('sorprendido'); }} />
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
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <KText variant="bodyLg" style={{ fontWeight: '700' }}>
            Vestuario
          </KText>
          <Chip label={`${rewards.coins} monedas`} color={colors.warning} />
        </View>
        {ACCESSORIES.map((a) => {
          const owned = rewards.inventory.includes(a.id);
          const on = rewards.equipped[a.slot] === a.id;
          return (
            <View key={a.id} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <KText style={{ flex: 1 }}>
                {a.name} {owned ? '' : `· ${a.price}`}
              </KText>
              {owned ? (
                <Button
                  label={on ? 'Quitar' : 'Poner'}
                  variant={on ? 'ghost' : 'secondary'}
                  onPress={() => rewards.equip(a.slot, on ? null : a.id)}
                />
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
        <KText muted variant="caption">
          Las monedas se ganan estudiando: 1 moneda por cada 5 XP.
        </KText>
      </Card>

      <Card>
        <KText variant="bodyLg" style={{ fontWeight: '700' }}>
          Mi progreso
        </KText>
        <KText>Nivel {lvl.level} · {rewards.xp} XP</KText>
        <KText>Ejercicios respondidos: {attempts.length} ({correct} correctos)</KText>
        <KText>Insignias: {rewards.badges.length}</KText>
        <KText muted variant="caption">
          Estadísticas de dominio y retención detalladas: Fase 3.
        </KText>
      </Card>

      <Button label="Ajustes" variant="ghost" onPress={() => router.push('/ajustes')} />
    </Screen>
  );
}
