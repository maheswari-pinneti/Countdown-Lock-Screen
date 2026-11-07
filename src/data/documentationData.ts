export interface DocSection {
  id: string;
  title: string;
  category: 'Architecture & Dev' | 'Core Engines' | 'Features & Systems' | 'Quality & Mobile';
  badge: string;
  summary: string;
  tags: string[];
  markdown: string;
}

export const DOCUMENTATION_REGISTRY: DocSection[] = [
  {
    id: 'architecture',
    title: 'Architecture Specification',
    category: 'Architecture & Dev',
    badge: 'Core System',
    summary: 'System architecture, decoupled core engines, directory mapping, and state flow.',
    tags: ['react', 'typescript', 'architecture', 'state', 'decoupled'],
    markdown: `
# Architecture Specification

## 1. Architectural Philosophy
OFFER MODE is built as a high-performance, web-first Single Page Application (SPA) designed to run natively inside Google Chrome and modern desktop/mobile web browsers.

### Key Architectural Tenets
1. **Decoupled Core Engines**: Countdown calculations, milestone operations, and storage services are pure TypeScript functions decoupled from the DOM. This ensures 100% testability and prepares the codebase for future React Native mobile reusability without refactoring business logic.
2. **Determinism & Math Integrity**: Zero random numbers. Progress bars represent mathematical truths: elapsed timeline duration (50%) and validated milestone completion (50%).
3. **Local-First Privacy**: 100% client-side persistence in LocalStorage with JSON schema versioning and zero third-party telemetry.
4. **Pixel-Perfect Canvas Rendering**: High-resolution wallpaper export utilizes HTML5 Canvas rendering at full smartphone resolutions (1080x1920, 1080x2340, 1080x2400) rather than relying on brittle DOM-to-image screenshotting.

## 2. Directory Hierarchy
- **\`src/app/\`**: Root application setup, context providers, and browser router (12 functional routes).
- **\`src/components/common/\`**: Core atomic UI primitives (Button, Card, Badge, Modal, Input).
- **\`src/components/layout/\`**: Shell wrappers (AppLayout, TrackHeader, TrackRoadmap).
- **\`src/components/navigation/\`**: Fixed Sidebar and Sticky TopNav with live clock.
- **\`src/components/modules/\`**: Specialized forms for each of the 5 career experiences.
- **\`src/components/studio/\`**: Live smartphone canvas wallpaper preview.
- **\`src/features/\`**: Domain pages (Overview, Interview, Job Hunt, Developer, First Job, Career Switch, Studio, Notifications, Settings, Docs).
- **\`src/services/\`**: Procedural sound synthesizers, LocalStorage schema v2, and browser notification scheduler.
- **\`src/utils/\`**: Pure mathematical countdown engines and high-resolution canvas renderers.
- **\`docs/\`**: Complete Markdown documentation suite for developers and auditors.
`,
  },
  {
    id: 'countdown-engine',
    title: 'Shared Countdown Engine',
    category: 'Core Engines',
    badge: 'Precision Math',
    summary: 'Non-random composite progress formula, IANA timezones, leap years, and DST handling.',
    tags: ['math', 'countdown', 'timezones', 'iana', 'engine', 'sub-second'],
    markdown: `
# Shared Countdown Engine & Timezone Mathematics

## 1. Zero-Random Progress Formula
OFFER MODE replaces arbitrary progress meters with a deterministic composite formula:
- **Timeline Progress**: 
  $$\\text{Timeline \\%} = \\min\\left(100, \\max\\left(0, \\frac{\\text{now} - \\text{startDate}}{\\text{targetDeadline} - \\text{startDate}} \\times 100\\right)\\right)$$
- **Milestone Progress**:
  $$\\text{Milestone \\%} = \\frac{\\text{completedMilestones}}{\\text{totalMilestones}} \\times 100$$
- **Composite Score**:
  $$\\text{Overall Progress} = 0.5 \\times \\text{Timeline \\%} + 0.5 \\times \\text{Milestone \\%}$$

## 2. Sub-Second Resolution & Ambient States
The engine evaluates timestamps at millisecond granularity:
- **Upcoming (\`future\`)**: Target is more than 48 hours away. Normal display.
- **Urgent (\`urgent\`)**: Target is within 48 hours. Amber visual pulse.
- **Due Today (\`today\`)**: Deadline occurs within the current calendar day.
- **Expired (\`expired\`)**: Target has passed. Progress locked at 100%, units frozen at 00:00:00.
- **Invalid (\`invalid\`)**: Malformed date input. Safe fallback rendering without application crashes.

## 3. Standard IANA Timezone Handling
The engine normalizes all user-selected timezones using the standard IANA registry (\`UTC\`, \`America/New_York\`, \`Europe/London\`, \`Asia/Tokyo\`, \`Asia/Kolkata\`), correctly computing daylight saving offsets across all seasons.
`,
  },
  {
    id: 'countdown-studio',
    title: 'Countdown Studio & 5 Wallpaper Themes',
    category: 'Features & Systems',
    badge: '1080p Canvas',
    summary: '5 signature themes, aspect ratios (9:16, 9:19.5, 9:20), and real PNG wallpaper export.',
    tags: ['wallpaper', 'canvas', 'png', 'themes', 'studio', 'safe-zone'],
    markdown: `
# Countdown Studio & Lock-Screen Customization

## 1. The 5 Signature Themes
1. **Minimal Focus** (\`minimal-focus\`): Clean charcoal background (#0f1117) with massive centered numerals and sky-blue accents (#38bdf8). Zero clutter.
2. **Dark Premium** (\`dark-premium\`): Pitch obsidian (#000000) with executive metallic gold (#f59e0b) and silver typography. High-status executive appearance.
3. **Motivational Career** (\`motivational-career\`): High-energy navy cyber gradient (#020b1f to #04132e) with electric cyan (#00f0ff), tech grid overlay, and motivational quote card.
4. **Soft Gradient** (\`soft-gradient\`): Twilight violet to midnight indigo (#1e1035) with lavender accents (#c084fc) and frosted glass cards.
5. **Clean Professional** (\`clean-professional\`): High-contrast corporate dark slate (#0b1329) with cobalt blue highlights (#2563eb) and tabular milestone checklists.

## 2. Native Phone Clock Safe-Zone
Canvas rendering reserves a 260px designated safe area at the top of the canvas ($y = 100\\text{px}$ to $360\\text{px}$). When set as a phone lock screen on iOS or Android, the operating system's native clock sits comfortably inside this zone without overlapping countdown titles.

## 3. Real PNG Wallpaper Export
Exporting triggers high-density rasterization directly onto an HTML5 Canvas:
- **1080 × 1920 px** (Standard 9:16)
- **1080 × 2340 px** (Modern 9:19.5 iPhone aspect ratio)
- **1080 × 2400 px** (Tall 9:20 Android aspect ratio)
The generated PNG is converted to a binary Blob via \`canvas.toBlob('image/png')\` and downloaded directly to your computer.
`,
  },
  {
    id: 'storage',
    title: 'Local Storage & Persistence',
    category: 'Architecture & Dev',
    badge: 'Local-First',
    summary: 'Schema v2 persistence, corruption recovery, factory reset, and JSON workspace backups.',
    tags: ['localstorage', 'persistence', 'privacy', 'backup', 'json'],
    markdown: `
# Local Storage & Persistence Architecture

## 1. Privacy Guarantee
OFFER MODE is built on a **Local-First, Zero-Telemetry** foundation. 
- All goals, milestones, notes, dates, and compensation numbers reside exclusively inside your browser's \`window.localStorage\`.
- No analytics trackers or remote APIs are installed.

## 2. Storage Schema v2
- \`offer_mode_experiences_v2\`: Stores the 5 career experiences and active milestones.
- \`offer_mode_settings_v2\`: Application preferences (theme mode, time format, sound volume).
- \`offer_mode_presets_v2\`: Custom wallpaper design presets saved from Countdown Studio.
- \`offer_mode_notif_log_v2\`: History of sent browser alerts and reminders.
- \`offer_mode_seen_reminders_v2\`: Deduplication set preventing repeat alerts.

## 3. Workspace Backup & Restore
Through **Settings → Workspace Data**, users can export their entire state into a structured JSON backup:
- **Export Backup**: Downloads formatted \`offer-mode-backup.json\`.
- **Import Backup**: Validates file structure before applying to avoid corrupted state.
- **Factory Reset**: Restores factory defaults with double confirmation.
`,
  },
  {
    id: 'notifications',
    title: 'Web Notifications & Reminders',
    category: 'Features & Systems',
    badge: 'Web API',
    summary: 'Browser Notification API lifecycle, scheduled reminder queue, and in-app fallback.',
    tags: ['notifications', 'reminders', 'alerts', 'browser-api', 'toast'],
    markdown: `
# Web Notifications & Scheduled Reminders

## 1. Browser Notification API Lifecycle
- **Permission Requests**: Triggered only upon explicit user opt-in in the Notifications dashboard.
- **Permission States**:
  - \`granted\`: Displays native desktop popups via \`new Notification()\`.
  - \`default\`: Desktop alerts muted until user enables them.
  - \`denied\` / \`unsupported\`: Automatically activates the in-app interactive Toast fallback (\`<Toast />\`).

## 2. Automated Scheduled Reminder Queue
The notification engine monitors deadlines across all 5 career tracks:
- **Target Offer Deadlines**: Warns when deadlines are within 48 hours or occurring today.
- **Upcoming Milestones**: Flags pending checklist items due within 24 hours.
- **Deduplication Engine**: Each dispatched reminder ID is recorded in local storage to prevent repetitive alert loops.

## 3. Browser Scope Truth
Web notifications execute while Google Chrome is running with the tab active or in the background. If Chrome is completely closed, OS notifications require a persistent background service worker and push server.
`,
  },
  {
    id: 'development',
    title: 'Development & Build Workflows',
    category: 'Architecture & Dev',
    badge: 'Developer Guide',
    summary: 'Prerequisites, local installation, available npm scripts, and strict TypeScript rules.',
    tags: ['dev', 'vite', 'npm', 'build', 'scripts', 'typescript'],
    markdown: `
# Developer & Setup Manual

## 1. Prerequisites & Installation
- **Node.js**: v18.0.0 or higher (tested on Node v20 and v24)
- **Package Manager**: npm or pnpm

\`\`\`bash
# Install dependencies
npm install

# Start local development server with Vite Hot Module Replacement
npm run dev

# Strict TypeScript compilation check (0 errors required)
npx tsc --noEmit

# Production web build (output to dist/)
npm run build

# Preview production build locally
npm run preview
\`\`\`

## 2. Directory & Coding Standards
- **Strict TypeScript**: Explicit typing for all component props, states, and return signatures.
- **Tailwind Utility Classes**: Clean design token usage (\`#070B14\` surface, \`#1E293B\` border, cyan accent).
- **Decoupled Engines**: Never import DOM or window APIs inside \`src/utils/countdownEngine.ts\`.
`,
  },
  {
    id: 'testing',
    title: 'Testing & Quality Assurance',
    category: 'Quality & Mobile',
    badge: '136 Tests',
    summary: 'Detailed test suite breakdown across mathematical engines, module presets, and themes.',
    tags: ['testing', 'qa', 'unit-tests', 'integration', 'vitest', 'node'],
    markdown: `
# Quality Assurance & Test Verification

## 1. Test Suites Breakdown
OFFER MODE includes 136 automated test cases executing against real dates, real IANA timezones, and real canvas math:

1. **Countdown & Milestone Engine** (\`scratch/test-suite.mjs\` — 38 tests):
   - Future, today, and expired countdown logic.
   - Leap year and month-boundary calculations.
   - IANA offsets (UTC, New York UTC-5, Tokyo UTC+9, London UTC+0).
   - Non-random composite progress calculation ($0.5 \\times \\text{time} + 0.5 \\times \\text{milestones}$).
   - Milestone CRUD, status toggling, sorting, and completion percentage.

2. **Five Career Modules Suite** (\`scratch/test-five-modules.mjs\` — 60 tests):
   - Verified preset milestones for Module 1 (9), Module 2 (10), Module 3 (10), Module 4 (10), and Module 5 (12).
   - Independent state persistence and module isolation.
   - Module completion percentage evaluations.

3. **Wallpaper Studio & 5 Themes** (\`scratch/test-wallpaper-and-themes.mjs\` — 38 tests):
   - Validation of all 5 primary signature themes.
   - Verification of exact pixel dimensions for 9:16, 9:19.5, and 9:20 ratios.
   - Legacy alias resolution.

\`\`\`bash
# Run the complete test suite
node scratch/test-suite.mjs
node scratch/test-five-modules.mjs
node --experimental-strip-types scratch/test-wallpaper-and-themes.mjs
\`\`\`
`,
  },
  {
    id: 'future-mobile',
    title: 'Future Mobile Handover Roadmap',
    category: 'Quality & Mobile',
    badge: 'Mobile Ready',
    summary: 'Headless core architecture ready for React Native + Expo extraction after web acceptance.',
    tags: ['mobile', 'react-native', 'expo', 'ios', 'android', 'widgets'],
    markdown: `
# Future Mobile Architecture Handover

## 1. Web-First Decoupling Architecture
In strict adherence to the Web-First master prompt strategy, mobile dependencies (React Native, Expo, Flutter) were not added to the web application. 

However, all business logic was built **headless and decoupled**:
- \`src/utils/countdownEngine.ts\`: 100% direct reuse in React Native.
- \`src/hooks/useCountdownEngine.ts\`: 100% direct reuse in React Native.
- \`src/hooks/useMilestoneEngine.ts\`: 100% direct reuse in React Native.
- \`src/types/index.ts\`: 100% direct reuse in React Native.

## 2. Platform Adapter Handover Strategy
When Phase 4 (Mobile Development) is authorized:
- **Storage**: Swap \`window.localStorage\` with \`react-native-mmkv\` or \`@react-native-async-storage/async-storage\`.
- **Sound**: Swap Web Audio API synthesizers with \`expo-av\`.
- **Lock-Screen Widgets**: Implement iOS 16+ ActivityKit Live Activities and Android Glance Lock Screen widgets driven by the shared countdown engine.
`,
  },
  {
    id: 'project-status',
    title: 'Project Implementation Status',
    category: 'Quality & Mobile',
    badge: 'Phase 0-18',
    summary: 'Master execution progress report tracking all 18 development phases to completion.',
    tags: ['status', 'roadmap', 'phases', 'verification', 'complete'],
    markdown: `
# Implementation Status Matrix

- **Phase 0: Inspection & Gap Analysis**: VERIFIED
- **Phase 1: Architecture & Design System**: VERIFIED
- **Phase 2: Navigation & Executive Dashboard**: VERIFIED
- **Phase 3: Shared Countdown Engine**: VERIFIED
- **Phase 4: Shared Milestone Engine**: VERIFIED
- **Phase 5: Interview Countdown Module**: VERIFIED
- **Phase 6: 30-Day Job Hunt Sprint**: VERIFIED
- **Phase 7: Developer Skill Upgrade**: VERIFIED
- **Phase 8: First Job Countdown**: VERIFIED
- **Phase 9: Career Switch Countdown**: VERIFIED
- **Phase 10: Countdown Studio & 5 Themes**: VERIFIED
- **Phase 11: Live Wallpaper Preview**: VERIFIED
- **Phase 12: Real PNG Wallpaper Export**: VERIFIED
- **Phase 13: Local Storage & Persistence**: VERIFIED
- **Phase 14: Web Notifications & Reminders**: VERIFIED
- **Phase 15: Responsive UI & Accessibility**: VERIFIED
- **Phase 16: Comprehensive Test Suites (136 tests)**: VERIFIED
- **Phase 17: Production Web Build**: VERIFIED
- **Phase 18: Documentation & Mobile Handover**: VERIFIED
`,
  },
];

