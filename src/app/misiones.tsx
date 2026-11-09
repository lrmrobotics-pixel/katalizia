import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, KText, ProgressBar, Screen } from '@/components/ui';
import { BADGES, type MissionStatus } from '@/core/gamification/missions';
import { XP_REWARDS } from '@/core/gamification/progress';
import { useRewards } from '@/state/rewards';
import { useEarnedBadges, useMissions } from '@/state/useGamification';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function MissionRow({ m, onClaim }: { m: MissionStatus; onClaim: () => void }) {
  return (
    <View style={{ gap: spacing.xs }}>
      <KText style={{ fontWeight: '700' }}>{m.def.title}</KText>
      <ProgressBar value={m.progress / m.target} label={`${m.def.title}: ${m.progress} de ${m.target}`} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <KText muted variant="caption">
          {m.progress} / {m.target}
        </KText>
        {m.claimed ? (
          <KText variant="caption">✔ Reclamada</KText>
        ) : m.done ? (
          <Button label={`Reclamar +${XP_REWARDS.missionCompleted} XP`} onPress={onClaim} />
        ) : null}
      </View>
    </View>
  );
}

export default function Misiones() {
  const { colors } = useTheme();
  const [now] = useState(() => Date.now());
  const { daily, weekly } = useMissions(now);
  const claim = useRewards((s) => s.claimMission);
  const earned = useEarnedBadges();

  return (
    <Screen>
      <KText muted>Las misiones son opcionales: si un día no las haces, simplemente cambian. Nunca pierdes nada.</KText>
      <Card>
        <KText variant="title">Hoy</KText>
        {daily.map((m) => (
          <MissionRow key={m.key} m={m} onClaim={() => claim(m.key)} />
        ))}
      </Card>
      <Card>
        <KText variant="title">Esta semana</KText>
        {weekly.map((m) => (
          <MissionRow key={m.key} m={m} onClaim={() => claim(m.key)} />
        ))}
      </Card>
      <Card>
        <KText variant="title">
          Insignias ({earned.length}/{BADGES.length})
        </KText>
        {BADGES.map((b) => {
          const got = earned.includes(b.id);
          return (
            <View
              key={b.id}
              accessible
              accessibilityLabel={`${b.title}: ${got ? 'conseguida' : 'pendiente'}. ${b.description}`}
              style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center', opacity: got ? 1 : 0.55 }}>
              <KText variant="title" color={got ? colors.warning : colors.textMuted}>
                {got ? '★' : '☆'}
              </KText>
              <View style={{ flex: 1 }}>
                <KText style={{ fontWeight: '700' }}>{b.title}</KText>
                <KText muted variant="caption">
                  {b.description}
                </KText>
              </View>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}
