import { useEffect, useState } from 'react';

/** Origen común del reloj de animación (segundos), para que los trucos se puedan fechar al pulsar. */
const EPOCH = Date.now();
export const kataNow = () => (Date.now() - EPOCH) / 1000;

/**
 * Reloj de animación en segundos a `fps` cuadros por segundo.
 * Con `active = false` (movimiento reducido o vista estática) se queda quieto.
 */
export function useKataClock(active: boolean, fps: number): number {
  const [t, setT] = useState(kataNow);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setT(kataNow()), 1000 / fps);
    return () => clearInterval(id);
  }, [active, fps]);
  return active ? t : 0;
}
