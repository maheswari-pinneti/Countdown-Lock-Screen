# ADR-004: Human-Centered Life Command Center & Anti-Guilt Habit Engine

## Status
Accepted

## Context
OFFER MODE originated as an executive career countdown and lock-screen platform. However, high-stakes career transitions, interview preparation, and skill acquisition do not happen in an emotional vacuum. Candidates and developers frequently experience burnout, anxiety spirals, and guilt when life interruptions derail rigid routines. Traditional productivity systems fail because they reset habit streaks to 0 upon a single missed day, triggering the "what-the-hell" effect where users abandon their entire plan.

## Decision
We transformed OFFER MODE into a comprehensive **Human-Centered Personal Life, Career & Productivity Command Center** with 3 distinct pillars:

### 1. Life Command Center
- **Anti-Guilt Habit Engine (`habitService.ts`)**: Implements the James Clear "Never Miss Twice" behavioral psychology. A 1-day missed habit enters an active "Recovery Mode" rather than an immediate streak annihilation. Designated rest days (e.g. weekends) do not penalize streaks.
- **Private Journal & Mindset Decompression (`JournalPage.tsx`)**: Daily 5-point emotional check-in, 3 research-backed gratitude prompts, and a "Win of the Day" log to build self-efficacy. 100% local-first offline storage.
- **Smart Planner & MITs (`PlannerPage.tsx`)**: Prioritizes daily Most Important Tasks with time estimates and direct linkage to career tracks.
- **Deep Work Focus Hub (`FocusModePage.tsx`)**: Interval Pomodoro flow state with pure HTML5 Web Audio synthesized acoustic soundscapes (Deep Brown Noise, Rain Drizzle, and 4Hz Theta Binaural Beats) with zero external network audio assets.

### 2. Career Command Center (Enhanced)
- **Technical Learning Center (`LearningCenterPage.tsx`)**: Roadmaps for Staff Distributed Systems and AI Systems Engineering with study hour tracking and skill verification.
- **5 Dedicated Career Workstations**: Retained 100% backward compatibility for Interview, 30-Day Job Hunt, Developer Upgrade, First Job, and Career Switch tracks.

### 3. Dreams, Finance & Studio
- **Personal Finance & Career Runway (`FinancePage.tsx`)**: 50/30/20 conscious spending budget and liquid career runway calculator (Months of Freedom = Liquid Savings / Monthly Fixed Burn) with multi-currency support (USD, EUR, GBP, INR, CAD, JPY).
- **Dreams & Bucket List (`DreamsPage.tsx`)**: Life aspirations categorized by Travel, Experience, Creative, and Family with target completion years.
- **Personal Second Brain (`SecondBrainPage.tsx`)**: Tiago Forte's P.A.R.A. model (Projects, Areas, Resources, Archives) with tag indexing and Markdown reading/editing.
- **Global Command Bar (`GlobalCommandBar.tsx`)**: Accessible `⌘K` / `Ctrl+K` spotlight search across all routes, habits, and notes.

## Consequences
- Every feature operates offline-first using local browser persistence without third-party surveillance.
- Code splitting via `React.lazy()` maintains sub-second loads and tight chunk sizes (<16 kB per new route).
- 100% test pass rate across 7 test suites.
