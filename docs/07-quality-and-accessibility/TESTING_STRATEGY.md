# Comprehensive Testing Strategy

## 1. Testing Architecture
OFFER MODE employs a multi-tiered automated verification architecture centered around `npm test` and executed by [`scratch/run-all-tests.mjs`](file:///f:/Countdown-Lock-Screen/scratch/run-all-tests.mjs).

```mermaid
graph TD
    Master["Master Test Runner (run-all-tests.mjs)"]
    S1["Suite 1: Core Countdown & Milestones (38 tests)"]
    S2["Suite 2: Five Career Modules Isolation (38 tests)"]
    S3["Suite 3: Wallpaper Studio & Themes (38 tests)"]
    S4["Suite 4: Calendar Integration & iCal RFC 5545"]
    S5["Suite 5: 7-Provider Multi-Library Icons (75 tests)"]
    S6["Suite 6: PBKDF2 Cryptography & Rate Limiting (12 tests)"]
    S7["Suite 7: Anti-Guilt Habit Streak Engine (5 tests)"]

    Master --> S1
    Master --> S2
    Master --> S3
    Master --> S4
    Master --> S5
    Master --> S6
    Master --> S7
```

All 7 suites execute in under 3 seconds with a strict 100% pass requirement before code can be merged or pushed.
