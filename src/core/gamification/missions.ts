/**
 * Misiones diarias/semanales e insignias.
 *
 * Principio sin culpa: una misión no cumplida simplemente expira; nunca resta nada.
 * Todo se calcula a partir del registro de actividad (pura, sin estado oculto).
 */
import { dayKey, levelFromXp, weekKey, type XpEvent } from './progress';

export interface ActivityEvent {
  e: XpEvent;
  at: number;
}

export type MissionPeriod = 'daily' | 'weekly';

export interface MissionDef {
  id: string;
  period: MissionPeriod;
  title: string;
  /** Eventos que cuentan para el progreso; 'activeDay' cuenta días distintos con actividad. */
  counts: XpEvent[] | 'activeDay';
  /** Objetivo fijo, o 'weeklyGoal' para usar la meta semanal elegida. */
  target: number | 'weeklyGoal';
}

const EXERCISES: XpEvent[] = ['exerciseCorrect', 'exerciseCorrectWithHints', 'exerciseAttempted'];

export const DAILY_POOL: MissionDef[] = [
  { id: 'd-ejercicios', period: 'daily', title: 'Responde 5 ejercicios', counts: EXERCISES, target: 5 },
  { id: 'd-aciertos', period: 'daily', title: 'Acierta 3 ejercicios sin pistas', counts: ['exerciseCorrect'], target: 3 },
  { id: 'd-repaso', period: 'daily', title: 'Completa un repaso', counts: ['reviewCompleted'], target: 1 },
  { id: 'd-elementos', period: 'daily', title: 'Descubre 2 elementos en la tabla', counts: ['elementDiscovered'], target: 2 },
  { id: 'd-juego', period: 'daily', title: 'Juega un minijuego', counts: ['minigamePlayed'], target: 1 },
  { id: 'd-leccion', period: 'daily', title: 'Completa una lección', counts: ['lessonCompleted'], target: 1 },
  { id: 'd-lab', period: 'daily', title: 'Haz un experimento en el laboratorio', counts: ['labExperiment'], target: 1 },
];

export const WEEKLY: MissionDef[] = [
  { id: 'w-dias', period: 'weekly', title: 'Estudia los días de tu meta semanal', counts: 'activeDay', target: 'weeklyGoal' },
  { id: 'w-lecciones', period: 'weekly', title: 'Completa 3 lecciones', counts: ['lessonCompleted'], target: 3 },
  { id: 'w-juegos', period: 'weekly', title: 'Juega 3 minijuegos', counts: ['minigamePlayed'], target: 3 },
];

/** Hash determinista de una cadena (FNV-1a de 32 bits). */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Tres misiones diarias distintas, iguales para todo el día. */
export function dailyMissions(now: number, n = 3): MissionDef[] {
  const day = dayKey(now);
  return [...DAILY_POOL].sort((a, b) => hash(day + a.id) - hash(day + b.id)).slice(0, n);
}

export interface MissionStatus {
  def: MissionDef;
  /** Clave única de esta instancia: id@periodo. */
  key: string;
  progress: number;
  target: number;
  done: boolean;
  claimed: boolean;
}

export function periodKey(period: MissionPeriod, ts: number) {
  return period === 'daily' ? dayKey(ts) : weekKey(ts);
}

export function missionStatus(
  def: MissionDef,
  log: ActivityEvent[],
  claimed: string[],
  now: number,
  weeklyGoal: number,
): MissionStatus {
  const pk = periodKey(def.period, now);
  const inPeriod = log.filter((ev) => periodKey(def.period, ev.at) === pk);
  const progress =
    def.counts === 'activeDay'
      ? new Set(inPeriod.filter((ev) => ev.e !== 'missionCompleted').map((ev) => dayKey(ev.at))).size
      : inPeriod.filter((ev) => (def.counts as XpEvent[]).includes(ev.e)).length;
  const target = def.target === 'weeklyGoal' ? weeklyGoal : def.target;
  const key = `${def.id}@${pk}`;
  return { def, key, progress: Math.min(progress, target), target, done: progress >= target, claimed: claimed.includes(key) };
}

export function currentMissions(log: ActivityEvent[], claimed: string[], now: number, weeklyGoal: number) {
  return {
    daily: dailyMissions(now).map((d) => missionStatus(d, log, claimed, now, weeklyGoal)),
    weekly: WEEKLY.map((d) => missionStatus(d, log, claimed, now, weeklyGoal)),
  };
}

/** El registro solo necesita las últimas dos semanas para las misiones. */
export function pruneLog(log: ActivityEvent[], now: number, keepMs = 15 * 24 * 3600 * 1000): ActivityEvent[] {
  return log.filter((ev) => now - ev.at <= keepMs);
}

// ── Insignias ──────────────────────────────────────────────────────────────

export interface BadgeSnapshot {
  /** Totales históricos por evento (nunca bajan). */
  counts: Partial<Record<XpEvent, number>>;
  xp: number;
  discovered: number;
  totalActiveDays: number;
  missionsClaimed: number;
  masteredWorlds: string[];
}

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  earned: (s: BadgeSnapshot) => boolean;
}

const c = (s: BadgeSnapshot, e: XpEvent) => s.counts[e] ?? 0;

export const BADGES: BadgeDef[] = [
  { id: 'primer-paso', title: 'Primer paso', description: 'Completa tu primera lección.', earned: (s) => c(s, 'lessonCompleted') >= 1 },
  { id: 'evaluada', title: 'Prueba superada', description: 'Saca 100 % en una evaluación de unidad.', earned: (s) => c(s, 'assessmentPassed') >= 1 },
  { id: 'explorador', title: 'Exploradora', description: 'Descubre 10 elementos.', earned: (s) => s.discovered >= 10 },
  { id: 'tabla-completa', title: 'Tabla completa', description: 'Descubre los 118 elementos.', earned: (s) => s.discovered >= 118 },
  { id: 'constante', title: 'Constancia', description: 'Estudia 7 días (no tienen que ser seguidos).', earned: (s) => s.totalActiveDays >= 7 },
  { id: 'mes-quimico', title: 'Mes químico', description: 'Estudia 30 días en total.', earned: (s) => s.totalActiveDays >= 30 },
  { id: 'repaso-5', title: 'Memoria de acero', description: 'Completa 5 repasos.', earned: (s) => c(s, 'reviewCompleted') >= 5 },
  { id: 'jugadora', title: 'A jugar', description: 'Juega tu primer minijuego.', earned: (s) => c(s, 'minigamePlayed') >= 1 },
  { id: 'laboratorio', title: 'Bata puesta', description: 'Haz 5 experimentos en el laboratorio.', earned: (s) => c(s, 'labExperiment') >= 5 },
  { id: 'misiones-5', title: 'Misión cumplida', description: 'Completa 5 misiones.', earned: (s) => s.missionsClaimed >= 5 },
  { id: 'nivel-5', title: 'Nivel 5', description: 'Llega al nivel 5.', earned: (s) => levelFromXp(s.xp).level >= 5 },
  { id: 'mundo-1', title: 'Fundamentos', description: 'Domina el Mundo 1.', earned: (s) => s.masteredWorlds.includes('m1-materia') },
  { id: 'mundo-6', title: 'Maestra del mol', description: 'Domina el Mundo 6.', earned: (s) => s.masteredWorlds.includes('m6-calculos') },
  { id: 'mundo-10', title: 'Química de la vida', description: 'Domina el Mundo 10.', earned: (s) => s.masteredWorlds.includes('m10-bioquimica') },
];

export function earnedBadges(s: BadgeSnapshot): string[] {
  return BADGES.filter((b) => b.earned(s)).map((b) => b.id);
}
