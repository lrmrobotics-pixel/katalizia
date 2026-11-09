import { useState } from 'react';
import { TextInput } from 'react-native';

import { Button, Card, KText, Screen } from '@/components/ui';
import { cloudConfigured } from '@/services/cloud/client';
import { sendLoginCode, signOut, syncNow, verifyLoginCode } from '@/services/cloud/sync';
import { useSettings } from '@/state/settings';
import { useSync } from '@/state/sync';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const STATUS: Record<string, string> = {
  idle: 'Sin sincronizar todavía',
  syncing: 'Sincronizando…',
  ok: 'Al día',
  error: 'Error al sincronizar',
  offline: 'Sin conexión: se reintentará al volver a abrir la app',
};

export default function Cuenta() {
  const { colors, fontSize } = useTheme();
  const email = useSync((s) => s.email);
  const status = useSync((s) => s.status);
  const error = useSync((s) => s.error);
  const lastSyncedAt = useSync((s) => s.lastSyncedAt);
  const cloudSync = useSettings((s) => s.cloudSync);
  const [mail, setMail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const input = {
    minHeight: MIN_TOUCH,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: fontSize.body,
    backgroundColor: colors.surfaceAlt,
  } as const;

  if (!cloudConfigured) {
    return (
      <Screen>
        <Card>
          <KText variant="title">Sincronización no configurada</KText>
          <KText>
            Esta versión de la app todavía no está conectada a un servidor, así que tu progreso se guarda solo en este
            dispositivo. No se envía nada a internet.
          </KText>
          <KText muted variant="caption">
            Para activarla hay que crear un proyecto de Supabase y añadir sus datos públicos a la app (ver
            docs/SUPABASE.md).
          </KText>
        </Card>
      </Screen>
    );
  }

  const run = async (fn: () => Promise<string | null>) => {
    setBusy(true);
    setMsg(null);
    const err = await fn();
    setBusy(false);
    if (err) setMsg(err);
    return err;
  };

  if (email && cloudSync) {
    return (
      <Screen>
        <Card>
          <KText variant="title">Sesión iniciada</KText>
          <KText>{email}</KText>
          <KText>Estado: {STATUS[status] ?? status}</KText>
          {lastSyncedAt && (
            <KText muted variant="caption">
              Última sincronización: {new Date(lastSyncedAt).toLocaleString('es')}
            </KText>
          )}
          {status === 'error' && error && <KText color={colors.danger}>{error}</KText>}
          <Button label="Sincronizar ahora" loading={busy} onPress={() => void run(async () => ((await syncNow()) ? null : 'No se pudo sincronizar.'))} />
          <Button label="Cerrar sesión" variant="ghost" onPress={() => void signOut()} />
        </Card>
        <KText muted variant="caption">
          Se sincroniza tu progreso (respuestas, unidades, recompensas, mascota y perfil). Las conversaciones con Kata se
          quedan solo en el dispositivo.
        </KText>
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <KText variant="title">Guarda tu progreso en la nube</KText>
        <KText>
          Inicia sesión con tu correo para recuperar tu progreso si cambias de teléfono. Te enviaremos un código de un
          solo uso: no hay contraseña.
        </KText>
        <TextInput
          value={mail}
          onChangeText={setMail}
          placeholder="tu@correo.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          accessibilityLabel="Correo electrónico"
          style={input}
        />
        {!sent ? (
          <Button
            label="Enviar código"
            loading={busy}
            disabled={!/^\S+@\S+\.\S+$/.test(mail.trim())}
            onPress={() => void run(() => sendLoginCode(mail)).then((err) => !err && setSent(true))}
          />
        ) : (
          <>
            <KText muted>Revisa tu correo e introduce el código.</KText>
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="123456"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              autoComplete="one-time-code"
              maxLength={10}
              accessibilityLabel="Código recibido por correo"
              style={input}
            />
            <Button label="Entrar" loading={busy} disabled={code.trim().length < 6} onPress={() => void run(() => verifyLoginCode(mail, code))} />
            <Button label="Cambiar correo" variant="ghost" onPress={() => setSent(false)} />
          </>
        )}
        {msg && <KText color={colors.danger}>{msg}</KText>}
      </Card>
      <KText muted variant="caption">
        Tu correo solo se usa para iniciar sesión. Puedes cerrar sesión cuando quieras; tus datos locales no se borran.
      </KText>
    </Screen>
  );
}
