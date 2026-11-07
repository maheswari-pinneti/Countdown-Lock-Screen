# 📚 OFFER MODE Documentation Hub

Welcome to the comprehensive technical documentation for **OFFER MODE** (v2.0.0 Web-First Release).

Every module, calculation formula, theme preset, and storage schema is documented in detail below.

---

## 📑 Documentation Index

| Document | Purpose & Key Topics |
| :--- | :--- |
| **[1. Architecture Specification](./ARCHITECTURE.md)** | Directory structure, component hierarchy, React Context state management, data decoupling, and separation of concerns. |
| **[2. Development Guide](./DEVELOPMENT.md)** | Prerequisites, local installation, Vite configuration, scripts, code style, and development workflows. |
| **[3. Countdown Engine](./COUNTDOWN_ENGINE.md)** | IANA timezones, leap years, daylight saving time (DST), sub-second precision, and composite progress mathematics. |
| **[4. Countdown Studio & Wallpapers](./COUNTDOWN_STUDIO.md)** | The 5 signature wallpaper themes, 1080p canvas rendering, native phone clock safe area, and real PNG export. |
| **[5. Local Storage & Persistence](./STORAGE.md)** | Schema v2, Local-First privacy guarantees, auto-persistence, corruption fallbacks, and JSON backup/restore. |
| **[6. Web Notifications & Reminders](./NOTIFICATIONS.md)** | Browser Notification API lifecycle, permission management, scheduled reminder queue, and deduplication. |
| **[7. Testing & Quality Assurance](./TESTING.md)** | 136 automated test cases, verification suites, regression coverage, and execution instructions. |
| **[8. Known Issues & Limitations](./KNOWN_ISSUES.md)** | Browser closed notification scope, canvas font caching, and single-bundle Vite warnings. |
| **[9. Future Mobile Roadmap](./FUTURE_MOBILE_ROADMAP.md)** | Decoupled core handover, React Native + Expo platform adapters, and widget integration strategy. |
| **[10. Project Implementation Status](./PROJECT_STATUS.md)** | Complete Phase 0 through Phase 18 implementation and verification status tracker. |

---

## 🎯 Quick Navigation to Source Code

- **Shared Countdown Engine**: [`src/utils/countdownEngine.ts`](../src/utils/countdownEngine.ts)
- **Wallpaper Generator & Canvas**: [`src/utils/wallpaperGenerator.ts`](../src/utils/wallpaperGenerator.ts)
- **Web Notification Service**: [`src/services/notificationService.ts`](../src/services/notificationService.ts)
- **Storage Service & Backup**: [`src/services/storageService.ts`](../src/services/storageService.ts)
- **Procedural Sound Engine**: [`src/services/soundEngine.ts`](../src/services/soundEngine.ts)
- **React Router (12 Routes)**: [`src/app/router.tsx`](../src/app/router.tsx)
- **Global Hotkeys**: [`src/hooks/useHotkeys.ts`](../src/hooks/useHotkeys.ts)

