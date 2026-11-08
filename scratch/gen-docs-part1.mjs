import fs from 'fs';
import path from 'path';

const DOCS_ROOT = path.resolve('docs');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(relPath, content) {
  const fullPath = path.join(DOCS_ROOT, relPath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`[Created] docs/${relPath}`);
}

console.log('Writing Part 1: Root README, 00-project-context, 01-frontend-architecture, 02-design-system...');

// ==========================================
// ROOT README
// ==========================================
writeFile('README.md', `# OFFER MODE — Frontend Engineering Documentation

Welcome to the definitive engineering documentation for **OFFER MODE: Personal Life, Career & Productivity Command Center**.

This documentation suite serves as the single source of architectural truth for product engineers, frontend architects, security auditors, QA automation engineers, and mobile developers preparing for React Native / Expo cross-platform parity.

---

## 📚 Documentation Index

\`\`\`
docs/
├── 00-project-context/              # Product mission, domain requirements & tech stack
├── 01-frontend-architecture/        # React 18, routing, state, services & error boundaries
├── 02-design-system/                # 7-library vector iconography, tokens & theme CSS
├── 03-ui-components/                # Atomic component inventory & composability rules
├── 04-feature-modules/              # Life center, countdowns, planner, journal & studio
├── 05-frontend-data-management/     # Local-first persistence, data models & migrations
├── 06-frontend-performance/         # Code splitting, chunk analysis & Core Web Vitals
├── 07-quality-and-accessibility/    # 7-suite testing architecture, WCAG 2.1 AA & QA
├── 08-frontend-security/            # PBKDF2 cryptography, WebAuthn passkeys & privacy
├── 09-pwa-and-integrations/         # Service worker, offline cache, Web Audio & .ics
├── 10-development-workflow/         # Coding standards, Git branching & code reviews
├── 11-ai-assisted-development/      # Antigravity rules, prompt library & handover logs
├── 12-deployment/                   # Vite production build, GitHub Actions & Vercel
├── 13-project-tracking/             # Feature roadmap, backlog & bug tracker
└── 14-mobile-future/                # React Native + Expo architectural bridge
\`\`\`

---

## ⚡ Quick Navigation

| Section | Focus Areas | Key Source References |
| :--- | :--- | :--- |
| [00. Project Context](./00-project-context/PROJECT_OVERVIEW.md) | Mission, requirements, non-negotiables | \`package.json\`, \`README.md\` |
| [01. Frontend Architecture](./01-frontend-architecture/FRONTEND_ARCHITECTURE.md) | Component trees, data flow, router | \`src/app/router.tsx\`, \`src/store/AppContext.tsx\` |
| [02. Design System](./02-design-system/DESIGN_SYSTEM.md) | Design tokens, color system, 7 icon providers | \`src/styles/theme.css\`, \`src/components/icons/\` |
| [03. UI Components](./03-ui-components/COMPONENT_INVENTORY.md) | Button, Card, Modal, Dropdown, Skeletons | \`src/components/common/\`, \`src/components/feedback/\` |
| [04. Feature Modules](./04-feature-modules/DASHBOARD.md) | 3 Command Centers, 5 Career Workstations | \`src/features/\`, \`src/components/experiences/\` |
| [05. Data Management](./05-frontend-data-management/DATA_FLOW.md) | Local-first storage, schema migrations | \`src/services/storageService.ts\`, \`lifeStorageService.ts\` |
| [06. Performance](./06-frontend-performance/PERFORMANCE_STRATEGY.md) | Chunk splitting, sub-200kB entry bundle | \`vite.config.ts\`, \`RouteLoadingFallback.tsx\` |
| [07. Quality & A11y](./07-quality-and-accessibility/TESTING_STRATEGY.md) | 7 automated test suites, WCAG keyboarding | \`scratch/run-all-tests.mjs\`, \`useHotkeys.ts\` |
| [08. Security](./08-frontend-security/FRONTEND_SECURITY.md) | PBKDF2 HMAC-SHA256, genuine WebAuthn | \`src/services/authSecurityService.ts\`, \`passkeyService.ts\` |
| [09. PWA & APIs](./09-pwa-and-integrations/PWA_ARCHITECTURE.md) | Service Worker, Web Audio flow, iCal | \`public/sw.js\`, \`ambientAudioService.ts\`, \`calendarSync.ts\` |
| [10. Workflow](./10-development-workflow/CODING_STANDARDS.md) | Git conventions, TypeScript strictness | \`tsconfig.json\`, \`.github/workflows/ci.yml\` |
| [11. AI Development](./11-ai-assisted-development/ANTIGRAVITY_INSTRUCTIONS.md) | Antigravity paired programming protocols | \`docs/MASTER_IMPLEMENTATION_PLAN.md\` |
| [12. Deployment](./12-deployment/DEPLOYMENT_GUIDE.md) | CI pipeline, verification gates, preview | \`.github/workflows/ci.yml\`, \`vite.config.ts\` |
| [13. Tracking](./13-project-tracking/IMPLEMENTATION_STATUS.md) | Completed vs backlog matrix | \`docs/FEATURE_GAP_ANALYSIS.md\` |
| [14. Mobile Future](./14-mobile-future/MOBILE_ARCHITECTURE.md) | React Native + Expo shared core | \`src/utils/\`, \`src/services/\` |
`);

// ==========================================
// 00-PROJECT-CONTEXT
// ==========================================

writeFile('00-project-context/PROJECT_OVERVIEW.md', `# Project Overview: OFFER MODE

## 1. Executive Summary
**OFFER MODE** is a high-performance, human-centered **Personal Life, Career & Productivity Command Center**. It transforms career sprints, interview preparation, technical upskilling, and daily life routines from sources of anxiety into structured, visually engaging, and psychologically resilient daily habits.

## 2. Core Pillars
1. **🌟 Life Command Center**: Anti-guilt habit tracking ("never miss twice"), morning/afternoon/evening routines, hydration, private emotional journal, and synthesized Web Audio cognitive flow.
2. **💼 Career Command Center**: 5 dedicated career countdown tracks (Interview Countdown, 30-Day Job Hunt Sprint, Developer Upgrade, First Tech Job, Strategic Career Switch) with RFC 5545 calendar synchronization and structured technical learning roadmaps.
3. **🚀 Dreams, Finance & Studio**: 50/30/20 monthly budgeting, liquid career runway calculation, aspiration bucket list, Tiago Forte P.A.R.A. second-brain knowledge notes, and 1080p lock-screen wallpaper generator.

## 3. Verified Architecture Baseline
- **Framework**: React 18.3.1 with TypeScript 5.7.2 (Strict Mode enabled).
- **Bundler & Build Engine**: Vite 6.0.7 with Rollup code-splitting.
- **Styling**: Tailwind CSS 3.4.17 with custom cutting-mat architectural theme variables.
- **Storage**: Local-First, client-side encryption and storage using browser LocalStorage and in-memory caches.
- **Testing**: 7 autonomous test suites executed via \`node scratch/run-all-tests.mjs\` with 100% pass rate.
`);

writeFile('00-project-context/PRODUCT_VISION.md', `# Product Vision & Philosophy

## 1. The Core Problem
Traditional career and productivity applications are fundamentally broken in two major ways:
1. **Fragmented Workspaces**: Users juggle separate apps for job applications (Notion/Spreadsheets), daily habits (Habitica), countdown clocks (mobile widgets), study roadmaps, and budgeting. Context switching drains cognitive energy.
2. **Guilt-Driven Failure Loops**: Standard habit trackers penalize a single missed day by resetting streaks to zero. This triggers the psychological "what-the-hell" effect where users abandon their goals completely.

## 2. Human-Centered Design Pillars
- **Anti-Guilt Psychology**: Based on James Clear's principle of "Never Miss Twice". If life interrupts a routine, the system grants a 1-day recovery grace period with motivational cues rather than streak destruction.
- **Local-First Data Sovereignty**: Career ambitions, salary targets, emotional journal reflections, and personal budgets must never be exploited for ad targeting or subjected to cloud breaches.
- **Calm, High-Leverage Aesthetics**: Visual hierarchy inspired by physical cutting mats, aerospace heads-up displays (HUDs), and luxury Japanese ergonomics.
`);

writeFile('00-project-context/REQUIREMENTS.md', `# System Requirements Specification

## 1. Functional Requirements (FR)
- **FR-01 (Countdown Precision)**: Real-time calculation of days, hours, minutes, seconds, and milliseconds until milestone deadlines without timer drift.
- **FR-02 (5 Dedicated Career Modules)**: Dedicated workflows for Interview Preparation, 30-Day Job Hunt Sprint, Developer Skill Upgrade, First Job, and Career Switch.
- **FR-03 (Anti-Guilt Habit Engine)**: Daily habit logging, streak tracking with 1-day grace window, and rest-day exemptions.
- **FR-04 (Focus Synthesizer)**: Web Audio generation of Brown Noise, Rain Drizzle, and 4Hz Theta binaural beats without external media requests.
- **FR-05 (Personal Runway)**: Dynamic computation of months of freedom based on liquid savings and fixed monthly expenses across USD, EUR, GBP, INR, CAD, JPY.
- **FR-06 (Wallpaper Export)**: HTML5 Canvas export of lock-screen wallpapers at 9:16 (1080x1920), 9:19.5 (1080x2340), and 9:20 (1080x2400) resolutions.
- **FR-07 (Hardware Authentication)**: Genuine W3C WebAuthn passkey registration with PBKDF2 HMAC-SHA256 client-side fallback.

## 2. Non-Functional Requirements (NFR)
- **NFR-01 (Bundle Budget)**: Primary JavaScript entry bundle must remain under 200 kB (currently 186.03 kB / 56.05 kB gzip).
- **NFR-02 (Zero Telemetry Leakage)**: Zero external HTTP requests for icons, telemetry, or analytics.
- **NFR-03 (Accessibility)**: Full keyboard navigable (Tab, Enter, Space, Escape, Arrow keys) and WCAG 2.1 AA color contrast.
- **NFR-04 (PWA Readiness)**: Installable progressive web app with service worker offline caching.
`);

writeFile('00-project-context/TECH_STACK.md', `# Technology Stack & Dependency Justification

## 1. Core Stack
| Layer | Technology | Version | Architectural Justification |
| :--- | :--- | :--- | :--- |
| **Runtime & Language** | TypeScript | \`^5.7.2\` | Strict null checks, exhaustive union switching, and compile-time type safety. |
| **UI Library** | React | \`^18.3.1\` | Concurrent features, \`React.lazy\`, suspense boundaries, and hook composability. |
| **Routing** | React Router DOM | \`^7.18.5\` | Declarative nested layout routes, lazy loading, and custom route error boundaries. |
| **Build Tooling** | Vite | \`^6.0.7\` | Lightning-fast HMR and optimized Rollup code splitting. |
| **CSS & Design Tokens** | Tailwind CSS | \`^3.4.17\` | Atomic utility classes, minimal CSS footprint, and CSS custom properties. |
| **Visual Effects** | Canvas Confetti | \`^1.9.4\` | GPU-accelerated celebrations on milestone completion. |
| **Primary Icons** | Lucide React | \`^1.16.0\` | Lightweight tree-shakable SVG glyphs. |
| **Multi-Library Icons** | Custom In-Tree SVG | In-Tree | 7 providers (Simple Icons, FA, Bootstrap, etc.) with zero external CDNs. |

## 2. Platform & Browser APIs
- **Web Audio API**: AudioContext, GainNode, BiquadFilterNode, ChannelMergerNode, OscillatorNode for real-time focus soundscapes.
- **Web Crypto API**: \`crypto.subtle.deriveBits\`, \`crypto.getRandomValues\` for PBKDF2 key derivation.
- **WebAuthn API**: \`navigator.credentials.create\`, \`navigator.credentials.get\` for biometric security.
- **HTML5 Canvas**: 2D Context rendering for dynamic 1080p lock-screen generation.
`);

// ==========================================
// 01-FRONTEND-ARCHITECTURE
// ==========================================

writeFile('01-frontend-architecture/FRONTEND_ARCHITECTURE.md', `# Frontend Architecture Overview

## 1. Architectural Philosophy
OFFER MODE follows a **Local-First, Modular Domain Architecture** with strict layer separation:

\`\`\`mermaid
graph TD
    UI["Presentation Layer (React Features & Components)"]
    Store["State & Context Layer (AppContext, Custom Hooks)"]
    Services["Service Layer (Storage, Auth, Audio, Habits, Calendar)"]
    Domain["Domain Engine (Date math, Countdown calculations, Crypto)"]
    Browser["Browser APIs (LocalStorage, Web Audio, WebAuthn, Canvas)"]

    UI --> Store
    Store --> Services
    Services --> Domain
    Domain --> Browser
\`\`\`

## 2. Layer Definitions
1. **Presentation Layer (\`src/features/\`, \`src/components/\`)**: Pure functional components with explicit props. Presentation components never directly mutate storage.
2. **Context & State Layer (\`src/store/\`, \`src/hooks/\`)**: Centralized dispatchers managing reactive state updates, user sessions, and theme modes.
3. **Service Layer (\`src/services/\`)**: Domain-specific singletons handling persistence (\`storageService\`, \`lifeStorageService\`), Web Audio soundscapes (\`ambientAudioService\`), and hardware passkeys (\`passkeyService\`).
4. **Utility & Engine Layer (\`src/utils/\`)**: Pure, side-effect-free math functions for RFC 5545 calendar strings, timezone offsets, and countdown precision.
`);

writeFile('01-frontend-architecture/PROJECT_STRUCTURE.md', `# Project Directory Structure

The repository is structured to maintain clean boundaries between features, shared UI components, core state, and domain engines:

\`\`\`
Countdown-Lock-Screen/
├── .github/workflows/       # GitHub Actions CI verification pipeline
├── public/                  # Static assets, Web App Manifest, Service Worker
│   ├── favicon.svg          # Application vector brand icon
│   ├── manifest.json        # PWA installation manifest
│   └── sw.js                # Offline caching service worker
├── src/
│   ├── app/                 # Top-level application bootstrap & routing
│   │   ├── App.tsx          # Providers wrapper
│   │   ├── providers.tsx    # AppContext & error boundary wiring
│   │   └── router.tsx       # Lazy-loaded route table & route guards
│   ├── components/          # Reusable shared UI primitives
│   │   ├── common/          # Button, Card, Badge, Modal, Input, Icon
│   │   ├── dashboard/       # SimpleKpiCards, AchievementsCenter
│   │   ├── experiences/     # 5 Career workstation implementations
│   │   ├── feedback/        # RouteErrorBoundary, Toast, EmptyState
│   │   ├── icons/           # 7-provider vector icon registry
│   │   ├── layout/          # AppLayout, TrackHeader, TrackRoadmap
│   │   ├── navigation/      # Sidebar, TopNav, Navbar
│   │   ├── search/          # GlobalCommandBar (Cmd+K)
│   │   └── studio/          # WallpaperPreviewCanvas
│   ├── data/                # Initial seed data for experiences & presets
│   ├── features/            # Feature pages (lazy-loaded routes)
│   │   ├── auth/            # LoginPage, SignupPage
│   │   ├── countdown-studio/# Wallpaper studio
│   │   ├── dreams/          # DreamsPage
│   │   ├── finance/         # FinancePage
│   │   ├── focus/           # FocusModePage
│   │   ├── journal/         # JournalPage
│   │   ├── learning/        # LearningCenterPage
│   │   ├── legal/           # TermsPage, PrivacyPage
│   │   ├── life/            # RoutinesPage
│   │   ├── overview/        # OverviewPage (Main dashboard)
│   │   ├── planner/         # PlannerPage
│   │   └── second-brain/    # SecondBrainPage
│   ├── hooks/               # Custom React hooks (countdown, milestones, hotkeys)
│   ├── services/            # Core singleton services (auth, audio, storage)
│   ├── store/               # React Context & store providers
│   ├── styles/              # Design tokens & theme.css
│   ├── types/               # TypeScript domain interfaces
│   └── utils/               # Pure calculation utilities (dates, i18n, canvas)
├── scratch/                 # Standalone test runner and verification scripts
└── docs/                    # Complete frontend engineering documentation
\`\`\`
`);

writeFile('01-frontend-architecture/APPLICATION_FLOW.md', `# Application Flow & Lifecycle

## 1. Application Initialization Flow
When the browser loads OFFER MODE, the bootstrap lifecycle executes in the following deterministic sequence:

\`\`\`mermaid
sequenceDiagram
    participant B as Browser
    participant SW as Service Worker (sw.js)
    participant M as main.tsx
    participant S as authSecurityService
    participant AC as AppContext
    participant R as React Router

    B->>SW: Register service worker
    B->>M: Execute bundle entry (index.html)
    M->>AC: Mount AppProvider
    AC->>S: loadStoredSession() & validate PBKDF2 token
    alt Session Valid
        S-->>AC: Return UserProfile
        AC->>R: Render ProtectedRoute (<AppLayout />)
    else No Active Session
        S-->>AC: Return null
        AC->>R: Redirect to /login
    end
    R->>B: Render active route chunk with Suspense fallback
\`\`\`

## 2. Authentication Route Guards
Implemented in [\`src/app/router.tsx\`](file:///f:/Countdown-Lock-Screen/src/app/router.tsx#L30-L46):
- \`ProtectedRoute\`: Evaluates \`isAuthenticated\` from \`AppContext\`. If unauthenticated, immediately performs client-side redirect to \`/login\` while preserving target location.
- \`GuestRoute\`: Prevents authenticated users from seeing \`/login\` or \`/signup\`, redirecting them to the main dashboard (\`/\`).
`);

writeFile('01-frontend-architecture/ROUTING_ARCHITECTURE.md', `# Routing Architecture & Code Splitting

## 1. Route Table Configuration
Routing is powered by \`react-router-dom\` v7 using \`createBrowserRouter\` in [\`src/app/router.tsx\`](file:///f:/Countdown-Lock-Screen/src/app/router.tsx).

Every feature page is imported via \`React.lazy()\` with dynamic imports:
\`\`\`tsx
const RoutinesPage = React.lazy(() => import('../features/life/RoutinesPage').then((m) => ({ default: m.RoutinesPage })));
const JournalPage = React.lazy(() => import('../features/journal/JournalPage').then((m) => ({ default: m.JournalPage })));
const PlannerPage = React.lazy(() => import('../features/planner/PlannerPage').then((m) => ({ default: m.PlannerPage })));
const FocusModePage = React.lazy(() => import('../features/focus/FocusModePage').then((m) => ({ default: m.FocusModePage })));
\`\`\`

## 2. Suspense & Fallback UI
All lazy routes render inside a top-level \`<React.Suspense>\` boundary in [\`src/components/layout/AppLayout.tsx\`](file:///f:/Countdown-Lock-Screen/src/components/layout/AppLayout.tsx#L205-L207). While asynchronous chunks are fetched over the network, \`<RouteLoadingFallback />\` renders an accessible, shimmering skeleton UI preventing layout shift.

## 3. Alias Redirection Table
To maintain backward compatibility with legacy bookmarks and URLs, the router defines explicit redirect rules:
- \`/dashboard\` -> \`/\`
- \`/routines\`, \`/habits\` -> \`/life\`
- \`/mindset\` -> \`/journal\`
- \`/schedule\` -> \`/planner\`
- \`/deep-work\` -> \`/focus\`
- \`/skills\`, \`/roadmaps\` -> \`/learning\`
- \`/budget\`, \`/runway\` -> \`/finance\`
- \`/bucket-list\` -> \`/dreams\`
- \`/notes\`, \`/vault\` -> \`/second-brain\`
`);

writeFile('01-frontend-architecture/COMPONENT_ARCHITECTURE.md', `# Component Architecture & Composition

## 1. Component Hierarchy Principles
Components in OFFER MODE strictly adhere to **Single Responsibility** and **Unidirectional Data Flow**:

1. **Pages / Route Controllers (\`src/features/*\`)**: Orchestrate feature-level state, trigger storage services, and bind data to layout containers.
2. **Layout Wrappers (\`src/components/layout/*\`)**: Maintain structural UI (Sidebar, TopNav, Sticky Headers, Skip-to-Content landmarks).
3. **Compound Feature Workstations (\`src/components/experiences/*\`)**: Domain-specific complex cards (e.g. \`InterviewWorkstation\`, \`JobHuntWorkstation\`).
4. **Atomic UI Primitives (\`src/components/common/*\`)**: Low-level composable elements (\`Button\`, \`Card\`, \`Badge\`, \`Input\`, \`Dropdown\`, \`Modal\`).
5. **Feedback & Boundary Components (\`src/components/feedback/*\`)**: Declarative error fallbacks (\`RouteErrorBoundary\`), in-app toast alerts (\`Toast\`), and empty states (\`EmptyState\`).

## 2. Component Interface Conventions
- All components use standard TypeScript interfaces with explicit prop types.
- Event handlers follow the \`on<Action>\` naming convention (e.g., \`onToggleMilestone\`, \`onClose\`).
- Visual variants are managed using strict union literals (e.g., \`variant?: 'primary' | 'secondary' | 'ghost' | 'danger'\`).
`);

writeFile('01-frontend-architecture/STATE_MANAGEMENT.md', `# State Management Architecture

## 1. Architecture Overview
OFFER MODE employs a **two-tier state model**:
1. **Global Application Context (\`AppContext.tsx\`)**: Manages cross-cutting application concerns:
   - User authentication profile and active session token.
   - User preferences (theme mode, 12h/24h time format, sound volume, sound theme).
   - Five core career experiences array (\`CareerExperience[]\`).
   - Active lock screen state (\`isLockScreenActive\`, \`activeTrackId\`).
   - Wallpaper presets (\`CountdownDesignPreset[]\`).
2. **Domain-Specific Local Persistence (\`lifeStorageService.ts\`)**:
   - Habits and routine completion logs.
   - Daily hydration logs.
   - Private journal entries and gratitude reflections.
   - Learning roadmaps and skill inventory.
   - Monthly budget categories and savings goals.
   - Bucket list dreams.
   - P.A.R.A. second-brain notes.
   - Planner tasks and focus sessions.

## 2. State Mutation Protocol
State updates are executed through strongly-typed dispatchers in [\`src/store/AppContext.tsx\`](file:///f:/Countdown-Lock-Screen/src/store/AppContext.tsx). Every state mutation immediately syncs optimistically to \`localStorage\` via [\`src/services/storageService.ts\`](file:///f:/Countdown-Lock-Screen/src/services/storageService.ts), ensuring zero data loss on browser refresh.
`);

writeFile('01-frontend-architecture/API_AND_SERVICE_LAYER.md', `# Service Layer & Domain Isolation

## 1. Service Responsibilities
The \`src/services/\` directory contains isolated, singleton service modules with zero coupling to React component rendering:

| Service File | Domain Responsibility |
| :--- | :--- |
| [\`authSecurityService.ts\`](file:///f:/Countdown-Lock-Screen/src/services/authSecurityService.ts) | Cryptographic salt generation, PBKDF2 hashing, brute-force rate-limiting, and session token lifecycle. |
| [\`passkeyService.ts\`](file:///f:/Countdown-Lock-Screen/src/services/passkeyService.ts) | W3C WebAuthn hardware authenticator challenge generation and credential verification. |
| [\`habitService.ts\`](file:///f:/Countdown-Lock-Screen/src/services/habitService.ts) | Anti-guilt habit streak calculation, "never miss twice" recovery mode, and rest day math. |
| [\`ambientAudioService.ts\`](file:///f:/Countdown-Lock-Screen/src/services/ambientAudioService.ts) | Web Audio oscillator and filter graph synthesizer for focus soundscapes. |
| [\`soundEngine.ts\`](file:///f:/Countdown-Lock-Screen/src/services/soundEngine.ts) | UI tactile feedback audio (key clicks, chimes, timer countdown alerts). |
| [\`notificationService.ts\`](file:///f:/Countdown-Lock-Screen/src/services/notificationService.ts) | Browser notification permission checks, quiet hours filtering, and in-app toast dispatching. |
| [\`storageService.ts\`](file:///f:/Countdown-Lock-Screen/src/services/storageService.ts) | Career experiences, app settings, and wallpaper preset persistence. |
| [\`lifeStorageService.ts\`](file:///f:/Countdown-Lock-Screen/src/services/lifeStorageService.ts) | Habits, routines, journal, planner, finance, and second-brain persistence. |
| [\`loggerService.ts\`](file:///f:/Countdown-Lock-Screen/src/services/loggerService.ts) | Client-side structured logger with circular in-memory ring buffer (150 entries). |
| [\`featureFlagService.ts\`](file:///f:/Countdown-Lock-Screen/src/services/featureFlagService.ts) | Runtime feature flag switches with local override support. |
`);

writeFile('01-frontend-architecture/CUSTOM_HOOKS.md', `# Custom React Hooks

## 1. Hook Inventory
Custom hooks encapsulate complex reactive side effects and calculations:

### \`useCountdownEngine(deadline: string, targetDate: string)\`
- **Location**: [\`src/hooks/useCountdownEngine.ts\`](file:///f:/Countdown-Lock-Screen/src/hooks/useCountdownEngine.ts)
- **Purpose**: High-frequency interval countdown timer. Ticks every 50ms to drive smooth millisecond displays without causing cascading parent re-renders.
- **Output**: Returns \`CountdownResult\` with days, hours, minutes, seconds, milliseconds, progress percentage, and expiration flag.

### \`useMilestoneEngine(experience: CareerExperience)\`
- **Location**: [\`src/hooks/useMilestoneEngine.ts\`](file:///f:/Countdown-Lock-Screen/src/hooks/useMilestoneEngine.ts)
- **Purpose**: Provides milestone CRUD operations, completion toggling, progress aggregation, and sorting.

### \`useHotkeys(keyMap: Record<string, () => void>, enabled?: boolean)\`
- **Location**: [\`src/hooks/useHotkeys.ts\`](file:///f:/Countdown-Lock-Screen/src/hooks/useHotkeys.ts)
- **Purpose**: Binds global keyboard shortcuts (e.g., \`L\` for Lock Screen, \`0-5\` for navigation, \`Escape\` for modals). Ignores events originating inside \`<input>\` or \`<textarea>\` elements.
`);

writeFile('01-frontend-architecture/ERROR_HANDLING.md', `# Error Handling & Boundary Strategy

## 1. Architectural Strategy
Runtime exceptions must never crash the entire page or leave users stranded with blank white screens. OFFER MODE implements **layered error defenses**:

1. **Route Error Boundaries (\`RouteErrorBoundary.tsx\`)**: Bound to \`createBrowserRouter({ errorElement: <RouteErrorBoundary /> })\`. Catches unhandled routing or chunk load failures and renders a localized recovery card with a "Reload Application" button.
2. **Component Error Boundaries (\`ErrorBoundary.tsx\`)**: Wraps isolated experimental widgets (e.g. Canvas generator, audio player).
3. **Safe Storage Parsing (\`src/utils/storage.ts\`)**: All LocalStorage reads and writes are wrapped in \`try/catch\` blocks with fallback values, preventing corrupted JSON from crashing the app.
4. **Structured Security Logging (\`loggerService.ts\`)**: Error stacks are captured in the client ring buffer and sanitized to prevent sensitive data leakage.
`);

// ==========================================
// 02-DESIGN-SYSTEM
// ==========================================

writeFile('02-design-system/DESIGN_SYSTEM.md', `# OFFER MODE Design System

## 1. Design Ethos
The OFFER MODE design system is engineered around **Technical Precision, Calm Ergonomics, and Tactile High-Tech Polish**. Inspired by:
- **SimpleKPI & Mobbin**: Clear executive dashboard metrics and information hierarchy.
- **Bento Grids**: Modular, information-dense visual cards with subtle glassmorphic borders.
- **Architectural Cutting Mats**: Subtle background grid textures (\`.cutting-mat-grid\`) providing spatial grounding.

## 2. Core Pillars
- **Dark-First Foundation**: Pure deep slate (\`#0B0F19\`) backgrounds minimizing visual fatigue during late-night coding sessions.
- **Vibrant Accent Spectrum**: High-contrast, semantic accent colors for each career track and life domain.
- **Multi-Library Icon System**: Pure SVG vector glyphs across 7 major providers with zero external network requests.
`);

writeFile('02-design-system/DESIGN_TOKENS.md', `# Design Tokens & CSS Variables

Tokens are defined in [\`src/styles/theme.css\`](file:///f:/Countdown-Lock-Screen/src/styles/theme.css) and [\`tailwind.config.js\`](file:///f:/Countdown-Lock-Screen/tailwind.config.js):

\`\`\`css
:root {
  --bg-primary: #0b0f19;
  --bg-card: rgba(15, 23, 42, 0.75);
  --border-card: rgba(255, 255, 255, 0.08);
  --text-primary: #f8fafc;
  --text-muted: #94a3b8;
  
  /* Brand Track Accents */
  --accent-interview: #f59e0b; /* Amber */
  --accent-jobhunt: #06b6d4;   /* Cyan */
  --accent-developer: #10b981; /* Emerald */
  --accent-firstjob: #f43f5e;  /* Rose */
  --accent-switch: #8b5cf6;    /* Purple */
}
\`\`\`
`);

writeFile('02-design-system/COLOR_SYSTEM.md', `# Color System & Palette

## 1. Domain Semantic Palette
| Role / Domain | Token / Hex | Purpose |
| :--- | :--- | :--- |
| **Surface Dark** | \`#0B0F19\` | Primary background canvas |
| **Card Surface** | \`rgba(15, 23, 42, 0.75)\` | Translucent glassmorphic card container |
| **Border Glass** | \`rgba(255, 255, 255, 0.08)\` | Crisp, high-contrast component boundary |
| **Life & Routines** | \`#10B981\` (Emerald) | Growth, health, and anti-guilt streaks |
| **Interview Prep** | \`#F59E0B\` (Amber) | Focus, vigilance, and behavioral clarity |
| **Job Hunt CRM** | \`#06B6D4\` (Cyan) | Dynamic momentum and outreach velocity |
| **Mindset Journal** | \`#A855F7\` (Purple) | Emotional calm and deep reflection |
| **Planner & MITs** | \`#3B82F6\` (Blue) | Execution discipline and structure |
| **Deep Work Focus** | \`#14B8A6\` (Teal) | Acoustic flow and cognitive absorption |
| **Finance & Runway** | \`#10B981\` (Emerald) | Financial sovereignty and runway |
| **Dreams & Bucket** | \`#EC4899\` (Pink) | Life aspirations and human experiences |
`);

writeFile('02-design-system/TYPOGRAPHY.md', `# Typography System

## 1. Font Family Architecture
- **Display Headings**: \`Inter\`, system font stack (\`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif\`) with ultra-bold weights (\`font-extrabold\`, \`font-black\`).
- **Body & Data**: Clean, neutral sans-serif with generous line heights (\`leading-relaxed\`) for high legibility.
- **Timers & Clocks**: Monospace tabular numbers (\`font-mono\`, \`tabular-nums\`) ensuring countdown digits never shift layout during millisecond ticks.

## 2. Scale & Hierarchy
- **Giant Countdown Clocks**: \`text-7xl\` to \`text-9xl\` (Monospace, drop-shadow glow).
- **Page Titles**: \`text-2xl\` to \`text-4xl\` (\`font-extrabold\`, \`tracking-tight\`).
- **Section Headers**: \`text-lg\` to \`text-xl\` (\`font-bold\`).
- **Body Text**: \`text-sm\` (\`text-slate-300\`).
- **Micro Badges**: \`text-[10px]\` to \`text-xs\` (\`font-bold\`, \`uppercase\`, \`tracking-wider\`).
`);

writeFile('02-design-system/SPACING_AND_LAYOUT.md', `# Spacing & Layout Architecture

## 1. Grid & Spatial Rhythm
- **Base Grid**: 4px / 8px incremental spatial rhythm (\`p-2\`, \`p-4\`, \`p-6\`, \`p-8\`).
- **Desktop Sidebar Offset**: Fixed 72-unit desktop width (\`w-72\`, \`lg:pl-72\`) preventing layout jumps when scrolling.
- **Viewport Constraints**: Main content container is constrained to \`max-w-7xl mx-auto\` with fluid horizontal padding (\`px-4 sm:px-6 lg:px-8\`).
- **Card Spacing**: Consistent 16px to 24px grid gaps (\`gap-4\`, \`gap-6\`).
`);

writeFile('02-design-system/ICONOGRAPHY.md', `# Multi-Library Vector Iconography System

## 1. Architectural Innovation
OFFER MODE implements a unified vector icon engine in [\`src/components/icons/\`](file:///f:/Countdown-Lock-Screen/src/components/icons/) covering **7 premier design systems** as pure inline React SVG components with **zero external CDN links or network downloads**:

1. **Simple Icons**: Verified tech logos (GitHub, Google, LinkedIn, X, React, TypeScript, Python, Docker, AWS, Figma, Slack, Notion, LeetCode).
2. **Font Awesome**: Briefcase, GraduationCap, Trophy, Bullseye, Coffee, Handshake.
3. **Bootstrap Icons**: Bootstrap, Kanban, Diagram3, LightningCharge, Wallet2.
4. **The Noun Project**: NounTarget, NounMountain, NounGrowth, NounBalance.
5. **Material Symbols**: Work, Schedule, Verified, Savings, Mood, WaterDrop.
6. **Icons8**: Resume, Interview, Contract, MoneyBag.
7. **Flaticon**: Meditation, Sleep, Exercise, Airplane, Gratitude.

## 2. Registry Integration
Exposed via [\`src/components/icons/index.ts\`](file:///f:/Countdown-Lock-Screen/src/components/icons/index.ts) and verified by 75 automated unit tests in \`scratch/test-icon-registry.mjs\`.
`);

writeFile('02-design-system/COMPONENT_GUIDELINES.md', `# Component Authoring Guidelines

## 1. Rules for Component Construction
1. **Zero Raw Style Strings**: Use Tailwind classes or tokens from \`theme.css\`. Never hardcode hex colors in inline style attributes unless dynamic (e.g. canvas rendering).
2. **Keyboard Focus States**: Every interactive element must have visible focus rings (\`focus:outline-none focus:ring-2 focus:ring-indigo-500\`).
3. **Optimistic Updates**: Mutating user data must immediately reflect in UI before background persistence completes.
4. **Prop Types Over Any**: Strictly forbid \`any\` in component props.
`);

writeFile('02-design-system/THEMING.md', `# Theming Architecture & Modes

## 1. Theme Configuration
OFFER MODE supports dark and light modes toggled via \`AppSettings.themeMode\` and persisted in LocalStorage.

- **Dark Mode (Default)**: Class \`.bg-[#0B0F19]\` with \`.cutting-mat-grid\` background texture and high-contrast neon accents.
- **Light Mode**: Class \`.theme-light bg-slate-50 text-slate-900\` with subtle gray borders and crisp dark typography.
- **Dynamic Lock Screen Presets**: 5 customizable visual themes (Cyber Obsidian, Emerald Glass, Neon Horizon, Soft Gradient, Clean Professional) rendered dynamically onto HTML5 Canvas.
`);

writeFile('02-design-system/RESPONSIVE_DESIGN.md', `# Responsive Design & Breakpoints

## 1. Breakpoint Strategy
Tailwind standard breakpoints:
- **Mobile (<640px)**: Slide-out drawer navigation, single-column bento widgets, sticky bottom action bar, hidden millisecond countdown labels.
- **Tablet (640px - 1024px)**: Two-column cards, condensed top navigation bar.
- **Desktop (1024px+)**: Fixed 72-unit left sidebar, 3-column bento grid, persistent wall clock, and quick-search shortcut pill.
`);

console.log('✅ Part 1 complete!');
