import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** Almacenamiento local-first compartido por todos los stores persistidos. */
export const persistStorage = createJSONStorage(() => AsyncStorage);

export const STORE_KEYS = {
  settings: 'katalizia:settings',
  profile: 'katalizia:profile',
  learning: 'katalizia:learning',
  rewards: 'katalizia:rewards',
  pet: 'katalizia:pet',
} as const;
