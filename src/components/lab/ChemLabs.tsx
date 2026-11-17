/**
 * Módulos de laboratorio calculados con `core/chemistry` y `core/lab` (no son animaciones decorativas).
 * Constantes: Ka(ácido acético) = 1,8 × 10⁻⁵ y Kb(amoníaco) = 1,8 × 10⁻⁵ a 25 °C (OpenStax Chemistry 2e, apéndices H e I).
 */
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { PhScale } from '@/components/lesson/Visuals';
import { useKataClock } from '@/components/pet/useKataClock';
import { Button, KText } from '@/components/ui';
import { alpha, GlowBar, Stage, StatPill } from '@/components/ui/scene';
import { Stepper } from '@/components/ui/Stepper';
import { classifyPH, strongAcidPH, strongBasePH, weakAcidPH, weakBasePH } from '@/core/chemistry/acidBase';
import { parseEquation } from '@/core/chemistry/balance';
import { massPercent, molarMass, normalizeFormula, parseFormula } from '@/core/chemistry/formula';
import { dilution } from '@/core/chemistry/stoichiometry';
import { formatScientific } from '@/core/chemistry/units';
import { checkCoefficients, EQUATIONS, MAX_COEFFICIENT } from '@/core/games';
import { indicatorColor, INDICATORS, R, rateRatio, relativeSpeed } from '@/core/lab';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const fmt = (n: number, d = 2) => n.toFixed(d).replace('.', ',');
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const pretty = (f: string) => f.replace(/\d/g, (d) => SUB[Number(d)]);

export function Choice({ on, label, onPress }: { on: boolean; label: string; onPress: () => void }) {
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
        borderRadius: 14,
        borderWidth: 2,
        borderColor: on ? colors.accent : 'transparent',
        backgroundColor: on ? alpha(colors.accent, 0.14) : alpha(colors.text, 0.06),
      }}>
      <KText>{label}</KText>
    </Pressable>
  );
}

function SimNote({ children }: { children: string }) {
  return (
    <KText variant="caption" muted>
      Simulación: {children}
    </KText>
  );
}

/** Vaso de precipitados con líquido de color y burbujas suaves. */
export function Beaker({ fill, color, opacity = 0.75, label, width = 120 }: { fill: number; color: string; opacity?: number; label?: string; width?: number }) {
  const { colors } = useTheme();
  const h = 96 * Math.max(0.04, Math.min(1, fill));
  const s = width / 120;
  return (
    <Svg width={width} height={140 * s} viewBox="0 0 120 140" accessibilityLabel={label}>
      <Path d={`M22 ${118 - h} L98 ${118 - h} L98 114 Q98 122 90 122 L30 122 Q22 122 22 114 Z`} fill={color} fillOpacity={opacity} />
      <Path d="M16 16 L22 22 L22 114 Q22 122 30 122 L90 122 Q98 122 98 114 L98 22 L104 16" stroke={colors.text} strokeOpacity={0.6} strokeWidth={3} fill="none" strokeLinejoin="round" />
      {[40, 60, 80].map((y) => (
        <Path key={y} d={`M84 ${y} L98 ${y}`} stroke={colors.text} strokeOpacity={0.35} strokeWidth={2} />
      ))}
      <Path d="M30 30 L30 108" stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={4} strokeLinecap="round" />
      {label && (
        <SvgText x={60} y={137} fill={colors.text} fontSize={11} textAnchor="middle">
          {label}
        </SvgText>
      )}
    </Svg>
  );
}

// ── pH e indicadores ──

const SUBSTANCES = [
  { id: 'hcl', label: 'HCl (ácido fuerte)', ph: (c: number) => strongAcidPH(c) },
  { id: 'naoh', label: 'NaOH (base fuerte)', ph: (c: number) => strongBasePH(c) },
  { id: 'acetico', label: 'CH₃COOH (ácido débil, Ka 1,8·10⁻⁵)', ph: (c: number) => weakAcidPH(c, 1.8e-5) },
  { id: 'amoniaco', label: 'NH₃ (base débil, Kb 1,8·10⁻⁵)', ph: (c: number) => weakBasePH(c, 1.8e-5) },
] as const;

export function PhLab({ onExperiment }: { onExperiment: () => void }) {
  const { colors } = useTheme();
  const [sub, setSub] = useState<(typeof SUBSTANCES)[number]['id']>('hcl');
  const [exp, setExp] = useState(-2);
  const [measured, setMeasured] = useState<number | null>(null);
  const [guess, setGuess] = useState<'ácida' | 'neutra' | 'básica' | null>(null);
  const c = 10 ** exp;
  const s = SUBSTANCES.find((x) => x.id === sub)!;
  const reset = () => {
    setMeasured(null);
    setGuess(null);
  };
  return (
    <View style={{ gap: spacing.md }}>
      <KText variant="caption" muted>
        1. Elige una disolución y su concentración.
      </KText>
      {SUBSTANCES.map((x) => (
        <Choice key={x.id} on={x.id === sub} label={x.label} onPress={() => { setSub(x.id); reset(); }} />
      ))}
      <Stepper label="Concentración (mol/L)" value={exp} display={formatScientific(c, 2)} min={-6} max={0} step={0.5} onChange={(v) => { setExp(v); reset(); }} />
      <KText variant="caption" muted>
        2. Antes de medir: ¿qué crees que será?
      </KText>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {(['ácida', 'neutra', 'básica'] as const).map((g) => (
          <View key={g} style={{ flex: 1 }}>
            <Choice on={guess === g} label={g[0].toUpperCase() + g.slice(1)} onPress={() => setGuess(g)} />
          </View>
        ))}
      </View>
      <Button label="Añadir indicadores y medir" onPress={() => { setMeasured(s.ph(c)); onExperiment(); }} />
      {measured !== null && (
        <Stage tint={colors.accent} glow="center">
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {INDICATORS.map((ind) => {
              const col = indicatorColor(ind, measured);
              return (
                <View key={ind.id} style={{ alignItems: 'center', width: 96 }}>
                  <Beaker fill={0.6} color={col.color} opacity={col.opacity} width={84} />
                  <KText variant="caption" style={{ textAlign: 'center', fontWeight: '700' }}>
                    {ind.name}
                  </KText>
                  <KText variant="caption" muted style={{ textAlign: 'center' }}>
                    vira {fmt(ind.from, 1)}–{fmt(ind.to, 1)}
                  </KText>
                </View>
              );
            })}
          </View>
          <KText variant="display" style={{ textAlign: 'center' }}>
            pH {fmt(measured)}
          </KText>
          <PhScale value={measured} />
          <KText>
            Disolución {classifyPH(measured)}. [H₃O⁺] = {formatScientific(10 ** -measured, 2)} mol/L.
            {guess ? (guess === classifyPH(measured) ? ' ¡Tu predicción fue correcta!' : ` Predijiste ${guess}: compara con los colores.`) : ''}
          </KText>
          <SimNote>
            25 °C, actividad ≈ concentración, incluye la autoionización del agua. Colores aproximados; intervalos de viraje de
            OpenStax Chemistry 2e, fig. 14.23. A igual concentración, un ácido débil da un pH más alto porque se disocia poco.
          </SimNote>
        </Stage>
      )}
    </View>
  );
}

// ── Disoluciones ──

export function DilutionLab({ onExperiment }: { onExperiment: () => void }) {
  const { colors } = useTheme();
  const [c1, setC1] = useState(2);
  const [v1, setV1] = useState(50);
  const [v2, setV2] = useState(200);
  const [done, setDone] = useState(false);
  const valid = v2 >= v1;
  const c2 = valid ? dilution({ c1, v1, c2: null, v2 }) : null;
  // Intensidad del color proporcional a la concentración (máx. 6 M).
  const tone = (c: number) => 0.15 + 0.8 * Math.min(1, c / 6);
  return (
    <View style={{ gap: spacing.md }}>
      <Stepper label="C₁ (mol/L)" value={c1} display={fmt(c1, 1)} min={0.1} max={6} step={0.1} onChange={(v) => { setC1(v); setDone(false); }} />
      <Stepper label="V₁ tomado (mL)" value={v1} min={5} max={250} step={5} onChange={(v) => { setV1(v); setDone(false); }} />
      <Stepper label="V₂ final (mL)" value={v2} min={10} max={1000} step={10} onChange={(v) => { setV2(v); setDone(false); }} />
      {!valid && <KText color={colors.warning}>El volumen final debe ser mayor o igual que el que tomas.</KText>}
      <Stage tint={colors.primary} glow="center">
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }}>
          <Beaker fill={v1 / 250} color="#3B6CF6" opacity={tone(c1)} label={`${v1} mL · ${fmt(c1, 1)} M`} />
          <KText variant="title">→</KText>
          <Beaker fill={v2 / 1000} color="#3B6CF6" opacity={done && c2 !== null ? tone(c2) : 0.08} label={done && c2 !== null ? `${v2} mL · ${fmt(c2, 3)} M` : `${v2} mL`} />
        </View>
        <Button label="Diluir" disabled={!valid} onPress={() => { setDone(true); onExperiment(); }} />
        {done && c2 !== null && (
          <KText>
            C₂ = {fmt(c1, 1)} × {v1} ÷ {v2} = {fmt(c2, 3)} mol/L. Los moles de soluto no cambian ({fmt((c1 * v1) / 1000, 3)} mol): solo
            hay más disolvente, por eso el color se aclara.
          </KText>
        )}
        <SimNote>vasos a escalas distintas (250 mL y 1 L); la intensidad del color se usa solo como guía visual de la concentración.</SimNote>
      </Stage>
    </View>
  );
}

// ── Masa molar ──

export function MolarMassLab({ onExperiment }: { onExperiment: () => void }) {
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
  const PIE = ['#22D3EE', '#F472B6', '#FACC15', '#A78BFA', '#4ADE80', '#FB923C'];
  return (
    <View style={{ gap: spacing.md }}>
      <KText muted>Escribe una fórmula: H2O, Ca(OH)2, CuSO4·5H2O…</KText>
      <TextInput
        value={input}
        onChangeText={setInput}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Fórmula química"
        onSubmitEditing={calc}
        style={{ minHeight: MIN_TOUCH, borderRadius: radius.lg, paddingHorizontal: spacing.md, color: colors.text, fontSize: fontSize.bodyLg, backgroundColor: alpha(colors.text, 0.08) }}
      />
      <Button label="Calcular" onPress={calc} />
      {result && 'error' in result && <KText color={colors.danger}>{result.error}</KText>}
      {result && 'mass' in result && (
        <Stage glow="none">
          <KText variant="title">M = {fmt(result.mass, 3)} g/mol</KText>
          <View style={{ flexDirection: 'row', height: 18, borderRadius: 9, overflow: 'hidden' }} accessible accessibilityLabel="Composición porcentual en masa">
            {Object.entries(result.pct).map(([el, p], i) => (
              <View key={el} style={{ width: `${p}%`, backgroundColor: PIE[i % PIE.length] }} />
            ))}
          </View>
          {Object.entries(result.pct).map(([el, p], i) => (
            <View key={el} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: PIE[i % PIE.length] }} />
              <KText>
                {el}: {fmt(p, 2)} % en masa
              </KText>
            </View>
          ))}
          <KText muted variant="caption">
            Masas atómicas estándar IUPAC/CIAAW.
          </KText>
        </Stage>
      )}
    </View>
  );
}

// ── Balanceador ──

const EL_COLORS = ['#22D3EE', '#F472B6', '#FACC15', '#A78BFA', '#4ADE80', '#FB923C'];

function tally(species: string[], coefs: number[]) {
  const out: Record<string, number> = {};
  species.forEach((f, i) => {
    for (const [el, n] of Object.entries(parseFormula(f))) out[el] = (out[el] ?? 0) + n * coefs[i];
  });
  return out;
}

export function BalanceLab({ onExperiment }: { onExperiment: () => void }) {
  const { colors } = useTheme();
  const [eqIdx, setEqIdx] = useState(0);
  const [coefs, setCoefs] = useState<number[]>([]);
  const [solved, setSolved] = useState<string[]>([]);
  const eq = EQUATIONS[eqIdx];
  const { reactants, products } = parseEquation(eq);
  const c = [...reactants, ...products].map((_, i) => coefs[i] ?? 1);
  const rc = c.slice(0, reactants.length);
  const pc = c.slice(reactants.length);
  const left = tally(reactants, rc);
  const right = tally(products, pc);
  const elements = Object.keys({ ...left, ...right });
  const check = checkCoefficients(eq, rc, pc);
  const max = Math.max(...elements.flatMap((e) => [left[e] ?? 0, right[e] ?? 0]), 1);

  const set = (i: number, v: number) => {
    const next = [...c];
    next[i] = v;
    setCoefs(next);
    const r = checkCoefficients(eq, next.slice(0, reactants.length), next.slice(reactants.length));
    if (r.balanced && !solved.includes(eq)) {
      setSolved([...solved, eq]);
      onExperiment();
    }
  };

  const term = (f: string, i: number) => (
    <View key={`${f}${i}`} style={{ alignItems: 'center', gap: 4 }}>
      <Stepper label={pretty(f)} value={c[i]} min={1} max={MAX_COEFFICIENT} onChange={(v) => set(i, v)} />
    </View>
  );

  return (
    <View style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
        {EQUATIONS.map((e, i) => (
          <Pressable
            key={e}
            onPress={() => { setEqIdx(i); setCoefs([]); }}
            accessibilityRole="radio"
            accessibilityState={{ selected: i === eqIdx }}
            accessibilityLabel={`Ecuación ${i + 1}${solved.includes(e) ? ', resuelta' : ''}`}
            style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: i === eqIdx ? colors.primary : solved.includes(e) ? alpha(colors.success, 0.25) : alpha(colors.text, 0.08) }}>
            <KText variant="caption" color={i === eqIdx ? colors.onPrimary : colors.text} style={{ fontWeight: '800' }}>
              {String(i + 1)}
            </KText>
          </Pressable>
        ))}
      </View>
      <Stage tint={check.balanced ? colors.success : colors.primary} glow="center">
        <KText variant="title" style={{ textAlign: 'center' }}>
          {reactants.map((f, i) => `${rc[i] > 1 ? rc[i] : ''}${pretty(f)}`).join(' + ')} → {products.map((f, i) => `${pc[i] > 1 ? pc[i] : ''}${pretty(f)}`).join(' + ')}
        </KText>
        {/* Recuento de átomos a cada lado: la conservación de la masa, a la vista. */}
        {elements.map((el, k) => {
          const l = left[el] ?? 0;
          const r = right[el] ?? 0;
          const ok = l === r;
          return (
            <View key={el} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }} accessible accessibilityLabel={`${el}: ${l} a la izquierda, ${r} a la derecha${ok ? ', igual' : ''}`}>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <View style={{ width: `${(l / max) * 100}%`, height: 12, borderRadius: 6, backgroundColor: EL_COLORS[k % EL_COLORS.length] }} />
              </View>
              <KText style={{ width: 70, textAlign: 'center', fontWeight: '800' }} color={ok ? colors.success : colors.warning}>
                {l} {el} {ok ? '=' : '≠'} {r}
              </KText>
              <View style={{ flex: 1 }}>
                <View style={{ width: `${(r / max) * 100}%`, height: 12, borderRadius: 6, backgroundColor: EL_COLORS[k % EL_COLORS.length] }} />
              </View>
            </View>
          );
        })}
        <KText color={check.balanced ? colors.success : colors.textMuted} style={{ textAlign: 'center', fontWeight: '700' }}>
          {check.minimal ? '¡Balanceada con los coeficientes mínimos!' : check.balanced ? 'Balanceada, pero se puede simplificar.' : 'Iguala cada elemento a ambos lados.'}
        </KText>
      </Stage>
      <KText variant="caption" muted>
        Reactivos
      </KText>
      {reactants.map((f, i) => term(f, i))}
      <KText variant="caption" muted>
        Productos
      </KText>
      {products.map((f, i) => term(f, reactants.length + i))}
      <KText variant="caption" muted>
        Solo cambian los coeficientes: los subíndices definen la sustancia. Fuente: OpenStax Chemistry 2e, 4.1.
      </KText>
    </View>
  );
}

// ── Temperatura, energía y velocidad ──

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}
const PARTICLES = (() => {
  const r = seeded(11);
  return Array.from({ length: 18 }, () => ({ x: r(), y: r(), vx: r() * 2 - 1, vy: r() * 2 - 1 }));
})();

/** Rebote en caja: posición = reflejo de x0 + v·t dentro de [0, 1]. */
const bounce = (x: number) => {
  const m = ((x % 2) + 2) % 2;
  return m > 1 ? 2 - m : m;
};

export function EnergyLab({ onExperiment }: { onExperiment: () => void }) {
  const { colors, reduceMotion } = useTheme();
  const [T, setT] = useState(298);
  const [ea, setEa] = useState(50);
  const [catalyst, setCatalyst] = useState(false);
  const [measured, setMeasured] = useState(false);
  const t = useKataClock(!reduceMotion, 15);
  const eaEff = catalyst ? ea / 2 : ea;
  // k ∝ e^(−Ea/RT); referencia: 298 K con la Ea sin catalizador. rel = k(T, Ea efectiva) / k(298 K, Ea).
  const rel = rateRatio(ea, T) * Math.exp(((ea - eaEff) * 1000) / (R * T));
  const speed = relativeSpeed(T) * 0.18;
  const W = 300, H = 150;
  const hot = Math.max(0, Math.min(1, (T - 250) / 150));
  const box = `rgb(${Math.round(59 + 190 * hot)}, ${Math.round(108 - 40 * hot)}, ${Math.round(246 - 170 * hot)})`;
  return (
    <View style={{ gap: spacing.md }}>
      <Stage tint={box} glow="center" padded={false}>
        <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} accessibilityLabel={`Partículas a ${T} K`}>
          <Defs>
            <LinearGradient id="heat" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={box} stopOpacity={0.05} />
              <Stop offset="1" stopColor={box} stopOpacity={0.35} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={W} height={H} fill="url(#heat)" />
          {PARTICLES.map((p, i) => (
            <Circle
              key={i}
              cx={10 + bounce(p.x + p.vx * speed * t) * (W - 20)}
              cy={10 + bounce(p.y + p.vy * speed * t) * (H - 20)}
              r={6}
              fill={i % 2 ? '#22D3EE' : '#F472B6'}
              stroke="#0B1230"
              strokeWidth={1}
            />
          ))}
        </Svg>
      </Stage>
      <Stepper label="Temperatura (K)" value={T} display={`${T} K (${T - 273} °C)`} min={250} max={400} step={10} onChange={(v) => { setT(v); setMeasured(false); }} />
      <Stepper label="Energía de activación (kJ/mol)" value={ea} min={20} max={120} step={10} onChange={(v) => { setEa(v); setMeasured(false); }} />
      <Choice on={catalyst} label={catalyst ? 'Con catalizador (Ea a la mitad)' : 'Sin catalizador'} onPress={() => { setCatalyst(!catalyst); setMeasured(false); }} />
      <Button label="Medir velocidad relativa" onPress={() => { setMeasured(true); onExperiment(); }} />
      {measured && (
        <Stage glow="none">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            <StatPill icon="thermo" value={`${T} K`} color={colors.danger} label={`Temperatura ${T} kelvin`} />
            <StatPill icon="bolt" value={`Ea ${eaEff} kJ/mol`} color={colors.warning} label={`Energía de activación ${eaEff}`} />
          </View>
          <KText>
            Velocidad respecto a 25 °C sin catalizador: ×{rel >= 1000 || rel < 0.01 ? formatScientific(rel, 2) : fmt(rel, 2)}
          </KText>
          <GlowBar value={Math.max(0.02, Math.min(1, (Math.log10(rel) + 2) / 10))} color={colors.warning} label="Velocidad relativa en escala logarítmica" />
          <KText variant="caption">
            Las partículas se mueven más rápido al calentar (rapidez ∝ √T) y, sobre todo, aumenta la fracción de choques con
            energía suficiente (∝ e^(−Ea/RT)). Por eso una Ea alta hace la reacción muy sensible a la temperatura.
          </KText>
          <SimNote>
            ecuación de Arrhenius con el mismo factor A; el catalizador se modela reduciendo Ea a la mitad solo como
            ejemplo (cada catalizador real tiene su propio valor). Fuente: OpenStax Chemistry 2e, 12.5 y 12.7.
          </SimNote>
        </Stage>
      )}
    </View>
  );
}
