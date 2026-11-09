/**
 * Recordatorios locales con expo-notifications (no usa servidor ni push remoto).
 * En web no hay soporte: la UI lo indica en vez de fingir que funcionan.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { buildReminderPlan, type PlannedReminder, type ReminderPrefs } from '@/core/notifications/schedule';

export const notificationsSupported = Platform.OS !== 'web';

if (notificationsSupported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export type PermissionResult = 'granted' | 'denied' | 'unsupported';

export async function ensurePermission(): Promise<PermissionResult> {
  if (!notificationsSupported) return 'unsupported';
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return 'granted';
  if (!current.canAskAgain) return 'denied';
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted ? 'granted' : 'denied';
}

function toTrigger(r: PlannedReminder): Notifications.NotificationTriggerInput {
  const channelId = r.channel;
  return r.trigger.kind === 'weekly'
    ? {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: r.trigger.weekday,
        hour: r.trigger.hour,
        minute: r.trigger.minute,
        channelId,
      }
    : { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: r.trigger.hour, minute: r.trigger.minute, channelId };
}

/**
 * Reemplaza todos los recordatorios programados por los del plan actual.
 * Devuelve cuántos quedaron programados (0 si están desactivados o sin permiso).
 */
export async function applyReminders(prefs: ReminderPrefs): Promise<{ scheduled: number; permission: PermissionResult }> {
  if (!notificationsSupported) return { scheduled: 0, permission: 'unsupported' };
  await Notifications.cancelAllScheduledNotificationsAsync();
  const plan = buildReminderPlan(prefs);
  if (!plan.length) return { scheduled: 0, permission: 'granted' };
  const permission = await ensurePermission();
  if (permission !== 'granted') return { scheduled: 0, permission };
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('estudio', {
      name: 'Recordatorios de estudio',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
    await Notifications.setNotificationChannelAsync('bienestar', {
      name: 'Bienestar (agua, pausas, estiramientos)',
      importance: Notifications.AndroidImportance.LOW,
    });
  }
  for (const r of plan) {
    await Notifications.scheduleNotificationAsync({
      identifier: r.id,
      content: { title: r.title, body: r.body },
      trigger: toTrigger(r),
    });
  }
  return { scheduled: plan.length, permission };
}
