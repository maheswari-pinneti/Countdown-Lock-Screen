# 🎯 OFFER MODE — Executive Career Platform & Lock Screen Hub

[![CI / Build & Verification](https://github.com/maheswari-pinneti/Countdown-Lock-Screen/actions/workflows/ci.yml/badge.svg)](https://github.com/maheswari-pinneti/Countdown-Lock-Screen/actions/workflows/ci.yml)
[![Tests Passing](https://img.shields.io/badge/tests-136%20passing-brightgreen.svg)](https://github.com/maheswari-pinneti/Countdown-Lock-Screen)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![License MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

**OFFER MODE** is a production-ready, web-first career countdown application, goal-tracking system, and lock-screen wallpaper studio designed for Google Chrome and modern web browsers.

Every deadline deserves a plan. Every goal deserves progress.

---

## 🚀 The 5 Core Career Modules

1. **Interview Countdown (`/interview`)**  
   Target high-stakes technical, coding, HR, and managerial interviews. Track interview types, meeting links, preparation notes, round status pipelines, and live millisecond countdowns.

2. **30-Day Job Hunt Sprint (`/job-hunt`)**  
   High-velocity job search sprint. Set daily application targets, recruiter follow-up schedules, resume polish tasks, and pipeline milestones.

3. **Developer Skill Upgrade (`/developer`)**  
   Level up technical mastery (React, TypeScript, Node.js, Python, DSA, System Design). Track daily study targets, practice milestones, and leveling goals.

4. **First Job Countdown (`/first-job`)**  
   Tailored for campus graduates and junior professionals. Manage joining dates, onboarding documentation, relocation, and day-one readiness.

5. **Career Switch Countdown (`/career-switch`)**  
   Pivot into a new technology stack or industry. Manage bridge portfolios, transferable skill roadmaps, and transition runway.

---

## 🎨 Countdown Studio & Lock-Screen Wallpapers

Customize and export high-resolution lock-screen wallpapers with live countdown stats:

### The 5 Signature Themes
- **Minimal Focus**: Distraction-free monochrome with massive countdown numerals and sky-blue accent.
- **Dark Premium**: Pitch black obsidian with executive metallic gold and silver accents.
- **Motivational Career**: High-energy electric cyan and navy cyber gradient with motivational career quote banner.
- **Soft Gradient**: Lush twilight violet to midnight indigo pastel gradient with frosted glass cards.
- **Clean Professional**: Crisp corporate slate layout with cobalt blue highlights and tabular milestone rows.

### Native Phone Clock Safe-Zone
Canvas rendering includes a 260px native clock safe area, ensuring that your iPhone or Android lock-screen clock aligns cleanly without blocking countdown text.

### Real PNG Wallpaper Export
Renders directly to HTML5 Canvas at full smartphone resolutions:
- **1080 × 1920 px** (Standard 9:16)
- **1080 × 2340 px** (iPhone 9:19.5)
- **1080 × 2400 px** (Android 9:20)

---

## ⚡ Application Navigation (12 Functional Routes)

1. **Dashboard** (`/`) — Real-time metrics, active cards, upcoming deadlines, and recent countdown tickers.
2. **My Countdowns** (`/countdowns`) — Overview of active countdown workstations.
3. **Interview Countdown** (`/interview`) — Dedicated interview module.
4. **30-Day Job Hunt Sprint** (`/job-hunt`) — Sprint tracking and daily targets.
5. **Developer Skill Upgrade** (`/developer`) — Skill roadmap and study hours.
6. **First Job Countdown** (`/first-job`) — Offer and onboarding checklist.
7. **Career Switch Countdown** (`/career-switch`) — Career pivot roadmap.
8. **Countdown Studio** (`/countdown-studio`) — Interactive wallpaper customization studio.
9. **Saved Designs** (`/saved-designs`) — Saved wallpaper design presets library.
10. **Notifications** (`/notifications`) — Web notifications and reminder scheduling.
11. **Settings** (`/settings`) — Theme (Dark/Light), audio synthesis, time format, and JSON backup/restore.
12. **Help & About** (`/help`) — Documentation, keyboard shortcuts, and engine guide.

---

## ⌨️ Executive Keyboard Shortcuts

- <kbd>L</kbd> : Launch ambient full-screen lock screen workstation
- <kbd>0</kbd> : Navigate to Dashboard Overview
- <kbd>1</kbd> : Interview Countdown
- <kbd>2</kbd> : 30-Day Job Hunt Sprint
- <kbd>3</kbd> : Developer Skill Upgrade
- <kbd>4</kbd> : First Job Countdown
- <kbd>5</kbd> : Career Switch Countdown
- <kbd>ESC</kbd> : Exit full-screen mode

---

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript (Strict mode)
- **Bundler & Dev Server**: Vite 6
- **Routing**: React Router v7
- **Styling**: Tailwind CSS & CSS3 Design Tokens
- **Icons**: Lucide React
- **Audio Synthesis**: Web Audio API Procedural Synthesizer
- **Notifications**: Browser Notification API with In-App Fallback
- **Rendering**: HTML5 Canvas offscreen high-density PNG export
- **Storage**: Local-First `window.localStorage` with schema v2 versioning

---

## 🧪 Testing & Quality Assurance

```bash
# 1. Run Complete Test Suite (136 tests across all 3 suites)
npm test

# 2. Strict TypeScript Typecheck
npm run typecheck

# 3. Production Web Build
npm run build
```

**136 Passing Tests — 0 Failures — 0 TypeScript Errors.**

---

## 📱 Future Mobile Roadmap

OFFER MODE is delivered as a complete web application first. All business logic, countdown math, milestone state handling, and data models are strictly decoupled from DOM APIs to enable direct sharing with a future React Native + Expo mobile application. See [FUTURE_MOBILE_ROADMAP.md](./docs/FUTURE_MOBILE_ROADMAP.md) for architecture details.

---

## 📄 Documentation Directory (`docs/`)

The full documentation suite is maintained in the dedicated [`docs/`](./docs/README.md) directory:

- 📖 **[Documentation Hub (docs/README.md)](./docs/README.md)** — Master documentation index
- 📐 **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — System architecture, decoupling, and directory design
- 💻 **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** — Developer setup, available scripts, and workflow
- ⏱️ **[COUNTDOWN_ENGINE.md](./docs/COUNTDOWN_ENGINE.md)** — Mathematical formulas, timezone handling, and progress logic
- 🎨 **[COUNTDOWN_STUDIO.md](./docs/COUNTDOWN_STUDIO.md)** — Wallpaper studio, 5 theme specs, and canvas rendering
- 💾 **[STORAGE.md](./docs/STORAGE.md)** — Local storage schema v2, backup/restore, and privacy guarantee
- 🔔 **[NOTIFICATIONS.md](./docs/NOTIFICATIONS.md)** — Browser Notification API lifecycle and reminder queue
- 🧪 **[TESTING.md](./docs/TESTING.md)** — 136-test automated verification suite and coverage
- ⚠️ **[KNOWN_ISSUES.md](./docs/KNOWN_ISSUES.md)** — Browser limitations and architectural resolutions
- 🚀 **[FUTURE_MOBILE_ROADMAP.md](./docs/FUTURE_MOBILE_ROADMAP.md)** — Mobile handover & React Native reuse strategy
- 📊 **[PROJECT_STATUS.md](./docs/PROJECT_STATUS.md)** — Feature implementation & verification status tracker
