# Service Layer & Domain Isolation

## 1. Service Responsibilities
The `src/services/` directory contains isolated, singleton service modules with zero coupling to React component rendering:

| Service File | Domain Responsibility |
| :--- | :--- |
| [`authSecurityService.ts`](file:///f:/Countdown-Lock-Screen/src/services/authSecurityService.ts) | Cryptographic salt generation, PBKDF2 hashing, brute-force rate-limiting, and session token lifecycle. |
| [`passkeyService.ts`](file:///f:/Countdown-Lock-Screen/src/services/passkeyService.ts) | W3C WebAuthn hardware authenticator challenge generation and credential verification. |
| [`habitService.ts`](file:///f:/Countdown-Lock-Screen/src/services/habitService.ts) | Anti-guilt habit streak calculation, "never miss twice" recovery mode, and rest day math. |
| [`ambientAudioService.ts`](file:///f:/Countdown-Lock-Screen/src/services/ambientAudioService.ts) | Web Audio oscillator and filter graph synthesizer for focus soundscapes. |
| [`soundEngine.ts`](file:///f:/Countdown-Lock-Screen/src/services/soundEngine.ts) | UI tactile feedback audio (key clicks, chimes, timer countdown alerts). |
| [`notificationService.ts`](file:///f:/Countdown-Lock-Screen/src/services/notificationService.ts) | Browser notification permission checks, quiet hours filtering, and in-app toast dispatching. |
| [`storageService.ts`](file:///f:/Countdown-Lock-Screen/src/services/storageService.ts) | Career experiences, app settings, and wallpaper preset persistence. |
| [`lifeStorageService.ts`](file:///f:/Countdown-Lock-Screen/src/services/lifeStorageService.ts) | Habits, routines, journal, planner, finance, and second-brain persistence. |
| [`loggerService.ts`](file:///f:/Countdown-Lock-Screen/src/services/loggerService.ts) | Client-side structured logger with circular in-memory ring buffer (150 entries). |
| [`featureFlagService.ts`](file:///f:/Countdown-Lock-Screen/src/services/featureFlagService.ts) | Runtime feature flag switches with local override support. |
