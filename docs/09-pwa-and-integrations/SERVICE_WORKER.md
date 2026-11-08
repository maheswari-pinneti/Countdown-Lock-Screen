# Service Worker & Cache Strategy

## 1. Cache Implementation
Implemented in [`public/sw.js`](file:///f:/Countdown-Lock-Screen/public/sw.js):
- Caches core app shells, fonts, and HTML.
- Employs a **Stale-While-Revalidate** caching strategy for offline resiliency.
