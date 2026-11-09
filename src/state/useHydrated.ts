import { useSyncExternalStore } from 'react';

import { useLearning } from './learning';
import { usePet } from './pet';
import { useProfile } from './profile';
import { useRewards } from './rewards';
import { useSettings } from './settings';
import { useTutorChat } from './tutor';

const STORES = [useSettings, useProfile, useLearning, useRewards, usePet, useTutorChat];

const allHydrated = () => STORES.every((s) => s.persist.hasHydrated());

function subscribe(onChange: () => void) {
  const unsubs = STORES.map((s) => s.persist.onFinishHydration(onChange));
  return () => unsubs.forEach((u) => u());
}

/** true cuando todos los stores persistidos terminaron de leer el almacenamiento local. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, allHydrated, allHydrated);
}
