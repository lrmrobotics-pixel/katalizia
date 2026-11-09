/**
 * Reglas de desbloqueo por prerrequisitos.
 * - Unidad: todos los conceptos prerrequisito con dominio provisional o completo.
 * - Mundo: todos los conceptos de los mundos requeridos con dominio completo
 *   (incluye la comprobación de retención).
 */
import { isProvisionallyMastered, type ConceptMastery } from './mastery';
import type { Unit, World } from './types';

export type MasteryLookup = (conceptId: string) => ConceptMastery | undefined;

export function isUnitUnlocked(unit: Unit, lookup: MasteryLookup): boolean {
  const own = new Set(unit.concepts.map((c) => c.id));
  const prereqs = unit.concepts.flatMap((c) => c.prerequisites).filter((id) => !own.has(id));
  return prereqs.every((id) => {
    const m = lookup(id);
    return m !== undefined && isProvisionallyMastered(m);
  });
}

export function worldConcepts(world: World): string[] {
  return world.modules.flatMap((m) => m.units.flatMap((u) => u.concepts.map((c) => c.id)));
}

export function isWorldMastered(world: World, lookup: MasteryLookup): boolean {
  const ids = worldConcepts(world);
  return ids.length > 0 && ids.every((id) => lookup(id)?.status === 'mastered');
}

export function isWorldUnlocked(world: World, allWorlds: World[], lookup: MasteryLookup): boolean {
  return world.requires.every((reqId) => {
    const req = allWorlds.find((w) => w.id === reqId);
    return req !== undefined && isWorldMastered(req, lookup);
  });
}

/** Fracción de conceptos del mundo dominados (0–1). */
export function worldProgress(world: World, lookup: MasteryLookup): number {
  const ids = worldConcepts(world);
  if (!ids.length) return 0;
  return ids.filter((id) => lookup(id)?.status === 'mastered').length / ids.length;
}
