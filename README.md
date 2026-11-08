# 🎯 Mahi - Countdown-Screen
### Personal Life, Career & Productivity Command Center (OFFER MODE)

[![CI / Build & Verification](https://github.com/maheswari-pinneti/Countdown-Lock-Screen/actions/workflows/ci.yml/badge.svg)](https://github.com/maheswari-pinneti/Countdown-Lock-Screen/actions/workflows/ci.yml)
[![Tests Passing](https://img.shields.io/badge/tests-8%20suites%20passing-brightgreen.svg)](https://github.com/maheswari-pinneti/Countdown-Lock-Screen)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![License MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

**Mahi - Countdown-Screen** (OFFER MODE) is an enterprise-grade, human-centered **Personal Life, Career & Productivity Command Center**. It unites daily habit routines, mental well-being, financial runway, and career countdown workstations into a calm, unified, local-first web application.

Every deadline deserves a plan. Every goal deserves progress.

---

## 🌟 The Three Unified Command Centers

```
OFFER MODE COMMAND HUB
├── 🌟 Life Command Center
│   ├── Routines & Habits (/life) — Anti-guilt "Never miss twice" streak engine & hydration
│   ├── Private Journal (/journal) — 5-point mood tracker, 3 gratitudes & Win of the Day
│   ├── Daily Planner (/planner) — High-impact MITs, time blocks & subtask check-offs
│   └── Deep Work & Focus (/focus) — Pomodoro sprints & pure Web Audio ambient hums
│
├── 💼 Career Command Center (Enhanced)
│   ├── All Countdowns (/countdowns) — Live lock-screen countdown clocks & deadlines
│   ├── Learning Center (/learning) — Technical roadmaps (Staff Systems, AI Architecture)
│   ├── 30-Day Job Hunt Sprint (/job-hunt) — Outreach pipeline & application tracker
│   ├── Interview Workstation (/interview) — STAR story vault & behavioral prep
│   ├── Developer Upgrade (/developer) — Daily deep-work engineering syllabus
│   ├── First Tech Job (/first-job) — Campus placement & 90-day onboarding roadmap
│   ├── Strategic Career Switch (/career-switch) — Pivot roadmap & capstone tracker
│   └── Career Role Directory (/directory) — Benchmark compensation & personas
│
└── 🚀 Dreams, Finance & Studio
    ├── Finance & Runway (/finance) — 50/30/20 budget & career runway months calculator
    ├── Dreams & Bucket List (/dreams) — Travel, creative, experience & purchase aspirations
    ├── Second Brain (/second-brain) — Tiago Forte P.A.R.A. knowledge vault (offline markdown)
    ├── Wallpaper Studio (/countdown-studio) — 1080p lock-screen PNG generator
    ├── Saved Presets (/saved-designs) — Custom typography & theme templates
    ├── Platform Showcase (/showcase) — Multi-library icon explorer & audit proof
    ├── Settings & Security (/settings) — PBKDF2 cryptography, WebAuthn & backups
    └── Help & Documentation (/help) — Architecture decision records & FAQs
```

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

## ⌨️ Executive Keyboard Shortcuts

- <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> : Launch Global Spotlight Command Bar
- <kbd>L</kbd> : Launch ambient full-screen lock screen workstation
- <kbd>0</kbd> : Navigate to Dashboard Overview
- <kbd>1</kbd> : Interview Countdown
- <kbd>2</kbd> : 30-Day Job Hunt Sprint
- <kbd>3</kbd> : Developer Skill Upgrade
- <kbd>4</kbd> : First Job Countdown
- <kbd>5</kbd> : Career Switch Countdown
- <kbd>ESC</kbd> : Close modals & dialogs

---

## 🛠️ Technology Stack & Performance

- **Framework**: React 18 with TypeScript (Strict mode enabled)
- **Bundler & Dev Server**: Vite 6 (Manual chunks: vendor-react, vendor-icons)
- **Routing**: React Router v7 with route-level code-splitting
- **Styling**: Tailwind CSS & CSS3 Design Tokens
- **Icon Engine**: 7-provider vector icon registry (zero external CDN links)
- **Audio Synthesis**: Pure HTML5 Web Audio API Procedural Synthesizer
- **Security**: PBKDF2 HMAC-SHA256 key derivation + genuine W3C WebAuthn hardware passkeys
- **Storage**: Local-First `window.localStorage` with schema recovery pipeline
- **Bundle Performance**: Entry bundle **186.03 kB (56.05 kB gzip)**

---

## 🧪 Testing & Quality Assurance

```bash
# 1. Run Complete Test Suite (7 suites across career & life modules)
npm test

# 2. Strict TypeScript Typecheck (0 errors)
npm run typecheck

# 3. Production Web Build (Optimized chunk splitting)
npm run build
```

---

## 📚 Complete Frontend Engineering Documentation (`docs/`)

The exhaustive 15-section frontend engineering documentation suite is maintained in [`docs/`](./docs/README.md):

| Section | Focus Areas | Guide Link |
| :--- | :--- | :--- |
| **00. Project Context** | Product mission, core pillars, requirements, tech stack | [View Context Docs](./docs/00-project-context/PROJECT_OVERVIEW.md) |
| **01. Frontend Architecture** | Component hierarchy, router, state, services, error handling | [View Architecture Docs](./docs/01-frontend-architecture/FRONTEND_ARCHITECTURE.md) |
| **02. Design System** | Tokens, color palette, typography, 7-library vector icons | [View Design System Docs](./docs/02-design-system/DESIGN_SYSTEM.md) |
| **03. UI Components** | Component inventory, buttons, modals, cards, visualizations | [View UI Component Docs](./docs/03-ui-components/COMPONENT_INVENTORY.md) |
| **04. Feature Modules** | Life center, countdowns, planner, journal, finance, second brain | [View Feature Module Docs](./docs/04-feature-modules/DASHBOARD.md) |
| **05. Data Management** | Local-first data flow, schema models, storage, migrations | [View Data Management Docs](./docs/05-frontend-data-management/DATA_FLOW.md) |
| **06. Performance** | Code splitting, lazy loading, chunk optimization, CWV | [View Performance Docs](./docs/06-frontend-performance/PERFORMANCE_STRATEGY.md) |
| **07. Quality & A11y** | 7-suite testing architecture, WCAG 2.1 AA, QA checklist | [View Quality & A11y Docs](./docs/07-quality-and-accessibility/TESTING_STRATEGY.md) |
| **08. Frontend Security** | PBKDF2 cryptography, WebAuthn passkeys, privacy sovereignty | [View Security Docs](./docs/08-frontend-security/FRONTEND_SECURITY.md) |
| **09. PWA & Integrations** | Service Worker, offline cache, Web Audio API, iCalendar RFC 5545 | [View PWA & API Docs](./docs/09-pwa-and-integrations/PWA_ARCHITECTURE.md) |
| **10. Development Workflow** | Coding standards, naming conventions, Git branching, debug guide | [View Workflow Docs](./docs/10-development-workflow/CODING_STANDARDS.md) |
| **11. AI Development** | Google Antigravity protocols, coding rules, prompt library | [View AI Dev Docs](./docs/11-ai-assisted-development/ANTIGRAVITY_INSTRUCTIONS.md) |
| **12. Deployment** | Local setup, environment config, build pipeline, release steps | [View Deployment Docs](./docs/12-deployment/DEPLOYMENT_GUIDE.md) |
| **13. Project Tracking** | Feature backlog, implementation matrix, roadmap, bug tracker | [View Tracking Docs](./docs/13-project-tracking/IMPLEMENTATION_STATUS.md) |
| **14. Mobile Future** | React Native + Expo shared core, Android/iOS native widgets | [View Mobile Docs](./docs/14-mobile-future/MOBILE_ARCHITECTURE.md) |
| **Master Index** | Complete documentation directory table of contents | [Master Documentation Hub](./docs/README.md) |
