import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';

import { SplashIntro } from '@/components/SplashIntro';
import { UpdateBanner } from '@/components/UpdateBanner';
import { startAutoSync } from '@/services/cloud/sync';
import { useHydrated } from '@/state/useHydrated';
import { useTheme } from '@/theme/useTheme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ PressStart2P_400Regular });
  const hydrated = useHydrated();
  const { colors, mode } = useTheme();
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);
  const ready = (fontsLoaded || !!fontError) && hydrated;

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync().catch(() => {});
    // Sin credenciales de Supabase no hace nada (modo solo local).
    startAutoSync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: colors.bg },
          headerBackButtonDisplayMode: 'minimal',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="ajustes" options={{ title: 'Ajustes' }} />
        <Stack.Screen name="tabla/index" options={{ title: 'Tabla periódica' }} />
        <Stack.Screen name="tabla/[z]" options={{ title: 'Elemento' }} />
        <Stack.Screen name="leccion/[id]" options={{ title: 'Lección' }} />
        <Stack.Screen name="diagnostico" options={{ title: 'Diagnóstico' }} />
        <Stack.Screen name="repaso" options={{ title: 'Repaso' }} />
        <Stack.Screen name="estadisticas" options={{ title: 'Mi progreso' }} />
        <Stack.Screen name="misiones" options={{ title: 'Misiones e insignias' }} />
        <Stack.Screen name="laboratorio" options={{ title: 'Laboratorio virtual' }} />
        <Stack.Screen name="juegos/rush" options={{ title: 'Periodic Rush' }} />
        <Stack.Screen name="juegos/molecula" options={{ title: 'Molecular Lab' }} />
        <Stack.Screen name="juegos/balanceo" options={{ title: 'Balance Express' }} />
        <Stack.Screen name="juegos/ph" options={{ title: 'PH Master' }} />
        <Stack.Screen name="juegos/cocina" options={{ title: 'Chemistry Kitchen' }} />
        <Stack.Screen name="juegos/bioquest" options={{ title: 'BioQuest' }} />
        <Stack.Screen name="cuenta" options={{ title: 'Sincronización' }} />
      </Stack>
      <UpdateBanner />
      {!introDone && <SplashIntro onDone={finishIntro} />}
    </>
  );
}
