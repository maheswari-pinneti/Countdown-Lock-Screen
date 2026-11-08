# Route Lazy Loading Implementation

## 1. Dynamic Imports
All 20+ routes in [`src/app/router.tsx`](file:///f:/Countdown-Lock-Screen/src/app/router.tsx) are split using `React.lazy()`. When a user navigates to a workstation, only that workstation's lightweight chunk is downloaded on demand.
