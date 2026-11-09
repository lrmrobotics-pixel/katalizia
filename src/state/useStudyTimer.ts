import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useRewards } from './rewards';

/**
 * Cuenta el tiempo de estudio mientras la pantalla está montada y la app en primer plano.
 * Se guarda al salir de la pantalla o al pasar la app a segundo plano.
 */
export function useStudyTimer() {
  useEffect(() => {
    let start: number | null = Date.now();
    const flush = () => {
      if (start !== null) useRewards.getState().addStudyTime(Date.now() - start);
      start = null;
    };
    const sub = AppState.addEventListener('change', (st) => {
      if (st === 'active') start ??= Date.now();
      else flush();
    });
    return () => {
      sub.remove();
      flush();
    };
  }, []);
}
