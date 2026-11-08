# Calendar Integration & RFC 5545 (.ics)

## 1. RFC 5545 Compliance
Implemented in [`src/utils/calendarSync.ts`](file:///f:/Countdown-Lock-Screen/src/utils/calendarSync.ts):
- Generates compliant `.ics` iCalendar files with `BEGIN:VCALENDAR`, `UID`, `SUMMARY`, and `DTSTART`.
- Provides 1-click Google Calendar web creation links.
