import { router, type Href } from 'expo-router';

import { Button, Card, KText, Screen } from '@/components/ui';
import { useRewards } from '@/state/rewards';

const GAMES: { id: string; href: Href; title: string; body: string }[] = [
  { id: 'rush', href: '/juegos/rush', title: 'Periodic Rush', body: '60 segundos: empareja nombres y símbolos de elementos.' },
  { id: 'molecula', href: '/juegos/molecula', title: 'Molecular Lab', body: 'Construye moléculas átomo a átomo a partir de su nombre.' },
  { id: 'balanceo', href: '/juegos/balanceo', title: 'Balance Express', body: 'Ajusta coeficientes hasta que la ecuación quede balanceada.' },
];

export default function Explorar() {
  const best = useRewards((s) => s.bestScores);
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
      <Card>
        <KText variant="bodyLg" style={{ fontWeight: '700' }}>
          Laboratorio virtual
        </KText>
        <KText muted>Simula el pH, prepara diluciones y calcula masas molares con el motor químico de la app.</KText>
        <Button label="Entrar al laboratorio" onPress={() => router.push('/laboratorio')} />
      </Card>
      <KText variant="title" accessibilityRole="header">
        Minijuegos
      </KText>
      {GAMES.map((g) => (
        <Card key={g.id}>
          <KText variant="bodyLg" style={{ fontWeight: '700' }}>
            {g.title}
          </KText>
          <KText muted>{g.body}</KText>
          {best[g.id] ? <KText variant="caption">Tu récord: {best[g.id]} puntos</KText> : null}
          <Button label="Jugar" variant="secondary" onPress={() => router.push(g.href)} />
        </Card>
      ))}
    </Screen>
  );
}
