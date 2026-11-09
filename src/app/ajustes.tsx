import { router } from 'expo-router';
import { Alert, Pressable, Switch, TextInput, View } from 'react-native';

import { Button, Card, KText, Screen } from '@/components/ui';
import { useLearning } from '@/state/learning';
import { useProfile } from '@/state/profile';
import { useRewards } from '@/state/rewards';
import { useSettings, type ExplanationStyle, type ThemePreference } from '@/state/settings';
import { MIN_TOUCH, radius, spacing, type PaletteId } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={String(o.value)}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            style={{
              minHeight: MIN_TOUCH,
              paddingHorizontal: spacing.md,
              justifyContent: 'center',
              borderWidth: 2,
              borderRadius: radius.md,
              borderColor: on ? colors.accent : colors.border,
              backgroundColor: on ? colors.primary : 'transparent',
            }}>
            <KText color={on ? colors.onPrimary : undefined}>{o.label}</KText>
          </Pressable>
        );
      })}
    </View>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: MIN_TOUCH }}>
      <KText style={{ flex: 1 }}>{label}</KText>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ true: colors.primary, false: colors.border }}
      />
    </View>
  );
}

export default function Ajustes() {
  const { colors, fontSize } = useTheme();
  const s = useSettings();
  const profile = useProfile();

  const resetAll = () =>
    Alert.alert(
      'Borrar todos los datos',
      'Se eliminarán tu progreso, monedas, inventario y preferencias de este dispositivo. No se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: () => {
            useLearning.getState().reset();
            useRewards.getState().reset();
            useSettings.getState().reset();
            useProfile.getState().reset();
            router.replace('/onboarding');
          },
        },
      ],
    );

  return (
    <Screen>
      <Card>
        <KText variant="bodyLg" style={{ fontWeight: '700' }}>
          Perfil
        </KText>
        <TextInput
          value={profile.displayName}
          onChangeText={profile.rename}
          accessibilityLabel="Nombre"
          maxLength={24}
          style={{
            minHeight: MIN_TOUCH,
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            color: colors.text,
            fontSize: fontSize.body,
            backgroundColor: colors.surfaceAlt,
          }}
        />
      </Card>

      <Card>
        <KText variant="bodyLg" style={{ fontWeight: '700' }}>
          Apariencia
        </KText>
        <KText muted>Tema</KText>
        <Segmented<ThemePreference>
          label="Tema"
          value={s.theme}
          onChange={(theme) => s.set({ theme })}
          options={[
            { value: 'dark', label: 'Oscuro' },
            { value: 'light', label: 'Claro' },
            { value: 'system', label: 'Sistema' },
          ]}
        />
        <KText muted>Paleta</KText>
        <Segmented<PaletteId>
          label="Paleta"
          value={s.palette}
          onChange={(palette) => s.set({ palette })}
          options={[
            { value: 'katalizia', label: 'Katalizia' },
            { value: 'bioluminiscente', label: 'Bio' },
            { value: 'nebulosa', label: 'Nebulosa' },
          ]}
        />
        <KText muted>Tamaño de texto</KText>
        <Segmented<number>
          label="Tamaño de texto"
          value={s.textScale}
          onChange={(textScale) => s.set({ textScale })}
          options={[
            { value: 0.9, label: 'A−' },
            { value: 1, label: 'A' },
            { value: 1.15, label: 'A+' },
            { value: 1.3, label: 'A++' },
          ]}
        />
        <Toggle label="Alto contraste" value={s.highContrast} onChange={(highContrast) => s.set({ highContrast })} />
        <Toggle label="Reducir animaciones" value={s.reduceMotion} onChange={(reduceMotion) => s.set({ reduceMotion })} />
      </Card>

      <Card>
        <KText variant="bodyLg" style={{ fontWeight: '700' }}>
          Aprendizaje
        </KText>
        <KText muted>Meta semanal (días)</KText>
        <Segmented<number>
          label="Meta semanal"
          value={s.weeklyGoalDays}
          onChange={(weeklyGoalDays) => s.set({ weeklyGoalDays })}
          options={[1, 2, 3, 4, 5, 6, 7].map((d) => ({ value: d, label: String(d) }))}
        />
        <KText muted>Estilo de explicación de Kata</KText>
        <Segmented<ExplanationStyle>
          label="Estilo de explicación"
          value={s.explanationStyle}
          onChange={(explanationStyle) => s.set({ explanationStyle })}
          options={[
            { value: 'sencilla', label: 'Sencilla' },
            { value: 'formal', label: 'Formal' },
            { value: 'chisme', label: 'Chisme científico' },
          ]}
        />
        <KText muted>Umbral de dominio</KText>
        <Segmented<number>
          label="Umbral de dominio"
          value={s.masteryThreshold}
          onChange={(masteryThreshold) => s.set({ masteryThreshold })}
          options={[0.7, 0.8, 0.9].map((v) => ({ value: v, label: `${v * 100} %` }))}
        />
      </Card>

      <Card>
        <KText variant="bodyLg" style={{ fontWeight: '700' }}>
          Privacidad
        </KText>
        <KText muted>
          Todos tus datos se guardan solo en este dispositivo. No hay cuenta en la nube ni se envía información a
          terceros en esta versión.
        </KText>
        <KText muted variant="caption">
          Notificaciones y recordatorios de bienestar: Fase 5.
        </KText>
        <Button label="Borrar todos mis datos" variant="ghost" onPress={resetAll} />
      </Card>
    </Screen>
  );
}
