import { buildReminderPlan, DEFAULT_REMINDERS } from '../notifications/schedule';

describe('plan de recordatorios', () => {
  it('desactivado por defecto: no programa nada', () => {
    expect(buildReminderPlan(DEFAULT_REMINDERS)).toEqual([]);
  });
  it('estudio: uno semanal por día elegido, sin duplicados', () => {
    const plan = buildReminderPlan({ ...DEFAULT_REMINDERS, studyEnabled: true, studyWeekdays: [2, 4, 4, 9], studyHour: 19 });
    expect(plan.map((p) => p.id)).toEqual(['estudio-2', 'estudio-4']);
    expect(plan[0].trigger).toEqual({ kind: 'weekly', weekday: 2, hour: 19, minute: 0 });
  });
  it('bienestar: diario cada N horas dentro de la franja, rotando tipos', () => {
    const plan = buildReminderPlan({
      ...DEFAULT_REMINDERS,
      wellbeingEnabled: true,
      wellbeingStart: 10,
      wellbeingEnd: 16,
      wellbeingEveryHours: 3,
      wellbeingKinds: ['agua', 'pausa'],
    });
    expect(plan.map((p) => (p.trigger.kind === 'daily' ? p.trigger.hour : -1))).toEqual([10, 13, 16]);
    expect(plan[0].title).toMatch(/agua/i);
    expect(plan[1].title).toMatch(/pausa/i);
  });
  it('los textos nunca culpan', () => {
    const plan = buildReminderPlan({ ...DEFAULT_REMINDERS, studyEnabled: true, studyWeekdays: [1, 2, 3, 4, 5, 6, 7], wellbeingEnabled: true });
    plan.forEach((p) => expect(`${p.title} ${p.body}`).not.toMatch(/perder|racha|castigo|fallaste/i));
  });
});
