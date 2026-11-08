# OFFER MODE — Master Testing Plan & Verification Architecture

**Product:** OFFER MODE — Personal Life, Career & Productivity Command Center  
**Verification Target:** 100% Automated Test Pass Rate & Zero Regressions  
**Date:** November 2026  

---

## 1. Testing Architecture & Verification Philosophy

OFFER MODE enforces a strict **Zero-Regression Policy**:
- **No Fabricated Tests:** Test counts and assertions reflect actual code execution.
- **Fast, Deterministic Node.js Test Harness:** Automated test suites execute in seconds via lightweight ES module test runners (`node scratch/run-all-tests.mjs`), ensuring instantaneous feedback before every commit and in GitHub Actions CI.
- **Layered Verification Pyramid:**
  1. **Unit & Calculation Engine Tests:** Mathematical precision of time, offsets, leap years, DST, countdowns, streaks, financial formulas.
  2. **Domain Model & State Tests:** Milestone CRUD, stage migrations, application pipeline transitions, habit completion cycles.
  3. **Export & Interoperability Tests:** RFC 5545 iCalendar (`.ics`), Google Calendar URLs, JSON backups, HTML5 Canvas resolution calculations.
  4. **Security & Cryptographic Tests:** Web Crypto PBKDF2 password derivation, WebAuthn option generation, session lifecycle.

---

## 2. Current Baseline Test Suite (138 Tests Passing)

The current test suite runs across 4 distinct test runners orchestrated by `scratch/run-all-tests.mjs`:

```
============================================================
🎯 OFFER MODE MASTER VERIFICATION RUNNER
Running 4 Test Suites across all 5 Career Workstations...
============================================================
✓ Suite 1: Countdown & Milestone Engine (38 tests)
✓ Suite 2: Five Complete Career Modules (60 tests)
✓ Suite 3: Wallpaper Studio & Themes (38 tests)
✓ Suite 4: Calendar Integration & .ics Engine (2 tests)
------------------------------------------------------------
TOTAL: 138 PASSED, 0 FAILED (100% SUCCESS RATE)
============================================================
```

### Breakdown by Test Suite

| Test Suite File | Domain Covered | Assertions |
|:---|:---|:---|
| `scratch/test-countdown-engine.mjs` | Future, today, and expired deadlines; invalid date fallbacks; IANA timezones (New York, Tokyo, London); leap years; non-random progress math; milestone engine operations (add, edit, toggle, delete, sort, filter). | **38 tests** |
| `scratch/test-career-modules.mjs` | Validation of all 5 career modules (Interview, Job Hunt, Developer, First Job, Career Switch); milestone counts; countdown execution; state persistence isolation; completion percentages. | **60 tests** |
| `scratch/test-wallpaper-themes.mjs` | Verification of 5 signature themes (Minimal Focus, Dark Premium, Motivational, Soft Gradient, Clean Pro); hex color validity; aspect ratio dimensions (9:16, 9:19.5, 9:20); backwards-compatible aliases. | **38 tests** |
| `scratch/test-calendar-sync.mjs` | RFC 5545 `.ics` formatting compliance (`BEGIN:VCALENDAR`, `VEVENT`, `UID`, `SUMMARY`, `DTSTART`); Google Calendar 1-click URL encoding. | **2 tests** |

---

## 3. Expansion Plan: Testing the Life, Productivity & Security Modules

As OFFER MODE evolves into a complete command center, new test suites will be introduced in `scratch/` and wired into `run-all-tests.mjs`:

### Suite 5: Security & Cryptographic Authentication (`scratch/test-security-auth.mjs`)
* **Test Cases:**
  1. PBKDF2 key derivation generates consistent hash given matching password and salt.
  2. PBKDF2 generates different hashes with different salts.
  3. Rejects incorrect password verification.
  4. Generates cryptographically secure 16-byte random salts.
  5. WebAuthn option builder sets required RP name, user ID buffer, and public-key algorithms without synthetic fallbacks.
  6. Session expiry calculation correctly invalidates expired tokens.

### Suite 6: Daily Habits & Recovery Engine (`scratch/test-habit-engine.mjs`)
* **Test Cases:**
  1. Calculates daily completion percentage accurately.
  2. Increments streak when consecutive days are completed.
  3. "Never miss twice" habit recovery: allows single missed day without resetting streak to zero when configured for flexible habits.
  4. Recognizes scheduled rest days (e.g., weekend rest days) without marking habits as missed.
  5. Habit history correctly tracks 30-day completion matrix.

### Suite 7: Personal Finance & Budget Calculations (`scratch/test-finance-engine.mjs`)
* **Test Cases:**
  1. Calculates monthly savings rate: $\text{Savings Rate} = \frac{\text{Income} - \text{Expenses}}{\text{Income}} \times 100\%$.
  2. Tracks progress toward emergency fund milestone.
  3. Debt payoff amortization calculates remaining payments accurately.
  4. Compares job offer total compensation (Base + Bonus + Equity - Taxes/Cost of Living).

### Suite 8: Deep Work & Pomodoro Engine (`scratch/test-focus-engine.mjs`)
* **Test Cases:**
  1. Work interval countdown correctly computes remaining minutes/seconds.
  2. Transitions automatically between focus session and short/long breaks.
  3. Aggregates daily focus hours without floating-point rounding errors.

### Suite 9: Second Brain & Search Indexer (`scratch/test-search-engine.mjs`)
* **Test Cases:**
  1. Indexes notes, milestones, applications, and habits.
  2. Queries search index with partial keyword matching.
  3. Filters by tags, categories, and archive status.

---

## 4. Continuous Integration & Verification Pipeline

Every automated test suite is verified both locally and remotely in GitHub Actions (`.github/workflows/ci.yml`):

```yaml
name: CI / Build & Verification

on:
  push:
    branches: [ main, feature/** ]
  pull_request:
    branches: [ main ]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
```

---

## 5. Verification Checklist for Each Stage

Before any stage is considered complete:
- [ ] `npm run typecheck` exits with 0 errors.
- [ ] `npm test` passes all tests across all active test suites.
- [ ] `npm run build` completes production bundle without errors.
- [ ] No regressions in existing routes, components, or storage schemas.
- [ ] Tested on modern Chromium/Firefox/WebKit rendering engines.
