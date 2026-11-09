/**
 * Selección del proveedor del tutor.
 * La IA remota solo se activa si existe `EXPO_PUBLIC_TUTOR_BACKEND_URL` apuntando a un
 * backend propio que guarda la clave del proveedor. La app nunca contiene claves.
 * Mientras no exista backend, se usa `LocalTutor` y la UI lo indica.
 */
import { LocalTutor } from './localTutor';
import type { TutorProvider } from './types';

let provider: TutorProvider | null = null;

export function getTutor(): TutorProvider {
  if (!provider) provider = new LocalTutor();
  return provider;
}

export type { ChatMessage, TutorContext, TutorProvider, TutorReply } from './types';
