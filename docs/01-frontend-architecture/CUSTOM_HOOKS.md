# Custom React Hooks

## 1. Hook Inventory
Custom hooks encapsulate complex reactive side effects and calculations:

### `useCountdownEngine(deadline: string, targetDate: string)`
- **Location**: [`src/hooks/useCountdownEngine.ts`](file:///f:/Countdown-Lock-Screen/src/hooks/useCountdownEngine.ts)
- **Purpose**: High-frequency interval countdown timer. Ticks every 50ms to drive smooth millisecond displays without causing cascading parent re-renders.
- **Output**: Returns `CountdownResult` with days, hours, minutes, seconds, milliseconds, progress percentage, and expiration flag.

### `useMilestoneEngine(experience: CareerExperience)`
- **Location**: [`src/hooks/useMilestoneEngine.ts`](file:///f:/Countdown-Lock-Screen/src/hooks/useMilestoneEngine.ts)
- **Purpose**: Provides milestone CRUD operations, completion toggling, progress aggregation, and sorting.

### `useHotkeys(keyMap: Record<string, () => void>, enabled?: boolean)`
- **Location**: [`src/hooks/useHotkeys.ts`](file:///f:/Countdown-Lock-Screen/src/hooks/useHotkeys.ts)
- **Purpose**: Binds global keyboard shortcuts (e.g., `L` for Lock Screen, `0-5` for navigation, `Escape` for modals). Ignores events originating inside `<input>` or `<textarea>` elements.
