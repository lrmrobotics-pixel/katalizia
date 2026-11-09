/**
 * Modelo de dominio por concepto.
 *
 * 1. Bayesian Knowledge Tracing (Corbett & Anderson, 1995, "Knowledge tracing: Modeling the
 *    acquisition of procedural knowledge", User Modeling and User-Adapted Interaction 4:253–278)
 *    estima P(conoce) tras cada respuesta.
 * 2. Una sola calificación nunca basta: además de P(conoce) ≥ umbral se exige evidencia
 *    mínima, variedad de tipos de evidencia y una comprobación de retención espaciada.
 */
import type { Attempt, EvidenceKind } from './types';

export interface BktParams {
  pInit: number;
  pTransit: number;
  pSlip: number;
  pGuess: number;
}

export const DEFAULT_BKT: BktParams = { pInit: 0.1, pTransit: 0.15, pSlip: 0.1, pGuess: 0.2 };

export interface MasteryConfig {
  /** Umbral de P(conoce). 0.8 = 80 %. */
  threshold: number;
  minAttempts: number;
  /** Tipos de evidencia distintos requeridos (p. ej. concepto + aplicación). */
  minEvidenceKinds: number;
  /** Separación mínima (ms) entre la primera respuesta correcta y una de retención. */
  retentionGapMs: number;
  /** Penalización por pista usada: reduce el peso de un acierto. */
  hintPenalty: number;
}

export const DEFAULT_MASTERY: MasteryConfig = {
  threshold: 0.8,
  minAttempts: 3,
  minEvidenceKinds: 2,
  retentionGapMs: 20 * 60 * 60 * 1000, // ~1 día
  hintPenalty: 0.25,
};

/** Actualización bayesiana de P(conoce) tras una respuesta. */
export function bktUpdate(pKnown: number, correct: boolean, p: BktParams = DEFAULT_BKT): number {
  const posterior = correct
    ? (pKnown * (1 - p.pSlip)) / (pKnown * (1 - p.pSlip) + (1 - pKnown) * p.pGuess)
    : (pKnown * p.pSlip) / (pKnown * p.pSlip + (1 - pKnown) * (1 - p.pGuess));
  return posterior + (1 - posterior) * p.pTransit;
}

export type MasteryStatus = 'new' | 'learning' | 'needs-retention' | 'mastered' | 'needs-review';

export interface ConceptMastery {
  conceptId: string;
  pKnown: number;
  attempts: number;
  correct: number;
  kinds: EvidenceKind[];
  retentionPassed: boolean;
  status: MasteryStatus;
  lastAt: number | null;
}

/**
 * Calcula el estado de dominio de un concepto a partir de su historial completo.
 * Un acierto con pistas cuenta parcialmente: se interpola entre la actualización
 * por acierto y el valor previo.
 */
export function computeMastery(
  conceptId: string,
  attempts: Attempt[],
  config: MasteryConfig = DEFAULT_MASTERY,
  params: BktParams = DEFAULT_BKT,
): ConceptMastery {
  const list = attempts.filter((a) => a.conceptId === conceptId).sort((a, b) => a.at - b.at);
  let p = params.pInit;
  const kinds = new Set<EvidenceKind>();
  let firstCorrectAt: number | null = null;
  let retentionPassed = false;
  let correct = 0;

  for (const a of list) {
    const updated = bktUpdate(p, a.correct, params);
    if (a.correct && a.hintsUsed > 0) {
      const weight = Math.max(0, 1 - config.hintPenalty * a.hintsUsed);
      p = p + (updated - p) * weight;
    } else {
      p = updated;
    }
    if (a.correct) {
      correct++;
      if (a.hintsUsed === 0) kinds.add(a.kind);
      if (firstCorrectAt === null) firstCorrectAt = a.at;
      else if (a.hintsUsed === 0 && a.at - firstCorrectAt >= config.retentionGapMs) retentionPassed = true;
    }
  }

  const last = list.at(-1);
  let status: MasteryStatus;
  if (list.length === 0) status = 'new';
  else if (p >= config.threshold && list.length >= config.minAttempts && kinds.size >= config.minEvidenceKinds) {
    status = retentionPassed ? 'mastered' : 'needs-retention';
  } else if (retentionPassed && p < config.threshold) status = 'needs-review';
  else status = 'learning';

  return {
    conceptId,
    pKnown: p,
    attempts: list.length,
    correct,
    kinds: [...kinds],
    retentionPassed,
    status,
    lastAt: last?.at ?? null,
  };
}

/**
 * "Dominio provisional": umbral y evidencia cumplidos, pendiente solo la retención espaciada.
 * Permite avanzar a la siguiente unidad del mismo mundo sin esperar un día,
 * pero no desbloquea mundos nuevos.
 */
export const isProvisionallyMastered = (m: ConceptMastery) =>
  m.status === 'mastered' || m.status === 'needs-retention';
