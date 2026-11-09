import { router } from 'expo-router';

import { Button, Card, ComingSoon, KText, Screen } from '@/components/ui';

export default function Explorar() {
  return (
    <Screen>
      <KText variant="display" accessibilityRole="header">
        Explorar
      </KText>
      <Card>
        <KText variant="bodyLg" style={{ fontWeight: '700' }}>
          Tabla periódica
        </KText>
        <KText muted>Los 118 elementos: busca por nombre, símbolo o número atómico.</KText>
        <Button label="Abrir tabla" onPress={() => router.push('/tabla')} />
      </Card>
      <ComingSoon phase={6} what="Laboratorio virtual: átomos, moléculas, disoluciones y escala de pH." />
      <ComingSoon phase={6} what="Minijuegos: Molecular Lab, Periodic Rush, Reaction Master y más." />
    </Screen>
  );
}
