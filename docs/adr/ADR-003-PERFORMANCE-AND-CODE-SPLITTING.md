# ADR-003: Performance Optimization & Route Code Splitting

**Status:** Accepted  
**Date:** November 2026  
**Deciders:** Frontend Performance, Architecture  

---

## Context
As OFFER MODE expanded to support 25 distinct routes, 5 workstations, a high-resolution canvas wallpaper engine, and multiple vector icon sets, the production JavaScript bundle grew past 800 kB in a single monolithic chunk. This caused Vite to emit bundle size warnings and increased the initial page load time on slow mobile connections.

## Decision
1. **Dynamic Route Lazy Loading:**
   - Migrate all secondary feature routes in `src/app/router.tsx` to `React.lazy()` with dynamic `import()`.
   - Wrap `<Outlet />` in `AppLayout.tsx` inside `<React.Suspense fallback={<RouteLoadingFallback />}>` featuring accessible skeleton shimmer loaders.

2. **Rollup Vendor Chunking:**
   - Configure `vite.config.ts` with `manualChunks` to separate core libraries:
     - `vendor-react`: `react`, `react-dom`, `react-router-dom`
     - `vendor-icons`: `lucide-react`
     - Individual workstation chunks generated on demand.

3. **Asset Caching:**
   - Service worker caches split chunks on first access, enabling instant subsequent navigation and 100% offline functionality.

## Consequences
- **Positive:** Initial entry JavaScript payload reduced by over 60%, faster First Contentful Paint (FCP) and Largest Contentful Paint (LCP).
- **Negative:** First-time route navigation requires a brief asynchronous chunk download, mitigated by the smooth skeleton shimmer fallback.
