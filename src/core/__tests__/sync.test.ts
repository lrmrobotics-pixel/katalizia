import { coinsForXp } from '../gamification/progress';
import { cardsFromAttempts, isSnapshot, mergeAttempts, mergeSnapshots, type Snapshot } from '../sync/merge';

const base = (over: Partial<Snapshot> = {}): Snapshot => ({
  v: 1,
  updatedAt: 1000,
  profile: { displayName: 'A', goals: [], onboardingDone: true, diagnosticDone: false, diagnostic: null, createdAt: 500 },
  learning: { attempts: [], completedUnits: [], lastUnitId: null },
  rewards: {
    xp: 0, coins: 0, badges: [], inventory: [], equipped: {}, activeDays: [], discovered: [], favorites: [],
    log: [], counts: {}, claimed: [], studyMs: {}, bestScores: {},
  },
  pet: { name: 'Kata', energy: 80, joy: 80, updatedAt: 1000 },
  prefs: { weeklyGoalDays: 4, masteryThreshold: 0.8, explanationStyle: 'sencilla' },
  ...over,
});

const att = (q: string, at: number, correct = true) => ({ questionId: q, conceptId: 'c', kind: 'concept' as const, correct, hintsUsed: 0, at });
const price = (id: string) => (id === 'gorro' ? 80 : 0);

describe('sincronización', () => {
  it('une intentos sin duplicar y en orden', () => {
    const merged = mergeAttempts([att('q1', 1), att('q2', 3)], [att('q1', 1), att('q3', 2)]);
    expect(merged.map((a) => a.questionId)).toEqual(['q1', 'q3', 'q2']);
  });

  it('recalcula las tarjetas de repaso desde los intentos', () => {
    const cards = cardsFromAttempts([att('q1', 0), att('q2', 1000)]);
    expect(cards.c.repetitions).toBe(2);
  });

  it('nunca pierde progreso académico ni elementos descubiertos', () => {
    const local = base({
      learning: { attempts: [att('q1', 10)], completedUnits: ['u1'], lastUnitId: 'u1' },
      rewards: { ...base().rewards, discovered: [1, 8], xp: 100 },
    });
    const remote = base({
      updatedAt: 2000,
      learning: { attempts: [att('q2', 20)], completedUnits: ['u2'], lastUnitId: 'u2' },
      rewards: { ...base().rewards, discovered: [26], xp: 60 },
    });
    const m = mergeSnapshots(local, remote, price);
    expect(m.learning.attempts).toHaveLength(2);
    expect(m.learning.completedUnits.sort()).toEqual(['u1', 'u2']);
    expect(m.learning.lastUnitId).toBe('u2');
    expect(m.rewards.discovered).toEqual([1, 8, 26]);
    expect(m.rewards.xp).toBe(100);
  });

  it('recalcula monedas descontando lo comprado', () => {
    const local = base({ rewards: { ...base().rewards, xp: 1000, inventory: ['gorro'], equipped: { cabeza: 'gorro' } } });
    const m = mergeSnapshots(local, base(), price);
    expect(m.rewards.coins).toBe(coinsForXp(1000) - 80);
    expect(m.rewards.equipped).toEqual({ cabeza: 'gorro' });
  });

  it('el perfil y las preferencias más recientes ganan; el onboarding hecho se conserva', () => {
    const local = base({ profile: { ...base().profile, displayName: 'Vieja', onboardingDone: true } });
    const remote = base({
      updatedAt: 5000,
      profile: { ...base().profile, displayName: 'Nueva', onboardingDone: false, createdAt: 100 },
      prefs: { weeklyGoalDays: 6, masteryThreshold: 0.9, explanationStyle: 'chisme' },
    });
    const m = mergeSnapshots(local, remote, price);
    expect(m.profile.displayName).toBe('Nueva');
    expect(m.profile.onboardingDone).toBe(true);
    expect(m.profile.createdAt).toBe(100);
    expect(m.prefs.weeklyGoalDays).toBe(6);
  });

  it('valida instantáneas recibidas', () => {
    expect(isSnapshot(base())).toBe(true);
    expect(isSnapshot({ v: 1 })).toBe(false);
    expect(isSnapshot(null)).toBe(false);
  });
});
