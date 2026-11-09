/**
 * Capa de tutor desacoplada del proveedor.
 * - `LocalTutor`: sin IA; responde con contenido local y guía socrática predefinida.
 * - `RemoteTutor`: llama a un backend propio (nunca a un proveedor con clave desde la app).
 */
import type { ExplanationStyle } from '@/state/settings';

export type Role = 'student' | 'tutor';

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  at: number;
  /** Marcado cuando el texto es una metáfora (modo chisme). */
  isAnalogy?: boolean;
}

export interface TutorContext {
  style: ExplanationStyle;
  /** Conceptos que la estudiante aún no domina (para adaptar). */
  weakConcepts: string[];
  /** Intentos fallidos seguidos sobre el mismo tema: a partir de 2, cambiar de estrategia. */
  consecutiveFailures: number;
}

export interface TutorReply {
  messages: Omit<ChatMessage, 'id' | 'at'>[];
  suggestions: string[];
}

export interface TutorProvider {
  readonly id: string;
  /** true solo si hay un modelo de IA real conectado. */
  readonly isAI: boolean;
  reply(history: ChatMessage[], input: string, ctx: TutorContext): Promise<TutorReply>;
}
