/**
 * Web Notifications & Reminder Engine for OFFER MODE
 * Manages browser Notification API, permission requests, scheduled checks,
 * in-app fallback alerts, and deduplication of sent notifications.
 */

export interface ReminderItem {
  id: string;
  trackId: string;
  trackName: string;
  title: string;
  dueDate: string; // ISO or YYYY-MM-DD
  time?: string;
  type: 'interview' | 'job_hunt' | 'study' | 'joining' | 'milestone';
}

export interface NotificationLogEntry {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  trackId?: string;
}

const STORAGE_KEY_NOTIF_LOG = 'offer_mode_notif_log_v2';
const STORAGE_KEY_SEEN_REMINDERS = 'offer_mode_seen_reminders_v2';

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Check whether Browser Notification API is supported
   */
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  /**
   * Current notification permission state
   */
  public getPermission(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  /**
   * Request browser permission to display notifications
   */
  public async requestPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (!this.isSupported()) return 'unsupported';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
      return Notification.permission;
    }
  }

  /**
   * Get past notifications log
   */
  public getLogs(): NotificationLogEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_NOTIF_LOG);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear notification history log
   */
  public clearLogs(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_NOTIF_LOG);
    } catch {}
  }

  private appendLog(entry: NotificationLogEntry): void {
    try {
      const current = this.getLogs();
      const updated = [entry, ...current.slice(0, 49)]; // Keep latest 50
      localStorage.setItem(STORAGE_KEY_NOTIF_LOG, JSON.stringify(updated));
    } catch {}
  }

  private getSeenReminderIds(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SEEN_REMINDERS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private markReminderSeen(id: string): void {
    try {
      const seen = this.getSeenReminderIds();
      if (!seen.includes(id)) {
        seen.push(id);
        localStorage.setItem(STORAGE_KEY_SEEN_REMINDERS, JSON.stringify(seen.slice(-200)));
      }
    } catch {}
  }

  /**
   * Send an immediate or scheduled notification
   */
  public notify(title: string, options?: NotificationOptions & { trackId?: string }): boolean {
    const entry: NotificationLogEntry = {
      id: Date.now().toString(),
      title,
      body: options?.body || '',
      timestamp: new Date().toISOString(),
      trackId: options?.trackId,
    };
    this.appendLog(entry);

    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });
        return true;
      } catch (err) {
        console.warn('Error dispatching browser notification:', err);
      }
    }

    // Fallback: Dispatches custom DOM event for in-app toast handling
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('offer-mode-notification', {
          detail: { title, body: options?.body || '', trackId: options?.trackId },
        })
      );
    }

    return false;
  }

  /**
   * Checks a list of reminders against current time and fires alerts if due within 24 hours.
   */
  public checkUpcomingReminders(reminders: ReminderItem[]): number {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const seen = new Set(this.getSeenReminderIds());
    let triggeredCount = 0;

    for (const item of reminders) {
      if (seen.has(item.id)) continue;

      const dueTimestamp = new Date(item.dueDate).getTime();
      if (isNaN(dueTimestamp)) continue;

      const diff = dueTimestamp - now;

      // Trigger reminder if due within 24 hours or due today
      if (diff >= -oneDayMs && diff <= oneDayMs) {
        const isUrgent = diff <= 2 * 60 * 60 * 1000; // Under 2 hours
        const prefix = isUrgent ? '🚨 URGENT: ' : '🔔 Reminder: ';
        const body = `${item.trackName} — ${item.title} is due ${diff < 0 ? 'today!' : 'soon'}`;

        this.notify(`${prefix}${item.title}`, {
          body,
          trackId: item.trackId,
        });

        this.markReminderSeen(item.id);
        triggeredCount++;
      }
    }

    return triggeredCount;
  }
}

export const notificationService = NotificationService.getInstance();

