# Integration Testing

## 1. Cross-Module Workflows
Integration tests verify seamless handoffs between services:
- `authSecurityService` -> `AppContext` user login session dispatch.
- `habitService` -> `lifeStorageService` LocalStorage persistence.
- `calendarSync` -> RFC 5545 `.ics` string and Google Calendar web link creation.
