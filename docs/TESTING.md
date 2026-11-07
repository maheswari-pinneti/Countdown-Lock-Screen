# OFFER MODE — Testing & Quality Assurance Guide

## 1. Testing Philosophy

OFFER MODE enforces strict verification across mathematical logic, state persistence, theme configurations, and rendering bounds.

Every engine test runs with **zero mocked calculations**: real timestamps, real dates, real IANA timezone offsets.

---

## 2. Test Suites Summary

### Suite 1: Countdown & Milestone Engine (`scratch/test-suite.mjs`)
- **Total Tests**: 38 Passing
- **Coverage**:
  - Future deadline calculations and date formatting.
  - Due today deadlines with zero remaining days.
  - Expired deadlines with locked 100% progress.
  - Invalid date fallbacks to safe default compact strings.
  - IANA Timezone offsets (UTC, New York UTC-5, Tokyo UTC+9, London UTC+0).
  - Non-random composite progress formula verification.
  - Milestone operations: Add, Edit, Delete, Toggle Complete, Undo, Completion %, Date Sorting.

### Suite 2: Five Complete Career Modules (`scratch/test-five-modules.mjs`)
- **Total Tests**: 60 Passing
- **Coverage**:
  - Module 1 (Interview Countdown): 9 verified preset milestones.
  - Module 2 (30-Day Job Hunt Sprint): 10 verified preset milestones.
  - Module 3 (Developer Skill Upgrade): 10 verified preset milestones.
  - Module 4 (First Job Countdown): 10 verified preset milestones.
  - Module 5 (Career Switch Countdown): 12 verified preset milestones.
  - State persistence isolation across all 5 modules.

### Suite 3: Wallpaper Studio & Themes (`scratch/test-wallpaper-and-themes.mjs`)
- **Total Tests**: 38 Passing
- **Coverage**:
  - Verification of all 5 primary signature themes: `minimal-focus`, `dark-premium`, `motivational-career`, `soft-gradient`, `clean-professional`.
  - Exact resolution checks for 9:16 (1080x1920), 9:19.5 (1080x2340), and 9:20 (1080x2400).
  - Backwards compatibility alias checks (`midnight`, `obsidian`, `electric`, `minimal-light`, `focus`).

---

## 3. How to Execute Tests

```bash
# Run all automated tests
node scratch/test-suite.mjs
node scratch/test-five-modules.mjs
node --experimental-strip-types scratch/test-wallpaper-and-themes.mjs

# Run strict TypeScript compilation check
npx tsc --noEmit

# Run production build validation
npm run build
```

**Grand Total: 136 Unit & Integration Tests Passing (0 Failures).**

