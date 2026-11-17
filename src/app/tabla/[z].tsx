import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { AtomView } from '@/components/lab/AtomBuilder';
import { Button, Card, Chip, KText, Screen, StateView } from '@/components/ui';
import { Stage } from '@/components/ui/scene';
import { shellsFor } from '@/core/lab';
import { fullConfiguration, shorthandConfiguration, valenceElectronsForGroup } from '@/core/chemistry/electronConfig';
import { CATEGORY_LABELS, getElementByZ, PHASE_LABELS } from '@/data/elements';
import { useRewards } from '@/state/rewards';
import { CATEGORY_COLORS, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
      <KText muted>{label}</KText>
      <KText style={{ flexShrink: 1, textAlign: 'right', fontWeight: '600' }}>{value}</KText>
    </View>
  );
}

export default function ElementDetail() {
  const { z } = useLocalSearchParams<{ z: string }>();
  const { colors } = useTheme();
  const el = getElementByZ(Number(z));
  const discover = useRewards((s) => s.discover);
  const favorites = useRewards((s) => s.favorites);
  const toggleFavorite = useRewards((s) => s.toggleFavorite);

  useEffect(() => {
    if (el) discover(el.z);
  }, [el, discover]);

  if (!el) {
    return (
      <Screen>
        <StateView state="error" message="Elemento no encontrado." />
      </Screen>
    );
  }

  const color = CATEGORY_COLORS[el.category];
  const valence = valenceElectronsForGroup(el.z, el.group);
  const fav = favorites.includes(el.z);
  const neutrons = Math.max(0, Math.round(el.mass) - el.z);

  return (
    <Screen>
      <Stack.Screen options={{ title: el.name }} />
      <Stage tint={color} glow="center" particles={12}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <KText muted>{String(el.z)}</KText>
            <KText variant="pixel" color={color} style={{ fontSize: 40, lineHeight: 56 }}>
              {el.symbol}
            </KText>
            <KText variant="title" style={{ textAlign: 'center' }}>
              {el.name}
            </KText>
            <Chip label={CATEGORY_LABELS[el.category]} color={color} />
          </View>
          <AtomView protons={el.z} neutrons={neutrons} shells={shellsFor(el.z)} size={170} />
        </View>
        <KText variant="caption" muted>
          Capas: {shellsFor(el.z).join(' · ')}. Núcleo con {el.z} protones y ≈ {neutrons} neutrones (A ≈ masa atómica redondeada;
          cada isótopo tiene su propio número de neutrones). Modelo de capas simplificado.
        </KText>
      </Stage>

      <Card>
        <Row label="Número atómico (Z)" value={String(el.z)} />
        <Row
          label={el.massIsMassNumber ? 'Número másico (isótopo más estable)' : 'Masa atómica'}
          value={el.massIsMassNumber ? `[${el.mass}]` : `${el.mass} u`}
        />
        <Row label="Grupo" value={el.group === null ? 'Bloque f' : String(el.group)} />
        <Row label="Período" value={String(el.period)} />
        <Row label="Estado a 25 °C" value={PHASE_LABELS[el.phase]} />
        {valence !== null && <Row label="Electrones de valencia" value={String(valence)} />}
      </Card>

      <Card>
        <KText variant="bodyLg" style={{ fontWeight: '700' }}>
          Configuración electrónica
        </KText>
        <KText style={{ fontFamily: 'monospace' }}>{shorthandConfiguration(el.z)}</KText>
        <KText muted variant="caption" style={{ fontFamily: 'monospace' }}>
          {fullConfiguration(el.z)}
        </KText>
      </Card>

      {el.predicted && (
        <Card accent={colors.warning}>
          <KText>
            Elemento superpesado: solo se han producido unos pocos átomos. Su categoría y configuración son
            predicciones teóricas.
          </KText>
        </Card>
      )}

      <Button
        label={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        variant={fav ? 'ghost' : 'secondary'}
        onPress={() => toggleFavorite(el.z)}
      />
      <Button label="Reto: Periodic Rush" variant="secondary" onPress={() => router.push('/juegos/rush')} />
      {el.z <= 36 && (
        <Button label="Constrúyelo en el laboratorio" variant="secondary" onPress={() => router.push('/laboratorio?modulo=atomos')} />
      )}
      <KText muted variant="caption">
        Fuentes: IUPAC/CIAAW (masas), NIST ASD (configuraciones), OpenStax Chemistry 2e.
      </KText>
    </Screen>
  );
}
