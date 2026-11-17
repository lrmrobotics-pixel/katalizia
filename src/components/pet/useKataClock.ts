import { useIsFocused } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/** Origen común del reloj de animación (segundos), para que los trucos se puedan fechar al pulsar. */
const EPOCH = Date.now();
export const kataNow = () => (Date.now() - EPOCH) / 1000;

function useAppActive(): boolean {
  const [active, setActive] = useState(AppState.currentState !== 'background');
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => setActive(s === 'active'));
    return () => sub.remove();
  }, []);
  return active;
}

/**
 * Reloj sin dependencia de la navegación (para pantallas fuera del Stack, como la intro).
 * Se detiene con `active = false` y cuando la app pasa a segundo plano.
 */
export function useKataClockRaw(active: boolean, fps: number): number {
  const appActive = useAppActive();
  const run = active && appActive;
  const [t, setT] = useState(kataNow);
  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setT(kataNow()), 1000 / fps);
    return () => clearInterval(id);
  }, [run, fps]);
  return active ? t : 0;
}

/**
 * Reloj de animación en segundos a `fps` cuadros por segundo. Además se pausa cuando la
 * pantalla no está enfocada: las pestañas siguen montadas y no deben animarse ocultas.
 */
export function useKataClock(active: boolean, fps: number): number {
  const focused = useIsFocused();
  return useKataClockRaw(active && focused, fps);
}
