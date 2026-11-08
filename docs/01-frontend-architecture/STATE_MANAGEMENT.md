# State Management Architecture

## 1. Architecture Overview
OFFER MODE employs a **two-tier state model**:
1. **Global Application Context (`AppContext.tsx`)**: Manages cross-cutting application concerns:
   - User authentication profile and active session token.
   - User preferences (theme mode, 12h/24h time format, sound volume, sound theme).
   - Five core career experiences array (`CareerExperience[]`).
   - Active lock screen state (`isLockScreenActive`, `activeTrackId`).
   - Wallpaper presets (`CountdownDesignPreset[]`).
2. **Domain-Specific Local Persistence (`lifeStorageService.ts`)**:
   - Habits and routine completion logs.
   - Daily hydration logs.
   - Private journal entries and gratitude reflections.
   - Learning roadmaps and skill inventory.
   - Monthly budget categories and savings goals.
   - Bucket list dreams.
   - P.A.R.A. second-brain notes.
   - Planner tasks and focus sessions.

## 2. State Mutation Protocol
State updates are executed through strongly-typed dispatchers in [`src/store/AppContext.tsx`](file:///f:/Countdown-Lock-Screen/src/store/AppContext.tsx). Every state mutation immediately syncs optimistically to `localStorage` via [`src/services/storageService.ts`](file:///f:/Countdown-Lock-Screen/src/services/storageService.ts), ensuring zero data loss on browser refresh.
