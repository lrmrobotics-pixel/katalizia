/**
 * Plan de recordatorios locales (puro y testeable). El servicio de `services/notifications`
 * lo traduce a llamadas de expo-notifications.
 *
 * Tono: invitación amable, nunca culpa ("te espero cuando quieras", no "¡vas a perder tu racha!").
 */

export type WellbeingKind = 'agua' | 'pausa' | 'estiramiento' | 'ojos' | 'postura';

export interface ReminderPrefs {
  studyEnabled: boolean;
  studyHour: number;
  studyMinute: number;
  /** Días de la semana con recordatorio de estudio: 1 = domingo … 7 = sábado (convención de expo-notifications). */
  studyWeekdays: number[];
  wellbeingEnabled: boolean;
  /** Hora de inicio y fin (inclusive) de la franja de recordatorios de bienestar. */
  wellbeingStart: number;
  wellbeingEnd: number;
  wellbeingEveryHours: number;
  wellbeingKinds: WellbeingKind[];
}

export const DEFAULT_REMINDERS: ReminderPrefs = {
  studyEnabled: false,
  studyHour: 18,
  studyMinute: 0,
  studyWeekdays: [2, 3, 4, 5],
  wellbeingEnabled: false,
  wellbeingStart: 10,
  wellbeingEnd: 20,
  wellbeingEveryHours: 2,
  wellbeingKinds: ['agua', 'pausa', 'estiramiento', 'ojos'],
};

export const WELLBEING_LABELS: Record<WellbeingKind, string> = {
  agua: 'Beber agua',
  pausa: 'Pausa activa',
  estiramiento: 'Estiramientos',
  ojos: 'Descanso visual',
  postura: 'Postura',
};

const WELLBEING_TEXT: Record<WellbeingKind, { title: string; body: string }> = {
  agua: { title: 'Un vaso de agua 💧', body: 'Kata dice: el H₂O también es parte del estudio. ¿Bebes un poco?' },
  pausa: { title: 'Pausa activa', body: 'Levántate un par de minutos y camina. Tu cerebro lo agradece.' },
  estiramiento: { title: 'Hora de estirar', body: 'Estira cuello, hombros y espalda durante un minuto.' },
  ojos: { title: 'Descanso visual', body: 'Mira algo lejano unos 20 segundos para relajar la vista.' },
  postura: { title: 'Revisa tu postura', body: 'Espalda apoyada, pantalla a la altura de los ojos.' },
};

const STUDY_TEXTS = [
  { title: 'Kata te espera 🐱', body: 'Cuando quieras, hay una lección corta lista para ti.' },
  { title: 'Un ratito de química', body: 'Diez minutos cuentan. Y si hoy no puedes, también está bien.' },
  { title: 'Tu laboratorio está abierto', body: 'Kata preparó un repaso para cuando tengas un momento.' },
];

export type PlannedTrigger =
  | { kind: 'weekly'; weekday: number; hour: number; minute: number }
  | { kind: 'daily'; hour: number; minute: number };

export interface PlannedReminder {
  id: string;
  channel: 'estudio' | 'bienestar';
  title: string;
  body: string;
  trigger: PlannedTrigger;
}

const clampInt = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(v)));

export function buildReminderPlan(p: ReminderPrefs): PlannedReminder[] {
  const plan: PlannedReminder[] = [];
  if (p.studyEnabled) {
    const hour = clampInt(p.studyHour, 0, 23);
    const minute = clampInt(p.studyMinute, 0, 59);
    [...new Set(p.studyWeekdays)]
      .filter((d) => d >= 1 && d <= 7)
      .sort((a, b) => a - b)
      .forEach((weekday, i) => {
        const t = STUDY_TEXTS[i % STUDY_TEXTS.length];
        plan.push({ id: `estudio-${weekday}`, channel: 'estudio', ...t, trigger: { kind: 'weekly', weekday, hour, minute } });
      });
  }
  if (p.wellbeingEnabled && p.wellbeingKinds.length) {
    const start = clampInt(p.wellbeingStart, 0, 23);
    const end = clampInt(p.wellbeingEnd, start, 23);
    const every = clampInt(p.wellbeingEveryHours, 1, 12);
    let i = 0;
    for (let hour = start; hour <= end; hour += every) {
      const kind = p.wellbeingKinds[i % p.wellbeingKinds.length];
      plan.push({ id: `bienestar-${hour}`, channel: 'bienestar', ...WELLBEING_TEXT[kind], trigger: { kind: 'daily', hour, minute: 0 } });
      i++;
    }
  }
  return plan;
}
