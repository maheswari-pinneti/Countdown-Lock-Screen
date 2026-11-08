# Countdown Calculation Engine

## 1. Purpose & Accuracy
The countdown engine ([`src/utils/countdownEngine.ts`](file:///f:/Countdown-Lock-Screen/src/utils/countdownEngine.ts), [`src/hooks/useCountdownEngine.ts`](file:///f:/Countdown-Lock-Screen/src/hooks/useCountdownEngine.ts)) computes exact time deltas without relying on drifting interval math.

## 2. Algorithm
```typescript
const diffMs = Math.max(0, targetTimeMs - currentTimeMs);
const days = Math.floor(diffMs / 86400000);
const hours = Math.floor((diffMs % 86400000) / 3600000);
const minutes = Math.floor((diffMs % 3600000) / 60000);
const seconds = Math.floor((diffMs % 60000) / 1000);
const milliseconds = Math.floor(diffMs % 1000);
```
- Formats digits with zero-padding (`05d 14h 22m 09s`).
- Computes non-random, deterministic progress percentages based on start, current, and target dates.
