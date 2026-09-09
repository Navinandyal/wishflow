// Local Notification System for WishFlow AI
// Manages Web Notifications API, Web Audio chime, and morning scheduling

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermissionState(): NotificationPermissionState {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission as NotificationPermissionState;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const result = await Notification.requestPermission();
    return result as NotificationPermissionState;
  } catch {
    return getNotificationPermissionState();
  }
}

// Gentle pleasant morning celebration chime using Web Audio API
export function playMorningChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Notes: C5 (523.25Hz) -> E5 (659.25Hz) -> G5 (783.99Hz) -> C6 (1046.5Hz)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.14);

      gain.gain.setValueAtTime(0, now + index * 0.14);
      gain.gain.linearRampToValueAtTime(0.18, now + index * 0.14 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.14 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.14);
      osc.stop(now + index * 0.14 + 0.5);
    });
  } catch {
    // Gracefully ignore audio errors if blocked by browser policy
  }
}

export interface SendBrowserNotificationOptions {
  title: string;
  body: string;
  tag?: string;
  icon?: string;
  data?: Record<string, unknown>;
  onClick?: () => void;
}

export function sendBrowserNotification({
  title,
  body,
  tag = 'wishflow-birthday-alert',
  icon,
  onClick,
}: SendBrowserNotificationOptions): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  try {
    const notif = new Notification(title, {
      body,
      tag,
      icon: icon || '/favicon.ico',
      badge: icon || '/favicon.ico',
      silent: false,
    });

    notif.onclick = () => {
      window.focus();
      notif.close();
      if (onClick) onClick();
    };

    return notif;
  } catch (err) {
    console.warn('Browser notification error:', err);
    return null;
  }
}

const STORAGE_KEY_MORNING_LOG = 'wishflow_morning_alerts_log_v1';

export interface MorningAlertRecord {
  date: string; // YYYY-MM-DD
  customerIds: string[];
  timestamp: string;
}

export function getMorningAlertLog(): MorningAlertRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MORNING_LOG);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function hasAlertedToday(dateStr: string, currentCustomerIds: string[]): boolean {
  if (currentCustomerIds.length === 0) return true;
  const log = getMorningAlertLog();
  const todayEntry = log.find((entry) => entry.date === dateStr);
  if (!todayEntry) return false;
  // If all of today's birthday customers were already alerted, skip
  return currentCustomerIds.every((id) => todayEntry.customerIds.includes(id));
}

export function recordMorningAlert(dateStr: string, customerIds: string[]): void {
  try {
    const log = getMorningAlertLog();
    const existingIndex = log.findIndex((entry) => entry.date === dateStr);
    if (existingIndex >= 0) {
      const mergedIds = Array.from(new Set([...log[existingIndex].customerIds, ...customerIds]));
      log[existingIndex] = {
        date: dateStr,
        customerIds: mergedIds,
        timestamp: new Date().toISOString(),
      };
    } else {
      log.unshift({
        date: dateStr,
        customerIds,
        timestamp: new Date().toISOString(),
      });
    }
    // Keep only last 30 days
    localStorage.setItem(STORAGE_KEY_MORNING_LOG, JSON.stringify(log.slice(0, 30)));
  } catch {
    // Ignore storage quota error
  }
}

export function clearMorningAlertLog(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_MORNING_LOG);
  } catch {
    // ignore
  }
}
