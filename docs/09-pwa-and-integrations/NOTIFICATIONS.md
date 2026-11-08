# Notification Engine & In-App Alerts

## 1. Notification Architecture
Implemented in [`src/services/notificationService.ts`](file:///f:/Countdown-Lock-Screen/src/services/notificationService.ts):
- Requests standard `Notification.requestPermission()`.
- Respects user-configured **Quiet Hours** (e.g. 10 PM - 7 AM).
- Dispatches in-app `Toast` components when background notifications are blocked by the OS.
