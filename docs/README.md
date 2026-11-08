# OFFER MODE — Frontend Engineering Documentation

Welcome to the definitive engineering documentation for **OFFER MODE: Personal Life, Career & Productivity Command Center**.

This documentation suite serves as the single source of architectural truth for product engineers, frontend architects, security auditors, QA automation engineers, and mobile developers preparing for React Native / Expo cross-platform parity.

---

## 📚 Documentation Index

```
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
```

---

## ⚡ Quick Navigation

| Section | Focus Areas | Key Source References |
| :--- | :--- | :--- |
| [00. Project Context](./00-project-context/PROJECT_OVERVIEW.md) | Mission, requirements, non-negotiables | `package.json`, `README.md` |
| [01. Frontend Architecture](./01-frontend-architecture/FRONTEND_ARCHITECTURE.md) | Component trees, data flow, router | `src/app/router.tsx`, `src/store/AppContext.tsx` |
| [02. Design System](./02-design-system/DESIGN_SYSTEM.md) | Design tokens, color system, 7 icon providers | `src/styles/theme.css`, `src/components/icons/` |
| [03. UI Components](./03-ui-components/COMPONENT_INVENTORY.md) | Button, Card, Modal, Dropdown, Skeletons | `src/components/common/`, `src/components/feedback/` |
| [04. Feature Modules](./04-feature-modules/DASHBOARD.md) | 3 Command Centers, 5 Career Workstations | `src/features/`, `src/components/experiences/` |
| [05. Data Management](./05-frontend-data-management/DATA_FLOW.md) | Local-first storage, schema migrations | `src/services/storageService.ts`, `lifeStorageService.ts` |
| [06. Performance](./06-frontend-performance/PERFORMANCE_STRATEGY.md) | Chunk splitting, sub-200kB entry bundle | `vite.config.ts`, `RouteLoadingFallback.tsx` |
| [07. Quality & A11y](./07-quality-and-accessibility/TESTING_STRATEGY.md) | 7 automated test suites, WCAG keyboarding | `scratch/run-all-tests.mjs`, `useHotkeys.ts` |
| [08. Security](./08-frontend-security/FRONTEND_SECURITY.md) | PBKDF2 HMAC-SHA256, genuine WebAuthn | `src/services/authSecurityService.ts`, `passkeyService.ts` |
| [09. PWA & APIs](./09-pwa-and-integrations/PWA_ARCHITECTURE.md) | Service Worker, Web Audio flow, iCal | `public/sw.js`, `ambientAudioService.ts`, `calendarSync.ts` |
| [10. Workflow](./10-development-workflow/CODING_STANDARDS.md) | Git conventions, TypeScript strictness | `tsconfig.json`, `.github/workflows/ci.yml` |
| [11. AI Development](./11-ai-assisted-development/ANTIGRAVITY_INSTRUCTIONS.md) | Antigravity paired programming protocols | `docs/MASTER_IMPLEMENTATION_PLAN.md` |
| [12. Deployment](./12-deployment/DEPLOYMENT_GUIDE.md) | CI pipeline, verification gates, preview | `.github/workflows/ci.yml`, `vite.config.ts` |
| [13. Tracking](./13-project-tracking/IMPLEMENTATION_STATUS.md) | Completed vs backlog matrix | `docs/FEATURE_GAP_ANALYSIS.md` |
| [14. Mobile Future](./14-mobile-future/MOBILE_ARCHITECTURE.md) | React Native + Expo shared core | `src/utils/`, `src/services/` |
