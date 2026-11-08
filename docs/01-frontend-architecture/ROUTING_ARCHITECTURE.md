# Routing Architecture & Code Splitting

## 1. Route Table Configuration
Routing is powered by `react-router-dom` v7 using `createBrowserRouter` in [`src/app/router.tsx`](file:///f:/Countdown-Lock-Screen/src/app/router.tsx).

Every feature page is imported via `React.lazy()` with dynamic imports:
```tsx
const RoutinesPage = React.lazy(() => import('../features/life/RoutinesPage').then((m) => ({ default: m.RoutinesPage })));
const JournalPage = React.lazy(() => import('../features/journal/JournalPage').then((m) => ({ default: m.JournalPage })));
const PlannerPage = React.lazy(() => import('../features/planner/PlannerPage').then((m) => ({ default: m.PlannerPage })));
const FocusModePage = React.lazy(() => import('../features/focus/FocusModePage').then((m) => ({ default: m.FocusModePage })));
```

## 2. Suspense & Fallback UI
All lazy routes render inside a top-level `<React.Suspense>` boundary in [`src/components/layout/AppLayout.tsx`](file:///f:/Countdown-Lock-Screen/src/components/layout/AppLayout.tsx#L205-L207). While asynchronous chunks are fetched over the network, `<RouteLoadingFallback />` renders an accessible, shimmering skeleton UI preventing layout shift.

## 3. Alias Redirection Table
To maintain backward compatibility with legacy bookmarks and URLs, the router defines explicit redirect rules:
- `/dashboard` -> `/`
- `/routines`, `/habits` -> `/life`
- `/mindset` -> `/journal`
- `/schedule` -> `/planner`
- `/deep-work` -> `/focus`
- `/skills`, `/roadmaps` -> `/learning`
- `/budget`, `/runway` -> `/finance`
- `/bucket-list` -> `/dreams`
- `/notes`, `/vault` -> `/second-brain`
