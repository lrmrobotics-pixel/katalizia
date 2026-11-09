import AsyncStorage from '@react-native-async-storage/async-storage';

import { useLearning } from '../learning';
import { useProfile } from '../profile';
import { useRewards } from '../rewards';
import { useSettings } from '../settings';
import { STORE_KEYS } from '../storage';

const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  useRewards.getState().reset();
  useLearning.getState().reset();
  useSettings.getState().reset();
  useProfile.getState().reset();
});

describe('recompensas', () => {
  it('suma XP, monedas y día activo', () => {
    const gained = useRewards.getState().award('lessonCompleted');
    const s = useRewards.getState();
    expect(gained).toBe(50);
    expect(s.xp).toBe(50);
    expect(s.coins).toBe(10);
    expect(s.activeDays).toHaveLength(1);
    useRewards.getState().award('exerciseCorrect');
    expect(useRewards.getState().activeDays).toHaveLength(1);
  });

  it('no permite comprar sin monedas ni dos veces', () => {
    expect(useRewards.getState().buy('birrete', 200)).toBe(false);
    useRewards.setState({ coins: 300 });
    expect(useRewards.getState().buy('birrete', 200)).toBe(true);
    expect(useRewards.getState().buy('birrete', 200)).toBe(false);
    expect(useRewards.getState().coins).toBe(100);
  });

  it('solo equipa objetos del inventario', () => {
    useRewards.getState().equip('head', 'birrete');
    expect(useRewards.getState().equipped.head).toBeUndefined();
    useRewards.setState({ inventory: ['birrete'] });
    useRewards.getState().equip('head', 'birrete');
    expect(useRewards.getState().equipped.head).toBe('birrete');
  });

  it('descubrir un elemento da XP solo la primera vez', () => {
    useRewards.getState().discover(26);
    useRewards.getState().discover(26);
    expect(useRewards.getState().xp).toBe(5);
    expect(useRewards.getState().discovered).toEqual([26]);
  });
});

describe('aprendizaje', () => {
  it('registra intentos y programa repaso', () => {
    useLearning.getState().recordAttempt({ questionId: 'q1', conceptId: 'c1', kind: 'concept', correct: true, hintsUsed: 0 });
    const s = useLearning.getState();
    expect(s.attempts).toHaveLength(1);
    expect(s.cards.c1.repetitions).toBe(1);
    expect(s.masteryOf('c1').status).toBe('learning');
  });
});

describe('ajustes y perfil', () => {
  it('limita valores fuera de rango', () => {
    useSettings.getState().set({ masteryThreshold: 2, weeklyGoalDays: 12, textScale: 5 });
    const s = useSettings.getState();
    expect(s.masteryThreshold).toBe(0.95);
    expect(s.weeklyGoalDays).toBe(7);
    expect(s.textScale).toBe(1.4);
  });

  it('sanea el nombre al terminar el onboarding', () => {
    useProfile.getState().completeOnboarding({ displayName: '   Ana    María   ', goals: ['medicina'] });
    expect(useProfile.getState().displayName).toBe('Ana María');
    expect(useProfile.getState().onboardingDone).toBe(true);
  });
});

describe('persistencia local', () => {
  it('guarda el progreso en AsyncStorage', async () => {
    useRewards.getState().award('assessmentPassed');
    await flush();
    const raw = await AsyncStorage.getItem(STORE_KEYS.rewards);
    expect(JSON.parse(raw!).state.xp).toBe(100);
  });

  it('rehidrata el progreso guardado', async () => {
    await AsyncStorage.setItem(
      STORE_KEYS.rewards,
      JSON.stringify({ state: { ...useRewards.getState(), xp: 777 }, version: 1 }),
    );
    await useRewards.persist.rehydrate();
    expect(useRewards.getState().xp).toBe(777);
  });
});
