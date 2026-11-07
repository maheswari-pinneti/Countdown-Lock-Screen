# OFFER MODE — Web Notifications & Scheduled Reminders

## 1. Overview

OFFER MODE includes a native Web Notification and Reminder Engine (`src/services/notificationService.ts` and `src/features/notifications/NotificationsPage.tsx`).

---

## 2. Browser Notification API Lifecycle

1. **Permission Request**: Triggered only upon explicit user action ("Request Browser Notification Access" button).
2. **Permission States**:
   - `granted`: Dispatches native desktop notifications via `new Notification()`.
   - `default`: Native alerts muted; prompts user when permission is needed.
   - `denied`: Graceful fallback to interactive in-app toast alerts (`<Toast>`).
   - `unsupported`: Emits custom DOM events handled by in-app UI.

---

## 3. Scheduled Reminder Queue

The engine monitors:
- **Target Offer Deadlines**: Flags deadlines due within 48 hours or occurring today.
- **Milestones**: Monitors pending milestones across all 5 career modules.
- **Interview Dates**: Warns users 24 hours and 2 hours prior to scheduled interviews.

### Deduplication
To prevent notification spam, each notification ID is logged in `localStorage` under `offer_mode_seen_reminders_v2`. Once fired, that milestone will not re-trigger on subsequent page loads unless reopened.

---

## 4. Technical Browser Limitations & Truth in Engineering

- **Active Browser Required**: Standard Web Notifications in client-side Single Page Applications execute while Chrome is running and at least one tab is active or backgrounded.
- **Closed Browser**: For alerts when Chrome is completely closed, a persistent background Service Worker or server push protocol (Web Push Protocol via VAPID keys) is required.

