# OFFER MODE Architecture Specification

## 1. Overview & Architectural Philosophy

OFFER MODE is built as a high-performance, web-first Single Page Application (SPA) designed to run natively inside Google Chrome and modern desktop/mobile web browsers.

### Key Architectural Tenets
1. **Decoupled Core Engines**: Countdown calculations, milestone operations, and storage services are pure TypeScript functions decoupled from the DOM. This ensures 100% testability and prepares the codebase for future React Native mobile reusability without refactoring business logic.
2. **Determinism & Math Integrity**: Zero random numbers. Progress bars represent mathematical truths: elapsed timeline duration (50%) and validated milestone completion (50%).
3. **Local-First Privacy**: 100% client-side persistence in LocalStorage with JSON schema versioning and zero third-party telemetry.
4. **Pixel-Perfect Canvas Rendering**: High-resolution wallpaper export utilizes HTML5 Canvas rendering at full smartphone resolutions (1080x1920, 1080x2340, 1080x2400) rather than relying on brittle DOM-to-image screenshotting.

---

## 2. Directory Structure

```
src/
├── app/
│   ├── App.tsx             # Root Application container
│   ├── providers.tsx       # Context and Store providers
│   └── router.tsx          # React Router v7 browser routes (12 routes)
│
├── components/
│   ├── common/             # Reusable UI primitives (Button, Card, Badge, Modal, Input)
│   ├── layout/             # Layout components (AppLayout, TrackHeader, TrackRoadmap)
│   ├── navigation/         # Fixed Sidebar and Sticky TopNav
│   ├── feedback/           # Alert, EmptyState, ErrorBoundary, Toast
│   ├── modules/            # Domain-specific module forms & completion banners
│   └── studio/             # Live wallpaper preview canvas and device frames
│
├── features/
│   ├── overview/           # Executive Dashboard with live tickers & metrics
│   ├── interview/          # Interview Countdown module
│   ├── job-hunt/           # 30-Day Job Hunt Sprint module
│   ├── developer/          # Developer Skill Upgrade module
│   ├── first-job/          # First Job Countdown module
│   ├── career-switch/      # Career Switch Countdown module
│   ├── countdown-studio/   # Customization studio & 5 wallpaper themes
│   ├── lockscreen/         # Ambient fullscreen lock screen workstation
│   ├── saved-designs/      # Saved design presets library
│   ├── notifications/      # Web notifications & reminder management
│   ├── settings/           # Theme, sound, and system preferences
│   └── help/               # Documentation, keyboard shortcuts, and about guide
│
├── hooks/
│   ├── useCountdownEngine.ts # Shared countdown engine hook
│   ├── useMilestoneEngine.ts # Shared milestone engine hook
│   └── useHotkeys.ts         # Global keyboard shortcuts hook
│
├── services/
│   ├── notificationService.ts # Browser Notification API & reminder scheduler
│   ├── soundEngine.ts         # Web Audio API procedural sound synthesizers
│   └── storageService.ts      # LocalStorage schema v2 & backup/restore
│
├── styles/
│   └── theme.css              # Light & dark theme CSS variables and tokens
│
├── types/
│   └── index.ts               # Core domain interfaces and type definitions
│
└── utils/
    ├── countdownEngine.ts     # Pure timestamp, timezone & milestone math
    ├── wallpaperGenerator.ts  # Canvas 1080x1920 lock-screen wallpaper renderer
    ├── storage.ts             # Safe LocalStorage accessors
    └── date.ts                # Date formatting and difference utilities
```

---

## 3. Core State Management & React Context

The application utilizes a lightweight, highly responsive React Context (`AppContext`) combined with LocalStorage auto-persistence:

- **Reactive State**: `experiences` (array of 5 career modules), `settings` (theme, sound, time format), `presets` (wallpaper design presets), and `isLockScreenActive` (ambient mode).
- **Auto-Persistence**: `useEffect` hooks trigger `storageService` writes upon state changes.
- **Atomic Updates**: Modules update their state independently, ensuring that changes to Interview Countdown do not pollute Job Hunt Sprint data.

---

## 4. Shared Countdown & Milestone Engines

- **`calculateCountdownEngine(targetDate, startDate, timeZone, deadlineTime, completedMilestones, totalMilestones)`**:
  - Resolves target timestamps against specified IANA timezones (e.g., UTC, America/New_York, Asia/Kolkata).
  - Determines countdown state (`future`, `today`, `urgent`, `expired`, `invalid`).
  - Computes non-random composite progress:
    $$\text{Timeline \%} = \min(100, \max(0, \frac{\text{now} - \text{start}}{\text{deadline} - \text{start}} \times 100))$$
    $$\text{Milestone \%} = \frac{\text{completed}}{\text{total}} \times 100$$
    $$\text{Composite \%} = 0.5 \times \text{Timeline \%} + 0.5 \times \text{Milestone \%}$$

