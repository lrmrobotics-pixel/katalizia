/**
 * Laboratorio virtual: simulaciones calculadas con `core/chemistry` (no son animaciones decorativas).
 * Constantes: Ka(ácido acético) = 1,8 × 10⁻⁵ y Kb(amoníaco) = 1,8 × 10⁻⁵ a 25 °C (OpenStax Chemistry 2e, apéndices H e I).
 */
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

import { PhScale } from '@/components/lesson/Visuals';
import { Button, Card, KText, Screen } from '@/components/ui';
import { Stepper } from '@/components/ui/Stepper';
import { classifyPH, strongAcidPH, strongBasePH, weakAcidPH, weakBasePH } from '@/core/chemistry/acidBase';
import { massPercent, molarMass, normalizeFormula } from '@/core/chemistry/formula';
import { dilution } from '@/core/chemistry/stoichiometry';
import { formatScientific } from '@/core/chemistry/units';
import { useRewards } from '@/state/rewards';
import { useStudyTimer } from '@/state/useStudyTimer';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Tab = 'ph' | 'dilucion' | 'masa';

const SUBSTANCES = [
  { id: 'hcl', label: 'HCl (ácido fuerte)', ph: (c: number) => strongAcidPH(c) },
  { id: 'naoh', label: 'NaOH (base fuerte)', ph: (c: number) => strongBasePH(c) },
  { id: 'acetico', label: 'CH₃COOH (ácido débil, Ka 1,8·10⁻⁵)', ph: (c: number) => weakAcidPH(c, 1.8e-5) },
  { id: 'amoniaco', label: 'NH₃ (base débil, Kb 1,8·10⁻⁵)', ph: (c: number) => weakBasePH(c, 1.8e-5) },
] as const;

const fmt = (n: number, d = 2) => n.toFixed(d).replace('.', ',');

/** Registra un experimento (máx. 5 por visita, para que la XP refleje práctica real). */
function useExperimentCounter() {
  const award = useRewards((s) => s.award);
  const [count, setCount] = useState(0);
  return () => {
    if (count >= 5) return;
    award('labExperiment');
    setCount(count + 1);
  };
}

function Choice({ on, label, onPress }: { on: boolean; label: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: on }}
      style={{
        minHeight: MIN_TOUCH,
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
        borderWidth: 2,
        borderRadius: radius.md,
        borderColor: on ? colors.accent : colors.border,
        backgroundColor: on ? colors.surfaceAlt : 'transparent',
      }}>
      <KText>{label}</KText>
    </Pressable>
  );
}

function PhLab({ onExperiment }: { onExperiment: () => void }) {
  const [sub, setSub] = useState<(typeof SUBSTANCES)[number]['id']>('hcl');
  // Concentración como exponente: 10^exp mol/L, de 10⁻⁶ a 1 M.
  const [exp, setExp] = useState(-2);
  const [measured, setMeasured] = useState<number | null>(null);
  const c = 10 ** exp;
  const s = SUBSTANCES.find((x) => x.id === sub)!;
  return (
    <>
      <Card>
        <KText variant="title">Simulador de pH</KText>
        {SUBSTANCES.map((x) => (
          <Choice key={x.id} on={x.id === sub} label={x.label} onPress={() => { setSub(x.id); setMeasured(null); }} />
        ))}
        <Stepper
          label="Concentración (mol/L)"
          value={exp}
          display={formatScientific(c, 2)}
          min={-6}
          max={0}
          step={0.5}
          onChange={(v) => { setExp(v); setMeasured(null); }}
        />
        <Button
          label="Medir pH"
          onPress={() => {
            setMeasured(s.ph(c));
            onExperiment();
          }}
        />
      </Card>
      {measured !== null && (
        <Card>
          <KText variant="display" style={{ textAlign: 'center' }}>
            pH {fmt(measured)}
          </KText>
          <PhScale value={measured} />
          <KText>
            Disolución {classifyPH(measured)}. [H₃O⁺] = {formatScientific(10 ** -measured, 2)} mol/L.
          </KText>
          <KText muted variant="caption">
            Modelo: 25 °C, actividad ≈ concentración, incluye la autoionización del agua. Compara: a la misma
            concentración, un ácido débil da un pH más alto que uno fuerte porque se disocia poco.
          </KText>
        </Card>
      )}
    </>
  );
}

function Beaker({ fill, label }: { fill: number; label: string }) {
  const { colors } = useTheme();
  const h = 90 * Math.min(1, fill);
  return (
    <Svg width={110} height={130} viewBox="0 0 110 130" accessibilityLabel={label}>
      <Rect x={15} y={10} width={80} height={100} fill="none" stroke={colors.border} strokeWidth={3} />
      <Rect x={18} y={107 - h} width={74} height={h} fill={colors.accent} opacity={0.6} />
      <SvgText x={55} y={126} fill={colors.text} fontSize={11} textAnchor="middle">
        {label}
      </SvgText>
    </Svg>
  );
}

function DilutionLab({ onExperiment }: { onExperiment: () => void }) {
  const [c1, setC1] = useState(2);
  const [v1, setV1] = useState(50);
  const [v2, setV2] = useState(200);
  const [done, setDone] = useState(false);
  const valid = v2 >= v1;
  const c2 = valid ? dilution({ c1, v1, c2: null, v2 }) : null;
  return (
    <Card>
      <KText variant="title">Diluciones (C₁V₁ = C₂V₂)</KText>
      <Stepper label="C₁ (mol/L)" value={c1} display={fmt(c1, 1)} min={0.1} max={6} step={0.1} onChange={(v) => { setC1(v); setDone(false); }} />
      <Stepper label="V₁ tomado (mL)" value={v1} min={5} max={250} step={5} onChange={(v) => { setV1(v); setDone(false); }} />
      <Stepper label="V₂ final (mL)" value={v2} min={10} max={1000} step={10} onChange={(v) => { setV2(v); setDone(false); }} />
      {!valid && <KText>El volumen final debe ser mayor o igual que el que tomas.</KText>}
      <Button
        label="Diluir"
        disabled={!valid}
        onPress={() => {
          setDone(true);
          onExperiment();
        }}
      />
      {done && c2 !== null && (
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Beaker fill={v1 / 1000} label={`${v1} mL · ${fmt(c1, 1)} M`} />
            <Beaker fill={v2 / 1000} label={`${v2} mL · ${fmt(c2, 3)} M`} />
          </View>
          <KText>
            C₂ = {fmt(c1, 1)} × {v1} ÷ {v2} = {fmt(c2, 3)} mol/L. Los moles de soluto no cambian ({fmt((c1 * v1) / 1000, 3)} mol):
            solo hay más disolvente.
          </KText>
        </>
      )}
    </Card>
  );
}

function MolarMassLab({ onExperiment }: { onExperiment: () => void }) {
  const { colors, fontSize } = useTheme();
  const [input, setInput] = useState('C6H12O6');
  const [result, setResult] = useState<{ formula: string; mass: number; pct: Record<string, number> } | { error: string } | null>(null);
  const calc = () => {
    try {
      const formula = normalizeFormula(input);
      setResult({ formula, mass: molarMass(formula), pct: massPercent(formula) });
      onExperiment();
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : 'Fórmula no válida' });
    }
  };
  return (
    <Card>
      <KText variant="title">Calculadora de masa molar</KText>
      <KText muted>Escribe una fórmula: H2O, Ca(OH)2, CuSO4·5H2O…</KText>
      <TextInput
        value={input}
        onChangeText={setInput}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Fórmula química"
        onSubmitEditing={calc}
        style={{
          minHeight: MIN_TOUCH,
          borderWidth: 2,
          borderColor: colors.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          color: colors.text,
          fontSize: fontSize.bodyLg,
          backgroundColor: colors.surfaceAlt,
        }}
      />
      <Button label="Calcular" onPress={calc} />
      {result && 'error' in result && <KText color={colors.danger}>{result.error}</KText>}
      {result && 'mass' in result && (
        <>
          <KText variant="title">
            M = {fmt(result.mass, 3)} g/mol
          </KText>
          {Object.entries(result.pct).map(([el, p]) => (
            <KText key={el}>
              {el}: {fmt(p, 2)} % en masa
            </KText>
          ))}
          <KText muted variant="caption">Masas atómicas estándar IUPAC/CIAAW.</KText>
        </>
      )}
    </Card>
  );
}

export default function Laboratorio() {
  useStudyTimer();
  const [tab, setTab] = useState<Tab>('ph');
  const onExperiment = useExperimentCounter();
  return (
    <Screen>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {(
          [
            ['ph', 'pH'],
            ['dilucion', 'Diluciones'],
            ['masa', 'Masa molar'],
          ] as const
        ).map(([id, label]) => (
          <View key={id} style={{ flex: 1 }}>
            <Choice on={tab === id} label={label} onPress={() => setTab(id)} />
          </View>
        ))}
      </View>
      {tab === 'ph' && <PhLab onExperiment={onExperiment} />}
      {tab === 'dilucion' && <DilutionLab onExperiment={onExperiment} />}
      {tab === 'masa' && <MolarMassLab onExperiment={onExperiment} />}
    </Screen>
  );
}
