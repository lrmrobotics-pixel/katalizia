import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage, STORE_KEYS } from './storage';

export type SyncStatus = 'idle' | 'syncing' | 'ok' | 'error' | 'offline';

export interface SyncState {
  /** Última modificación local de datos sincronizables (ms). */
  lastLocalChange: number;
  lastSyncedAt: number | null;
  status: SyncStatus;
  error: string | null;
  /** Correo de la sesión actual (solo para mostrarlo; la sesión la guarda Supabase). */
  email: string | null;
  touch: (at?: number) => void;
  setStatus: (status: SyncStatus, error?: string | null) => void;
  setSynced: (at: number) => void;
  setEmail: (email: string | null) => void;
}

export const useSync = create<SyncState>()(
  persist(
    (set) => ({
      lastLocalChange: 0,
      lastSyncedAt: null,
      status: 'idle',
      error: null,
      email: null,
      touch: (at = Date.now()) => set({ lastLocalChange: at }),
      setStatus: (status, error = null) => set({ status, error }),
      setSynced: (at) => set({ lastSyncedAt: at, status: 'ok', error: null }),
      setEmail: (email) => set({ email }),
    }),
    {
      name: STORE_KEYS.sync,
      storage: persistStorage,
      version: 1,
      partialize: (s) => ({ lastLocalChange: s.lastLocalChange, lastSyncedAt: s.lastSyncedAt, email: s.email }),
    },
  ),
);
