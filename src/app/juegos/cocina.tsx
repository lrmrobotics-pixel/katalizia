/** Chemistry Kitchen: prepara disoluciones reales (diluir un concentrado o pesar soluto). */
import { useState } from 'react';
import { View } from 'react-native';

import { GameHeader, GameOver, useGameSession } from '@/components/games/GameFrame';
import { Beaker } from '@/components/lab/ChemLabs';
import { Button, KText, Screen } from '@/components/ui';
import { Stage } from '@/components/ui/scene';
import { Stepper } from '@/components/ui/Stepper';
import { molarMass } from '@/core/chemistry/formula';
import { kitchenCorrect, makeKitchenRound, type KitchenRound } from '@/core/games/extra';
import { useStudyTimer } from '@/state/useStudyTimer';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const fmt = (n: number, d = 2) => n.toFixed(d).replace('.', ',');
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const pretty = (f: string) => f.replace(/\d/g, (d) => SUB[Number(d)]);
const TINT = '#22D3EE';

export default function ChemistryKitchen() {
  useStudyTimer();
  const { colors } = useTheme();
  const s = useGameSession('cocina', 6);
  const [r, setR] = useState<KitchenRound>(() => makeKitchenRound(Math.random));
  const [v1, setV1] = useState(50);
  const [v2, setV2] = useState(500);
  const [grams, setGrams] = useState(1);
  const [result, setResult] = useState<boolean | null>(null);
  const [tries, setTries] = useState(0);

  if (s.finished) return <GameOver s={s} gameId="cocina" />;

  const check = () => {
    const ok = r.type === 'dilucion' ? kitchenCorrect(r, v1, v2) : kitchenCorrect(r, grams);
    setResult(ok);
    setTries(tries + 1);
    if (ok || tries + 1 >= 3) s.answer(ok);
  };
  const finished = result === true || tries >= 3;
  const nextRound = () => {
    setR(makeKitchenRound(Math.random));
    setResult(null);
    setTries(0);
    s.next();
  };

  const c2 = v2 > 0 ? (r.type === 'dilucion' ? (r.stock * v1) / v2 : 0) : 0;

  return (
    <Screen>
      <GameHeader title="Chemistry Kitchen" s={s} tint={TINT} />
      {r.type === 'dilucion' ? (
        <Stage tint={TINT} glow="center">
          <KText variant="caption" color={TINT} style={{ fontWeight: '800' }}>
            PEDIDO: DILUCIÓN
          </KText>
          <KText variant="bodyLg">
            Tienes un concentrado {fmt(r.stock, 0)} M. Prepara una disolución {fmt(r.target, 3)} M (máx. 1 L).
          </KText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }}>
            <Beaker fill={v1 / 250} color="#3B6CF6" opacity={0.85} label={`Tomas ${v1} mL`} />
            <Beaker fill={v2 / 1000} color="#3B6CF6" opacity={0.15 + 0.7 * Math.min(1, c2 / 6)} label={`Final ${v2} mL`} />
          </View>
          <Stepper label="V₁ de concentrado (mL)" value={v1} min={5} max={250} step={5} onChange={(v) => { setV1(v); setResult(null); }} />
          <Stepper label="V₂ final (mL)" value={v2} min={50} max={1000} step={50} onChange={(v) => { setV2(v); setResult(null); }} />
        </Stage>
      ) : (
        <Stage tint={colors.warning} glow="center">
          <KText variant="caption" color={colors.warning} style={{ fontWeight: '800' }}>
            PEDIDO: PESAR SOLUTO
          </KText>
          <KText variant="bodyLg">
            Prepara {r.volumeMl} mL de {r.name} ({pretty(r.formula)}) {fmt(r.molarity, 2)} M. ¿Cuántos gramos pesas?
          </KText>
          <KText variant="caption" muted>
            Masa molar de {pretty(r.formula)}: {fmt(molarMass(r.formula), 2)} g/mol
          </KText>
          <Stepper label="Masa de soluto (g)" value={grams} display={`${fmt(grams, 1)} g`} min={0.1} max={100} step={0.1} onChange={(v) => { setGrams(v); setResult(null); }} />
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Button label="−10 g" variant="secondary" onPress={() => setGrams(Math.max(0.1, Math.round((grams - 10) * 10) / 10))} />
            </View>
            <View style={{ flex: 1 }}>
              <Button label="+10 g" variant="secondary" onPress={() => setGrams(Math.min(100, Math.round((grams + 10) * 10) / 10))} />
            </View>
          </View>
        </Stage>
      )}
      {!finished && <Button label="Preparar y comprobar" onPress={check} />}
      {result !== null && (
        <Stage glow="none">
          <KText style={{ fontWeight: '800' }} color={result ? colors.success : colors.warning}>
            {result ? '¡Pedido perfecto (±2 %)!' : finished ? 'Veamos la solución:' : `Aún no (intento ${tries} de 3).`}
          </KText>
          {r.type === 'dilucion' ? (
            <KText>
              {result || finished
                ? `C₂ = C₁·V₁/V₂. Una opción: ${fmt(r.stock, 0)} × V₁ / V₂ = ${fmt(r.target, 3)} → V₁/V₂ = ${fmt(r.target / r.stock, 4)}.`
                : `Tu mezcla queda en ${fmt(c2, 3)} M. ${c2 > r.target ? 'Demasiado concentrada: más disolvente o menos concentrado.' : 'Demasiado diluida: más concentrado o menos volumen final.'}`}
            </KText>
          ) : (
            <KText>
              {result || finished
                ? `m = M · V · masa molar = ${fmt(r.molarity, 2)} × ${fmt(r.volumeMl / 1000, 3)} L × ${fmt(molarMass(r.formula), 2)} = ${fmt(r.grams, 2)} g.`
                : `Pista: primero moles = M × V(L); luego gramos = moles × masa molar. ${grams > r.grams ? 'Te pasaste.' : 'Te falta.'}`}
            </KText>
          )}
          {finished && <Button label={s.round + 1 >= s.rounds ? 'Ver resultado' : 'Siguiente pedido'} onPress={nextRound} />}
        </Stage>
      )}
      <KText variant="caption" muted>
        Simulación de cálculo: en un laboratorio real se enrasa en matraz aforado y se usan medidas de seguridad. Fuente: OpenStax Chemistry 2e, 3.3.
      </KText>
    </Screen>
  );
}
