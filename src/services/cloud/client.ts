/**
 * Cliente de Supabase. Solo usa la URL del proyecto y la clave pública "anon",
 * que está pensada para ir en la app: la seguridad la dan las políticas RLS
 * (cada usuaria solo puede leer y escribir su propia fila). Nunca pongas aquí la clave service_role.
 *
 * Configuración en `.env` (no se sube a git):
 *   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
 */
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** true solo si el proyecto tiene credenciales configuradas. */
export const cloudConfigured = Boolean(URL && ANON_KEY);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!cloudConfigured) return null;
  client ??= createClient(URL!, ANON_KEY!, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  });
  return client;
}
