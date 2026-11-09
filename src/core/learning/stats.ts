/** Estadísticas de progreso calculadas a partir de los intentos y del tiempo registrado. */
import { dayKey } from '@/core/gamification/progress';

import type { Attempt, EvidenceKind } from './types';

export interface DayStat {
  day: string;
  attempts: number;
  correct: number;
  minutes: number;
}

export interface StudyStats {
  totalAttempts: number;
  /** Proporción de aciertos (0–1), o null sin intentos. */
  accuracy: number | null;
  /** Aciertos sin pistas / intentos. */
  accuracyNoHints: number | null;
  totalMinutes: number;
  /** Últimos `days` días, del más antiguo al de hoy. */
  daily: DayStat[];
  byKind: Record<EvidenceKind, { attempts: number; correct: number }>;
}

const DAY_MS = 24 * 3600 * 1000;

export function computeStats(attempts: Attempt[], studyMs: Record<string, number>, now: number, days = 14): StudyStats {
  const total = attempts.length;
  const correct = attempts.filter((a) => a.correct).length;
  const clean = attempts.filter((a) => a.correct && a.hintsUsed === 0).length;
  const byDay = new Map<string, { attempts: number; correct: number }>();
  for (const a of attempts) {
    const k = dayKey(a.at);
    const d = byDay.get(k) ?? { attempts: 0, correct: 0 };
    d.attempts++;
    if (a.correct) d.correct++;
    byDay.set(k, d);
  }
  const daily: DayStat[] = [];
  for (let i = days - 1; i >= 0; i--) {
    // Mediodía para evitar saltos por cambio de horario.
    const d = new Date(now - i * DAY_MS);
    d.setHours(12, 0, 0, 0);
    const k = dayKey(d.getTime());
    const v = byDay.get(k) ?? { attempts: 0, correct: 0 };
    daily.push({ day: k, ...v, minutes: Math.round((studyMs[k] ?? 0) / 60000) });
  }
  const kinds: EvidenceKind[] = ['concept', 'application', 'problem', 'retention', 'explain'];
  const byKind = Object.fromEntries(
    kinds.map((k) => {
      const xs = attempts.filter((a) => a.kind === k);
      return [k, { attempts: xs.length, correct: xs.filter((a) => a.correct).length }];
    }),
  ) as StudyStats['byKind'];
  return {
    totalAttempts: total,
    accuracy: total ? correct / total : null,
    accuracyNoHints: total ? clean / total : null,
    totalMinutes: Math.round(Object.values(studyMs).reduce((s, v) => s + v, 0) / 60000),
    daily,
    byKind,
  };
}
