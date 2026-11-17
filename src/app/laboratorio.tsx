/**
 * Laboratorio virtual: escenario propio con 7 módulos. Todas las simulaciones se calculan
 * con el núcleo químico de la app y declaran sus simplificaciones (no son experimentos reales).
 */
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AtomBuilder } from '@/components/lab/AtomBuilder';
import { BalanceLab, DilutionLab, EnergyLab, MolarMassLab, PhLab } from '@/components/lab/ChemLabs';
import { MoleculeBuilder } from '@/components/lab/MoleculeBuilder';
import { KataAvatar } from '@/components/pet/KataAvatar';
import { KText, Screen } from '@/components/ui';
import { alpha, Stage } from '@/components/ui/scene';
import { SciIcon, type SciIconName } from '@/components/ui/SciIcon';
import { useRewards } from '@/state/rewards';
import { useStudyTimer } from '@/state/useStudyTimer';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type ModuleId = 'atomos' | 'moleculas' | 'ph' | 'balanceo' | 'disoluciones' | 'energia' | 'masa';

const MODULES: { id: ModuleId; name: string; icon: SciIconName; color: string; intro: string }[] = [
  { id: 'atomos', name: 'Átomos', icon: 'atom', color: '#F87171', intro: 'Arrastra protones, neutrones y electrones: mira cómo cambian el elemento, el número másico y la carga.' },
  { id: 'moleculas', name: 'Moléculas', icon: 'molecule', color: '#60A5FA', intro: 'Une átomos con enlaces simples, dobles o triples hasta completar todas las valencias.' },
  { id: 'ph', name: 'pH', icon: 'drop', color: '#4ADE80', intro: 'Predice, añade tres indicadores y observa el color: ácido, neutro o básico.' },
  { id: 'balanceo', name: 'Balanceo', icon: 'chart', color: '#FACC15', intro: 'Ajusta coeficientes y mira el recuento de átomos de cada lado hasta igualarlos.' },
  { id: 'disoluciones', name: 'Disoluciones', icon: 'flask', color: '#22D3EE', intro: 'Toma un volumen, añade disolvente y comprueba C₁V₁ = C₂V₂.' },
  { id: 'energia', name: 'Energía', icon: 'thermo', color: '#FB923C', intro: 'Calienta, cambia la energía de activación y añade un catalizador: ¿qué pasa con la velocidad?' },
  { id: 'masa', name: 'Masa molar', icon: 'target', color: '#A78BFA', intro: 'Calcula la masa molar y la composición porcentual de cualquier fórmula.' },
];

/** Registra un experimento (máx. 8 por visita, para que la XP refleje práctica real). */
function useExperimentCounter() {
  const award = useRewards((s) => s.award);
  const count = useRef(0);
  return useCallback(() => {
    if (count.current >= 8) return;
    count.current += 1;
    award('labExperiment');
  }, [award]);
}

export default function Laboratorio() {
  useStudyTimer();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ modulo?: string }>();
  const initial = MODULES.find((m) => m.id === params.modulo)?.id ?? 'atomos';
  const [tab, setTab] = useState<ModuleId>(initial);
  const onExperiment = useExperimentCounter();
  const mod = MODULES.find((m) => m.id === tab)!;

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Laboratorio virtual' }} />
      <Stage tint={mod.color} particles={20} glow="top-right">
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md }}>
          <KataAvatar mood="experimentando" size={76} />
          <View style={{ flex: 1, gap: 2, marginBottom: spacing.sm }}>
            <KText variant="caption" color={mod.color} style={{ fontWeight: '800' }}>
              MÓDULO · {mod.name.toUpperCase()}
            </KText>
            <KText>{mod.intro}</KText>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
          {MODULES.map((m) => {
            const on = m.id === tab;
            return (
              <Pressable
                key={m.id}
                onPress={() => setTab(m.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                accessibilityLabel={m.name}
                style={({ pressed }) => ({
                  minHeight: MIN_TOUCH,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: spacing.md,
                  borderRadius: 999,
                  backgroundColor: on ? alpha(m.color, 0.28) : alpha(colors.text, 0.07),
                  borderWidth: 1.5,
                  borderColor: on ? m.color : 'transparent',
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}>
                <SciIcon name={m.icon} color={m.color} size={18} />
                <KText variant="caption" style={{ fontWeight: '800' }}>
                  {m.name}
                </KText>
              </Pressable>
            );
          })}
        </ScrollView>
      </Stage>

      {tab === 'atomos' && <AtomBuilder onExperiment={onExperiment} />}
      {tab === 'moleculas' && <MoleculeBuilder onExperiment={onExperiment} />}
      {tab === 'ph' && <PhLab onExperiment={onExperiment} />}
      {tab === 'balanceo' && <BalanceLab onExperiment={onExperiment} />}
      {tab === 'disoluciones' && <DilutionLab onExperiment={onExperiment} />}
      {tab === 'energia' && <EnergyLab onExperiment={onExperiment} />}
      {tab === 'masa' && <MolarMassLab onExperiment={onExperiment} />}
    </Screen>
  );
}
