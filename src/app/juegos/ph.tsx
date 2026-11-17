/** PH Master: estima el pH de disoluciones calculadas y lee indicadores ácido-base. */
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { GameHeader, GameOver, useGameSession } from '@/components/games/GameFrame';
import { Beaker } from '@/components/lab/ChemLabs';
import { PhScale } from '@/components/lesson/Visuals';
import { Button, KText, Screen } from '@/components/ui';
import { alpha, Stage } from '@/components/ui/scene';
import { formatScientific } from '@/core/chemistry/units';
import { indicatorSide, makePhRound, PH_BANDS, type PhRound } from '@/core/games/extra';
import { useStudyTimer } from '@/state/useStudyTimer';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const fmt = (n: number, d = 1) => n.toFixed(d).replace('.', ',');
const TINT = '#4ADE80';

function Option({ label, state, onPress }: { label: string; state: 'idle' | 'right' | 'wrong' | 'dim'; onPress: () => void }) {
  const { colors } = useTheme();
  const border = state === 'right' ? colors.success : state === 'wrong' ? colors.danger : 'transparent';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        flexGrow: 1,
        flexBasis: '30%',
        minHeight: MIN_TOUCH + 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        borderWidth: 2,
        borderColor: border,
        backgroundColor: alpha(colors.text, state === 'dim' ? 0.03 : 0.08),
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}>
      <KText style={{ fontWeight: '800' }}>{label}</KText>
    </Pressable>
  );
}

export default function PhMaster() {
  useStudyTimer();
  const { colors } = useTheme();
  const s = useGameSession('ph', 10);
  const [r, setR] = useState<PhRound>(() => makePhRound(Math.random));
  const [picked, setPicked] = useState<string | null>(null);

  if (s.finished) return <GameOver s={s} gameId="ph" />;

  const correctKey = r.type === 'band' ? String(r.answer) : indicatorSide(r);
  const choose = (key: string) => {
    if (picked) return;
    setPicked(key);
    s.answer(key === correctKey);
  };
  const state = (key: string) => (!picked ? 'idle' : key === correctKey ? 'right' : key === picked ? 'wrong' : 'dim');

  return (
    <Screen>
      <GameHeader title="PH Master" s={s} tint={TINT} />
      {r.type === 'band' ? (
        <Stage tint={TINT} glow="center">
          <KText muted>¿En qué intervalo está el pH?</KText>
          <KText variant="title" style={{ textAlign: 'center' }}>
            {r.solute.label} {formatScientific(10 ** r.exp, 1)} M
          </KText>
          <KText variant="caption" muted style={{ textAlign: 'center' }}>
            {r.solute.kind}
          </KText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {PH_BANDS.map((b) => (
              <Option key={b.id} label={b.label} state={state(String(b.id))} onPress={() => choose(String(b.id))} />
            ))}
          </View>
        </Stage>
      ) : (
        <Stage tint={r.color} glow="center">
          <KText muted>Añadiste {r.indicator.name} (vira entre {fmt(r.indicator.from)} y {fmt(r.indicator.to)}). ¿Qué dice el color?</KText>
          <View style={{ alignItems: 'center' }}>
            <Beaker fill={0.6} color={r.color} opacity={r.opacity} label="Muestra problema" />
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Option label={`pH < ${fmt(r.indicator.from)}`} state={state('debajo')} onPress={() => choose('debajo')} />
            <Option label={`pH > ${fmt(r.indicator.to)}`} state={state('encima')} onPress={() => choose('encima')} />
          </View>
        </Stage>
      )}
      {picked && (
        <Stage glow="none">
          <KText variant="title">pH {fmt(r.ph, 2)}</KText>
          <PhScale value={r.ph} />
          <KText>
            {r.type === 'band'
              ? r.solute.kind.includes('fuerte')
                ? 'Fuerte: se disocia por completo, así que [H₃O⁺] o [OH⁻] es igual a la concentración.'
                : 'Débil: se disocia poco, por eso el pH queda más cerca de 7 que el de uno fuerte de igual concentración.'
              : `El indicador muestra su color ${indicatorSide(r) === 'debajo' ? 'ácido' : 'básico'}: el pH está ${indicatorSide(r) === 'debajo' ? 'por debajo' : 'por encima'} de su viraje. Un solo indicador no da el pH exacto.`}
          </KText>
          <Button
            label={s.round + 1 >= s.rounds ? 'Ver resultado' : 'Siguiente'}
            onPress={() => {
              setPicked(null);
              setR(makePhRound(Math.random));
              s.next();
            }}
          />
        </Stage>
      )}
      <KText variant="caption" muted color={colors.textMuted}>
        pH calculado a 25 °C (Ka, Kb: OpenStax Chemistry 2e, apéndices H e I); intervalos de viraje: fig. 14.23. Colores aproximados.
      </KText>
    </Screen>
  );
}
