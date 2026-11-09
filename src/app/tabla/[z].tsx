import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { Button, Card, Chip, KText, Screen, StateView } from '@/components/ui';
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

  return (
    <Screen>
      <Stack.Screen options={{ title: el.name }} />
      <Card accent={color} style={{ alignItems: 'center' }}>
        <KText muted>{String(el.z)}</KText>
        <KText variant="pixel" color={color} style={{ fontSize: 40, lineHeight: 56 }}>
          {el.symbol}
        </KText>
        <KText variant="title">{el.name}</KText>
        <Chip label={CATEGORY_LABELS[el.category]} color={color} />
      </Card>

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
      <KText muted variant="caption">
        Fuentes: IUPAC/CIAAW (masas), NIST ASD (configuraciones), OpenStax Chemistry 2e. Usos cotidianos,
        importancia biológica y tendencias periódicas: Fase 6.
      </KText>
    </Screen>
  );
}
