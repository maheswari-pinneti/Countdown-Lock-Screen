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

console.log('Writing Part 3: 07-quality-and-accessibility, 08-frontend-security, 09-pwa-and-integrations, 10-development-workflow...');

// ==========================================
// 07-QUALITY-AND-ACCESSIBILITY
// ==========================================

writeFile('07-quality-and-accessibility/TESTING_STRATEGY.md', `# Comprehensive Testing Strategy

## 1. Testing Architecture
OFFER MODE employs a multi-tiered automated verification architecture centered around \`npm test\` and executed by [\`scratch/run-all-tests.mjs\`](file:///f:/Countdown-Lock-Screen/scratch/run-all-tests.mjs).

\`\`\`mermaid
graph TD
    Master["Master Test Runner (run-all-tests.mjs)"]
    S1["Suite 1: Core Countdown & Milestones (38 tests)"]
    S2["Suite 2: Five Career Modules Isolation (38 tests)"]
    S3["Suite 3: Wallpaper Studio & Themes (38 tests)"]
    S4["Suite 4: Calendar Integration & iCal RFC 5545"]
    S5["Suite 5: 7-Provider Multi-Library Icons (75 tests)"]
    S6["Suite 6: PBKDF2 Cryptography & Rate Limiting (12 tests)"]
    S7["Suite 7: Anti-Guilt Habit Streak Engine (5 tests)"]

    Master --> S1
    Master --> S2
    Master --> S3
    Master --> S4
    Master --> S5
    Master --> S6
    Master --> S7
\`\`\`

All 7 suites execute in under 3 seconds with a strict 100% pass requirement before code can be merged or pushed.
`);

writeFile('07-quality-and-accessibility/UNIT_TESTING.md', `# Unit Testing Protocols & Standards

## 1. Unit Test Coverage
- **Countdown Engine**: Future dates, past dates, leap years, timezone offsets, zero-padding formatters.
- **Habit Engine**: Unbroken streak accumulation, 1-day recovery grace period, "never miss twice" resets after 2 misses, rest day protection.
- **Cryptography**: PBKDF2 hash determinism, salt uniqueness, rate-limiting lockout calculation.
- **Icon Registry**: Case-insensitive alias mapping, SVG viewBox validity across all 7 providers.
`);

writeFile('07-quality-and-accessibility/COMPONENT_TESTING.md', `# Component Testing Guidelines

## 1. Component Verification
Components are tested for:
- Rendering without runtime errors.
- Handling empty data arrays without throwing null reference exceptions.
- Emitting expected callbacks on click, change, and keydown events.
`);

writeFile('07-quality-and-accessibility/INTEGRATION_TESTING.md', `# Integration Testing

## 1. Cross-Module Workflows
Integration tests verify seamless handoffs between services:
- \`authSecurityService\` -> \`AppContext\` user login session dispatch.
- \`habitService\` -> \`lifeStorageService\` LocalStorage persistence.
- \`calendarSync\` -> RFC 5545 \`.ics\` string and Google Calendar web link creation.
`);

writeFile('07-quality-and-accessibility/E2E_TESTING.md', `# End-to-End (E2E) Testing Strategy

## 1. Playwright / Chrome DevTools Roadmap
- **Critical User Journeys**:
  1. Signup with password -> Create biometric passkey -> Lock application.
  2. Complete daily routine checklist -> Drink 8 glasses of water -> Log reflection.
  3. Customize lock-screen wallpaper -> Download 1080p PNG.
  4. Trigger \`Cmd+K\` -> Search "Distributed Systems" -> Open Learning Roadmap.
`);

writeFile('07-quality-and-accessibility/ACCESSIBILITY.md', `# Accessibility (a11y) & WCAG 2.1 AA Compliance

## 1. Accessible Features Implemented
- **Skip to Content Landmark**: Direct jump to \`#main-content\` for screen readers.
- **Focus Rings**: Clear 2px focus indicators on all interactive buttons and inputs.
- **Contrast Ratios**: > 4.5:1 text-to-background contrast across all themes.
- **Keyboard Shortcuts**: Complete navigation via \`useHotkeys\` with input-field isolation.
`);

writeFile('07-quality-and-accessibility/BROWSER_COMPATIBILITY.md', `# Browser Compatibility Matrix

| Browser | Version Target | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Google Chrome** | Current (v120+) | 100% Verified | Full WebAuthn, Web Audio, PWA support. |
| **Microsoft Edge** | Current (v120+) | 100% Verified | Identical Chromium behavior. |
| **Mozilla Firefox** | Current | 100% Verified | Full Web Audio and Canvas support. |
| **Apple Safari** | v17+ | Supported | WebKit WebAuthn and Touch ID integration. |
`);

writeFile('07-quality-and-accessibility/RESPONSIVE_TESTING.md', `# Responsive Testing & Viewport Verification

## 1. Tested Form Factors
- **Mobile Handsets**: 375x667 (iPhone SE), 390x844 (iPhone 14), 412x915 (Pixel 7).
- **Tablets**: 768x1024 (iPad Mini), 820x1180 (iPad Air).
- **Desktops**: 1280x800, 1920x1080 (FHD), 2560x1440 (QHD).
`);

writeFile('07-quality-and-accessibility/QA_CHECKLIST.md', `# QA Automation & Release Checklist

Every release must verify:
- [x] \`npm run typecheck\` exits with 0 errors.
- [x] \`npm test\` passes all 7 suites (100% success).
- [x] \`npm run build\` generates bundle < 200 kB with zero warnings.
- [x] Passkey registration succeeds on hardware authenticators.
- [x] Web Audio plays focus soundscapes without audio clipping.
- [x] Wallpaper downloads as valid 1080p PNG image.
`);

// ==========================================
// 08-FRONTEND-SECURITY
// ==========================================

writeFile('08-frontend-security/FRONTEND_SECURITY.md', `# Frontend Security Architecture

## 1. Security Overview
OFFER MODE implements defense-in-depth principles across authentication, session management, input sanitization, and hardware passkeys:

\`\`\`mermaid
graph TD
    User[User Input] --> Sanitize[Input Sanitization]
    Sanitize --> AuthEngine[PBKDF2 Cryptography Engine]
    AuthEngine --> RateLimit[Brute-Force Rate Limiter (5 attempts / 60s)]
    AuthEngine --> HardwarePasskey[W3C WebAuthn Hardware Authenticator]
    HardwarePasskey --> Session[24h Cryptographic Token tok_ts_rand]
    Session --> SafeStorage[Encrypted Client-Side Storage]
\`\`\`
`);

writeFile('08-frontend-security/AUTHENTICATION_FLOW.md', `# Authentication Flow & Cryptography

## 1. PBKDF2 Password Key Derivation
Implemented in [\`src/services/authSecurityService.ts\`](file:///f:/Countdown-Lock-Screen/src/services/authSecurityService.ts):
- **Algorithm**: PBKDF2 with HMAC-SHA256.
- **Iterations**: 100,000 rounds.
- **Salt**: 16 cryptographically secure random bytes generated via \`crypto.getRandomValues()\`.
- **Brute-Force Mitigation**: 5 consecutive failed attempts trigger an automatic 60-second client-side lockout.
`);

writeFile('08-frontend-security/PASSKEY_INTEGRATION.md', `# WebAuthn Hardware Passkey Integration

## 1. Zero Synthetic Passkeys Rule
Implemented in [\`src/services/passkeyService.ts\`](file:///f:/Countdown-Lock-Screen/src/services/passkeyService.ts):
- Strictly invokes genuine browser \`navigator.credentials.create()\` and \`navigator.credentials.get()\`.
- Zero synthetic fake passkey fallbacks. If hardware authenticators (Touch ID, Windows Hello, YubiKey) are unsupported, users receive explicit guidance to use PBKDF2 credentials.
`);

writeFile('08-frontend-security/INPUT_SANITIZATION.md', `# Input Sanitization & Data Normalization

## 1. Principles
- Text input fields strip dangerous script tags and escape angle brackets.
- URL parameters are validated against domain whitelists.
- Numbers are cast with \`Number()\` and checked with \`Number.isFinite()\`.
`);

writeFile('08-frontend-security/XSS_PREVENTION.md', `# Cross-Site Scripting (XSS) Prevention

## 1. React JSX Safeguards
- All string interpolation in JSX is automatically escaped by React.
- \`dangerouslySetInnerHTML\` is strictly prohibited across the entire codebase.
`);

writeFile('08-frontend-security/SESSION_MANAGEMENT.md', `# Session Management & Token Security

## 1. Token Architecture
- Session tokens use a secure random format: \`tok_<timestamp>_<random>\`.
- Tokens expire automatically after 24 hours.
- Expired tokens force re-authentication before sensitive routes can be viewed.
`);

writeFile('08-frontend-security/PRIVACY_AND_DATA_PROTECTION.md', `# Privacy Sovereignty & Data Protection

## 1. Local Sovereignty
- User salary goals, personal journal thoughts, and habit logs remain strictly inside the user's browser.
- No analytics trackers or cloud synchronization scripts exist in the repository.
`);

// ==========================================
// 09-PWA-AND-INTEGRATIONS
// ==========================================

writeFile('09-pwa-and-integrations/PWA_ARCHITECTURE.md', `# Progressive Web App (PWA) Architecture

## 1. PWA Manifest & Features
Configured in [\`public/manifest.json\`](file:///f:/Countdown-Lock-Screen/public/manifest.json):
- \`display: standalone\`
- \`theme_color: #0b0f19\`
- \`background_color: #0b0f19\`
- Supports desktop installation in Chrome and home screen pinning in iOS/Android.
`);

writeFile('09-pwa-and-integrations/SERVICE_WORKER.md', `# Service Worker & Cache Strategy

## 1. Cache Implementation
Implemented in [\`public/sw.js\`](file:///f:/Countdown-Lock-Screen/public/sw.js):
- Caches core app shells, fonts, and HTML.
- Employs a **Stale-While-Revalidate** caching strategy for offline resiliency.
`);

writeFile('09-pwa-and-integrations/OFFLINE_SUPPORT.md', `# Offline-First Capability

## 1. 100% Offline Independence
Every core feature—countdown timers, habit tracking, journal entry creation, Pomodoro timer, ambient audio synthesizer, and wallpaper generation—functions completely offline without an internet connection.
`);

writeFile('09-pwa-and-integrations/NOTIFICATIONS.md', `# Notification Engine & In-App Alerts

## 1. Notification Architecture
Implemented in [\`src/services/notificationService.ts\`](file:///f:/Countdown-Lock-Screen/src/services/notificationService.ts):
- Requests standard \`Notification.requestPermission()\`.
- Respects user-configured **Quiet Hours** (e.g. 10 PM - 7 AM).
- Dispatches in-app \`Toast\` components when background notifications are blocked by the OS.
`);

writeFile('09-pwa-and-integrations/CALENDAR_INTEGRATION.md', `# Calendar Integration & RFC 5545 (.ics)

## 1. RFC 5545 Compliance
Implemented in [\`src/utils/calendarSync.ts\`](file:///f:/Countdown-Lock-Screen/src/utils/calendarSync.ts):
- Generates compliant \`.ics\` iCalendar files with \`BEGIN:VCALENDAR\`, \`UID\`, \`SUMMARY\`, and \`DTSTART\`.
- Provides 1-click Google Calendar web creation links.
`);

writeFile('09-pwa-and-integrations/BROWSER_APIS.md', `# Modern Browser API Integration

## 1. APIs Utilized
- **Web Audio API**: Real-time focus sound synthesis.
- **Web Crypto API**: PBKDF2 hashing.
- **WebAuthn API**: Hardware passkeys.
- **HTML5 Canvas**: Wallpaper PNG rendering.
- **Fullscreen API**: Zen mode toggle.
`);

// ==========================================
// 10-DEVELOPMENT-WORKFLOW
// ==========================================

writeFile('10-development-workflow/CODING_STANDARDS.md', `# Frontend Coding Standards

## 1. Clean Code Standards
- Functional React components with arrow functions.
- Explicit prop interfaces.
- Immutability for state updates (no array mutations).
- Meaningful variable names over abbreviated acronyms.
`);

writeFile('10-development-workflow/NAMING_CONVENTIONS.md', `# Naming Conventions

- **Components**: PascalCase (e.g., \`OverviewPage.tsx\`, \`SimpleKpiCards.tsx\`).
- **Hooks**: camelCase with \`use\` prefix (e.g., \`useCountdownEngine.ts\`).
- **Services**: camelCase with \`Service\` suffix (e.g., \`habitService.ts\`).
- **Types**: PascalCase (e.g., \`CareerExperience\`, \`HabitItem\`).
`);

writeFile('10-development-workflow/GIT_WORKFLOW.md', `# Git Branching & Commit Conventions

## 1. Semantic Commits
Follows Conventional Commits:
- \`feat(life-center): ...\`
- \`fix(auth): ...\`
- \`test(habits): ...\`
- \`docs(architecture): ...\`

## 2. Protected Main Branch
Changes are merged to \`main\` only after passing all 7 test suites, typechecks, and builds.
`);

writeFile('10-development-workflow/CODE_REVIEW_CHECKLIST.md', `# Code Review Checklist

Reviewers must verify:
- [ ] No \`any\` types introduced.
- [ ] No external CDN links added.
- [ ] All new state operations are saved offline.
- [ ] Automated tests accompany new domain logic.
- [ ] Bundle size remains within budget.
`);

writeFile('10-development-workflow/DEVELOPMENT_GUIDELINES.md', `# Development Guidelines

## 1. Local Development Setup
\`\`\`bash
npm install
npm run dev      # Launch Vite development server on http://localhost:3000
npm run typecheck# Verify TypeScript strict compilation
npm test         # Run all 7 automated test suites
npm run build    # Production build and chunk analysis
\`\`\`
`);

writeFile('10-development-workflow/DEBUGGING_GUIDE.md', `# Debugging & Diagnostics Guide

## 1. Logging Inspection
Access client logs in the developer console:
\`\`\`javascript
import { logger } from './src/services/loggerService';
console.table(logger.getLogs());
\`\`\`
`);

writeFile('10-development-workflow/TECHNICAL_DEBT.md', `# Technical Debt Register

| Area | Current Limitation | Planned Resolution |
| :--- | :--- | :--- |
| **Storage** | \`localStorage\` fits 5MB | Stage 9 will introduce IndexedDB for large custom wallpapers. |
| **Audio** | Web Audio requires user interaction gesture | Standard browser autoplay policy; user must click play first. |
| **Mobile** | Web responsive view | Section 14 roadmap bridges to React Native + Expo. |
`);

console.log('✅ Part 3 complete!');
