# OFFER MODE Development Guide

## 1. Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher, tested on v20 and v24)
- npm or pnpm

### Local Installation
```bash
# Clone the repository
git clone https://github.com/maheswari-pinneti/Countdown-Lock-Screen.git
cd Countdown-Lock-Screen

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 2. Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Starts Vite dev server with hot module replacement (HMR) |
| `npm run build` | `tsc && vite build` | Type-checks with TypeScript compiler and generates production bundle in `dist/` |
| `npm run preview` | `vite preview` | Serves production build locally for verification |
| `npm run typecheck` | `npx tsc --noEmit` | Strict type validation without building |

---

## 3. Running Test Suites

OFFER MODE includes automated test suites covering all mathematical engines, isolation guarantees, and wallpaper theme presets:

```bash
# 1. Run Core Countdown & Milestone Engine Test Suite (38 tests)
node scratch/test-suite.mjs

# 2. Run Five Career Modules Isolation & Presets Test Suite (60 tests)
node scratch/test-five-modules.mjs

# 3. Run Wallpaper Studio & 5 Themes Test Suite (38 tests)
node --experimental-strip-types scratch/test-wallpaper-and-themes.mjs
```

**Total Automated Coverage: 136 passing tests (0 failures).**

---

## 4. Code Style & Architectural Standards

- **Strict TypeScript**: No implicit `any`. All props, states, and function signatures must be strictly typed.
- **Component Isolation**: Use domain folders under `src/features/` and shared UI elements under `src/components/common/`.
- **Pure Canvas Drawing**: When modifying `src/utils/wallpaperGenerator.ts`, ensure all dimensions scale according to the selected aspect ratio (`9:16`, `9:19.5`, `9:20`).
- **Zero Third-Party Telemetry**: Never introduce external tracking or analytics SDKs.

