import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';

import { SplashIntro } from '@/components/SplashIntro';
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
    if (ready) SplashScreen.hideAsync().catch(() => {});
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
      </Stack>
      {!introDone && <SplashIntro onDone={finishIntro} />}
    </>
  );
}
