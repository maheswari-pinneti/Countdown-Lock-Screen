# OFFER MODE — Shared Countdown Engine Specification

## 1. Engine Purpose

The OFFER MODE Countdown Engine (`src/utils/countdownEngine.ts` and `src/hooks/useCountdownEngine.ts`) is a high-precision, timezone-aware calculation core shared across all five career modules and the ambient lock-screen workstations.

It guarantees:
- **No Duplicate Logic**: All five experiences utilize the same calculation functions.
- **Sub-Second Precision**: Millisecond resolution for ambient full-screen displays.
- **Accurate Timezone Calculations**: Handles standard IANA timezones (UTC, America/New_York, Europe/London, Asia/Tokyo, Asia/Kolkata).
- **Leap Year & Daylight Saving Protection**: Accounts for variable month lengths and daylight saving offsets.

---

## 2. API Reference

### `calculateCountdownEngine`

```typescript
export function calculateCountdownEngine(
  targetDateStr: string,
  startDateStr?: string,
  timeZone: string = 'Local',
  deadlineTime: string = '18:00',
  completedMilestones: number = 0,
  totalMilestones: number = 0
): CountdownEngineResult
```

### Return Value (`CountdownEngineResult`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `days` | `number` | Integer days remaining |
| `hours` | `number` | Integer hours remaining (0-23) |
| `minutes` | `number` | Integer minutes remaining (0-59) |
| `seconds` | `number` | Integer seconds remaining (0-59) |
| `milliseconds` | `number` | Integer milliseconds remaining (0-999) |
| `totalSeconds` | `number` | Total continuous seconds remaining |
| `isExpired` | `boolean` | `true` if target deadline is in the past |
| `isToday` | `boolean` | `true` if target deadline falls within today's calendar day |
| `isUrgent` | `boolean` | `true` if remaining time is under 48 hours |
| `deadlineStatus` | `DeadlineStatus` | `'future' \| 'today' \| 'urgent' \| 'expired' \| 'invalid'` |
| `formatted` | `object` | Zero-padded strings: `{ days, hours, minutes, seconds, milliseconds, compact }` |
| `timelineProgressPercentage` | `number` | Progress based on elapsed calendar time (0 - 100%) |
| `milestoneProgressPercentage` | `number` | Progress based on completed checklist items (0 - 100%) |
| `compositeProgressPercentage`| `number` | Weighted composite score: $0.5 \times \text{Timeline} + 0.5 \times \text{Milestone}$ |

---

## 3. Deadline Status Matrix

| Status | Trigger Condition | UI Treatment |
| :--- | :--- | :--- |
| `future` | Total seconds remaining > 172,800 (> 2 days) | Cyan / Brand Accent theme |
| `urgent` | Total seconds remaining between 0 and 172,800 | Amber pulsing indicator |
| `today` | Deadline occurs within current calendar day | High-priority alert banner |
| `expired` | Current timestamp > Target timestamp | "DEADLINE REACHED" banner; progress locked at 100% |
| `invalid` | Unparseable date string | Safe fallback displaying `00:00:00` |

