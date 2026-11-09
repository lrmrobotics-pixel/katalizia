import {
  BADGES,
  currentMissions,
  dailyMissions,
  earnedBadges,
  missionStatus,
  pruneLog,
  WEEKLY,
  type ActivityEvent,
} from '../gamification/missions';

const DAY = 24 * 3600 * 1000;
// Miércoles 11 de noviembre de 2026, 10:00 hora local.
const NOW = new Date(2026, 10, 11, 10).getTime();

describe('misiones', () => {
  it('elige 3 misiones diarias distintas y estables durante el día', () => {
    const a = dailyMissions(NOW);
    const b = dailyMissions(NOW + 3 * 3600 * 1000);
    expect(a).toHaveLength(3);
    expect(new Set(a.map((m) => m.id)).size).toBe(3);
    expect(a.map((m) => m.id)).toEqual(b.map((m) => m.id));
  });

  it('cuenta solo eventos del periodo actual', () => {
    const def = WEEKLY.find((m) => m.id === 'w-lecciones')!;
    const log: ActivityEvent[] = [
      { e: 'lessonCompleted', at: NOW - 30 * DAY },
      { e: 'lessonCompleted', at: NOW - 3600 * 1000 },
      { e: 'lessonCompleted', at: NOW },
    ];
    const st = missionStatus(def, log, [], NOW, 4);
    expect(st.progress).toBe(2);
    expect(st.done).toBe(false);
  });

  it('la misión de días usa la meta semanal y no cuenta reclamar misiones', () => {
    const def = WEEKLY.find((m) => m.id === 'w-dias')!;
    const monday = new Date(2026, 10, 9, 9).getTime();
    const log: ActivityEvent[] = [
      { e: 'exerciseCorrect', at: monday },
      { e: 'exerciseCorrect', at: monday + DAY },
      { e: 'missionCompleted', at: NOW },
    ];
    expect(missionStatus(def, log, [], NOW, 2).done).toBe(true);
    expect(missionStatus(def, log, [], NOW, 3).progress).toBe(2);
  });

  it('marca reclamadas por clave de periodo', () => {
    const m = currentMissions([], [], NOW, 3);
    const key = m.weekly[0].key;
    expect(key).toMatch(/^w-dias@2026-11-09$/);
    expect(currentMissions([], [key], NOW, 3).weekly[0].claimed).toBe(true);
  });

  it('el registro conserva solo ~2 semanas', () => {
    const log: ActivityEvent[] = [
      { e: 'exerciseCorrect', at: NOW - 20 * DAY },
      { e: 'exerciseCorrect', at: NOW - DAY },
    ];
    expect(pruneLog(log, NOW)).toHaveLength(1);
  });
});

describe('insignias', () => {
  const base = { counts: {}, xp: 0, discovered: 0, totalActiveDays: 0, missionsClaimed: 0, masteredWorlds: [] };
  it('ninguna al empezar', () => {
    expect(earnedBadges(base)).toEqual([]);
  });
  it('se ganan por criterios explícitos', () => {
    const got = earnedBadges({ ...base, counts: { lessonCompleted: 1 }, discovered: 12, xp: 900, masteredWorlds: ['m1-materia'] });
    expect(got).toEqual(expect.arrayContaining(['primer-paso', 'explorador', 'nivel-5', 'mundo-1']));
    expect(got).not.toContain('tabla-completa');
  });
  it('ids únicos', () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
  });
});
