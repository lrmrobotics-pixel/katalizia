/** Explorar: laboratorio, tabla periódica y minijuegos, cada uno con la habilidad que entrena. */
import { router, type Href } from 'expo-router';
import { Pressable, View } from 'react-native';

import { KataAvatar } from '@/components/pet/KataAvatar';
import { KText, Screen } from '@/components/ui';
import { alpha, SectionHeader, Stage, StatPill } from '@/components/ui/scene';
import { SciIcon, type SciIconName } from '@/components/ui/SciIcon';
import { useRewards } from '@/state/rewards';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const GAMES: { id: string; href: Href; title: string; skill: string; icon: SciIconName; color: string }[] = [
  { id: 'rush', href: '/juegos/rush', title: 'Periodic Rush', skill: 'Símbolos y nombres de elementos, con combos.', icon: 'table', color: '#A78BFA' },
  { id: 'atomos', href: '/laboratorio?modulo=atomos', title: 'Atom Builder', skill: 'Protones, neutrones, electrones, isótopos e iones.', icon: 'atom', color: '#F87171' },
  { id: 'molecula', href: '/juegos/molecula', title: 'Molecule Master', skill: 'Composición de moléculas átomo a átomo.', icon: 'molecule', color: '#60A5FA' },
  { id: 'balanceo', href: '/juegos/balanceo', title: 'Reaction Lab', skill: 'Balanceo de ecuaciones y conservación de la masa.', icon: 'chart', color: '#FACC15' },
  { id: 'ph', href: '/juegos/ph', title: 'PH Master', skill: 'Estimar pH y leer indicadores ácido-base.', icon: 'drop', color: '#4ADE80' },
  { id: 'cocina', href: '/juegos/cocina', title: 'Chemistry Kitchen', skill: 'Diluciones y gramos de soluto (molaridad).', icon: 'flask', color: '#22D3EE' },
  { id: 'bioquest', href: '/juegos/bioquest', title: 'BioQuest', skill: 'Química del cuerpo humano: iones, gases y pH.', icon: 'heart', color: '#F472B6' },
];

export default function Explorar() {
  const { colors } = useTheme();
  const best = useRewards((s) => s.bestScores);
  const discovered = useRewards((s) => s.discovered.length);
  return (
    <Screen>
      <KText variant="display" accessibilityRole="header">
        Explorar
      </KText>
      <Pressable onPress={() => router.push('/laboratorio')} accessibilityRole="button" accessibilityLabel="Entrar al laboratorio virtual">
        <Stage tint={colors.accent} particles={24} glow="top-right">
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md }}>
            <KataAvatar mood="experimentando" size={84} />
            <View style={{ flex: 1, gap: 4, marginBottom: spacing.sm }}>
              <KText variant="caption" color={colors.accent} style={{ fontWeight: '800' }}>
                LABORATORIO VIRTUAL
              </KText>
              <KText variant="bodyLg" style={{ fontWeight: '800' }}>
                7 módulos: átomos, moléculas, pH, balanceo, disoluciones, energía y masa molar
              </KText>
            </View>
          </View>
        </Stage>
      </Pressable>
      <Pressable onPress={() => router.push('/tabla')} accessibilityRole="button" accessibilityLabel="Abrir la tabla periódica">
        <Stage tint="#A78BFA" glow="top-left">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View style={{ width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: alpha('#A78BFA', 0.2) }}>
              <SciIcon name="table" color="#A78BFA" size={30} />
            </View>
            <View style={{ flex: 1 }}>
              <KText style={{ fontWeight: '800' }}>Tabla periódica</KText>
              <KText variant="caption" muted>
                118 elementos · familias · comparación · {discovered}/118 descubiertos
              </KText>
            </View>
            <SciIcon name="play" color="#A78BFA" size={20} />
          </View>
        </Stage>
      </Pressable>

      <SectionHeader title="Minijuegos" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        {GAMES.map((g) => (
          <Pressable
            key={g.id}
            onPress={() => router.push(g.href)}
            accessibilityRole="button"
            accessibilityLabel={`${g.title}. ${g.skill}`}
            style={({ pressed }) => ({ flexBasis: '46%', flexGrow: 1, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
            <Stage tint={g.color} glow="top-right" style={{ minHeight: 168 }}>
              <View style={{ width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: alpha(g.color, 0.22) }}>
                <SciIcon name={g.icon} color={g.color} size={26} />
              </View>
              <KText style={{ fontWeight: '800' }}>{g.title}</KText>
              <KText variant="caption" muted>
                {g.skill}
              </KText>
              {best[g.id] ? <StatPill icon="trophy" value={`${best[g.id]}`} color={colors.warning} label={`Récord ${best[g.id]} puntos`} /> : null}
            </Stage>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
