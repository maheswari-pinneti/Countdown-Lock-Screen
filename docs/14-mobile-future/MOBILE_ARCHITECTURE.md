# Future Mobile Architecture (React Native + Expo)

## 1. Architectural Strategy
OFFER MODE is architected so that core calculation engines, types, and services can be shared directly with a future **React Native + Expo** mobile application:

```
Shared Core (TypeScript)
├── Types (src/types/index.ts)
├── Countdown Engine (src/utils/countdownEngine.ts)
├── Habit Recovery Engine (src/services/habitService.ts)
├── Calendar Sync (src/utils/calendarSync.ts)
└── Finance Runway Math (src/features/finance/FinancePage.tsx)
```
