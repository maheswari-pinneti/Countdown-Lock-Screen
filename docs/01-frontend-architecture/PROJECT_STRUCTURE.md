# Project Directory Structure

The repository is structured to maintain clean boundaries between features, shared UI components, core state, and domain engines:

```
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
```
