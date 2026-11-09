import { router } from 'expo-router';
import * as Updates from 'expo-updates';
import { useState } from 'react';
import { Alert, Platform, Pressable, Switch, TextInput, View } from 'react-native';

import { Button, Card, KText, Screen } from '@/components/ui';
import { Stepper } from '@/components/ui/Stepper';
import { WELLBEING_LABELS, type ReminderPrefs, type WellbeingKind } from '@/core/notifications/schedule';
import { cloudConfigured } from '@/services/cloud/client';
import { applyReminders, notificationsSupported } from '@/services/notifications';
import { useLearning } from '@/state/learning';
import { useProfile } from '@/state/profile';
import { useRewards } from '@/state/rewards';
import { useSettings, type ExplanationStyle, type ThemePreference } from '@/state/settings';
import { useSync } from '@/state/sync';
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

const WEEKDAYS = [
  { value: 2, label: 'L' },
  { value: 3, label: 'M' },
  { value: 4, label: 'X' },
  { value: 5, label: 'J' },
  { value: 6, label: 'V' },
  { value: 7, label: 'S' },
  { value: 1, label: 'D' },
];

function Chips<T extends string | number>({
  options,
  selected,
  onToggle,
  label,
}: {
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (v: T) => void;
  label: string;
}) {
  const { colors } = useTheme();
  return (
    <View accessibilityLabel={label} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
      {options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <Pressable
            key={String(o.value)}
            onPress={() => onToggle(o.value)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            accessibilityLabel={o.label}
            style={{
              minWidth: MIN_TOUCH,
              minHeight: MIN_TOUCH,
              paddingHorizontal: spacing.sm,
              alignItems: 'center',
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

const toggleIn = <T,>(xs: T[], x: T) => (xs.includes(x) ? xs.filter((y) => y !== x) : [...xs, x]);
const hh = (h: number) => `${String(h).padStart(2, '0')}:00`;

function RemindersCard() {
  const reminders = useSettings((s) => s.reminders);
  const set = useSettings((s) => s.set);
  const [status, setStatus] = useState<string | null>(null);
  const update = (patch: Partial<ReminderPrefs>) => {
    set({ reminders: { ...reminders, ...patch } });
    setStatus(null);
  };
  const save = async () => {
    const r = await applyReminders(reminders);
    setStatus(
      r.permission === 'denied'
        ? 'Sin permiso de notificaciones: actívalo en los ajustes del teléfono.'
        : r.scheduled
          ? `Listo: ${r.scheduled} recordatorios programados.`
          : 'Recordatorios desactivados.',
    );
  };
  return (
    <Card>
      <KText variant="bodyLg" style={{ fontWeight: '700' }}>
        Recordatorios
      </KText>
      {!notificationsSupported ? (
        <KText muted>Los recordatorios funcionan en la app de Android/iOS, no en la versión web.</KText>
      ) : (
        <>
          <Toggle label="Recordatorio de estudio" value={reminders.studyEnabled} onChange={(studyEnabled) => update({ studyEnabled })} />
          {reminders.studyEnabled && (
            <>
              <Stepper
                label="Hora"
                value={reminders.studyHour}
                display={hh(reminders.studyHour)}
                min={6}
                max={23}
                onChange={(studyHour) => update({ studyHour, studyMinute: 0 })}
              />
              <Chips
                label="Días del recordatorio"
                options={WEEKDAYS}
                selected={reminders.studyWeekdays}
                onToggle={(d) => update({ studyWeekdays: toggleIn(reminders.studyWeekdays, d) })}
              />
            </>
          )}
          <Toggle
            label="Recordatorios de bienestar"
            value={reminders.wellbeingEnabled}
            onChange={(wellbeingEnabled) => update({ wellbeingEnabled })}
          />
          {reminders.wellbeingEnabled && (
            <>
              <Chips<WellbeingKind>
                label="Tipos de recordatorio de bienestar"
                options={(Object.keys(WELLBEING_LABELS) as WellbeingKind[]).map((k) => ({ value: k, label: WELLBEING_LABELS[k] }))}
                selected={reminders.wellbeingKinds}
                onToggle={(k) => update({ wellbeingKinds: toggleIn(reminders.wellbeingKinds, k) })}
              />
              <Stepper
                label="Desde"
                value={reminders.wellbeingStart}
                display={hh(reminders.wellbeingStart)}
                min={6}
                max={reminders.wellbeingEnd}
                onChange={(wellbeingStart) => update({ wellbeingStart })}
              />
              <Stepper
                label="Hasta"
                value={reminders.wellbeingEnd}
                display={hh(reminders.wellbeingEnd)}
                min={reminders.wellbeingStart}
                max={23}
                onChange={(wellbeingEnd) => update({ wellbeingEnd })}
              />
              <Stepper
                label="Cada (horas)"
                value={reminders.wellbeingEveryHours}
                min={1}
                max={6}
                onChange={(wellbeingEveryHours) => update({ wellbeingEveryHours })}
              />
            </>
          )}
          <Button label="Guardar recordatorios" variant="secondary" onPress={() => void save()} />
          {status && <KText muted>{status}</KText>}
        </>
      )}
    </Card>
  );
}

/** expo-updates solo funciona en el APK instalado (no en web, Expo Go ni desarrollo). */
const updatesActive = Platform.OS !== 'web' && Updates.isEnabled;

function UpdatesCard() {
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const check = async () => {
    setBusy(true);
    try {
      const r = await Updates.checkForUpdateAsync();
      if (!r.isAvailable) setMsg('Ya tienes la última versión.');
      else {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'No se pudo comprobar.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card>
      <KText variant="bodyLg" style={{ fontWeight: '700' }}>
        Versión
      </KText>
      {updatesActive ? (
        <>
          <KText muted variant="caption">
            Canal {Updates.channel ?? '—'} · versión {Updates.runtimeVersion ?? '—'} ·{' '}
            {Updates.isEmbeddedLaunch ? 'incluida en el APK' : `actualización ${(Updates.updateId ?? '').slice(0, 8)}`}
          </KText>
          <KText muted>La app busca novedades al abrirse y las aplica la siguiente vez que la abres.</KText>
          <Button label="Buscar actualización ahora" variant="secondary" loading={busy} onPress={() => void check()} />
          {msg && <KText muted>{msg}</KText>}
        </>
      ) : (
        <KText muted>Las actualizaciones automáticas funcionan en el APK instalado (no en Expo Go ni en la web).</KText>
      )}
    </Card>
  );
}

export default function Ajustes() {
  const { colors, fontSize } = useTheme();
  const s = useSettings();
  const profile = useProfile();
  const syncEmail = useSync((x) => x.email);

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

      <RemindersCard />

      <Card>
        <KText variant="bodyLg" style={{ fontWeight: '700' }}>
          Sincronización en la nube
        </KText>
        <KText muted>
          {!cloudConfigured
            ? 'No configurada en esta versión: todo se guarda solo en este dispositivo.'
            : syncEmail
              ? `Sesión iniciada como ${syncEmail}.`
              : 'Opcional: inicia sesión con tu correo para no perder el progreso si cambias de teléfono.'}
        </KText>
        <Button label="Gestionar sincronización" variant="secondary" onPress={() => router.push('/cuenta')} />
      </Card>

      <UpdatesCard />

      <Card>
        <KText variant="bodyLg" style={{ fontWeight: '700' }}>
          Privacidad
        </KText>
        <KText muted>
          Tus datos se guardan en este dispositivo. Solo si inicias sesión en Sincronización se copia tu progreso en tu
          cuenta (no las conversaciones con Kata). No se comparte con terceros ni se usa para publicidad.
        </KText>
        {syncEmail && (
          <KText muted variant="caption">
            Con la sesión iniciada, borrar los datos aquí no borra la copia de la nube: cierra sesión antes si quieres
            empezar de cero.
          </KText>
        )}
        <Button label="Borrar todos mis datos" variant="ghost" onPress={resetAll} />
      </Card>
    </Screen>
  );
}
