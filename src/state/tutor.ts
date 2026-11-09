import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ChatMessage } from '@/services/ai';

import { persistStorage } from './storage';

const MAX = 80;

export interface TutorState {
  messages: ChatMessage[];
  add: (m: Omit<ChatMessage, 'id' | 'at'>) => void;
  clear: () => void;
}

let seq = 0;

export const useTutorChat = create<TutorState>()(
  persist(
    (set) => ({
      messages: [],
      add: (m) =>
        set((s) => ({
          messages: [...s.messages, { ...m, id: `${Date.now()}-${seq++}`, at: Date.now() }].slice(-MAX),
        })),
      clear: () => set({ messages: [] }),
    }),
    { name: 'katalizia:tutor', storage: persistStorage, version: 1 },
  ),
);
