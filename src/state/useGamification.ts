import { WORLDS } from '@/content/curriculum';
import { currentMissions, earnedBadges, type BadgeSnapshot } from '@/core/gamification/missions';
import { computeMastery, DEFAULT_MASTERY } from '@/core/learning/mastery';
import { isWorldMastered } from '@/core/learning/unlock';

import { useLearning } from './learning';
import { useRewards } from './rewards';
import { useSettings } from './settings';

/** Misiones del día y de la semana para el instante `now`. */
export function useMissions(now: number) {
  const log = useRewards((s) => s.log);
  const claimed = useRewards((s) => s.claimed);
  const weeklyGoal = useSettings((s) => s.weeklyGoalDays);
  return currentMissions(log, claimed, now, weeklyGoal);
}

/** Instantánea para evaluar insignias (todo derivado: no hay insignias "fantasma"). */
export function useBadgeSnapshot(): BadgeSnapshot {
  const counts = useRewards((s) => s.counts);
  const xp = useRewards((s) => s.xp);
  const discovered = useRewards((s) => s.discovered.length);
  const totalActiveDays = useRewards((s) => new Set(s.activeDays).size);
  const missionsClaimed = useRewards((s) => s.counts.missionCompleted ?? 0);
  const attempts = useLearning((s) => s.attempts);
  const threshold = useSettings((s) => s.masteryThreshold);
  const lookup = (cid: string) => computeMastery(cid, attempts, { ...DEFAULT_MASTERY, threshold });
  const masteredWorlds = WORLDS.filter((w) => isWorldMastered(w, lookup)).map((w) => w.id);
  return { counts, xp, discovered, totalActiveDays, missionsClaimed, masteredWorlds };
}

export function useEarnedBadges() {
  return earnedBadges(useBadgeSnapshot());
}
