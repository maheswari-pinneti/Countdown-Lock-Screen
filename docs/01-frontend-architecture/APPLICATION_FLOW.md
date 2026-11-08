# Application Flow & Lifecycle

## 1. Application Initialization Flow
When the browser loads OFFER MODE, the bootstrap lifecycle executes in the following deterministic sequence:

```mermaid
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
```

## 2. Authentication Route Guards
Implemented in [`src/app/router.tsx`](file:///f:/Countdown-Lock-Screen/src/app/router.tsx#L30-L46):
- `ProtectedRoute`: Evaluates `isAuthenticated` from `AppContext`. If unauthenticated, immediately performs client-side redirect to `/login` while preserving target location.
- `GuestRoute`: Prevents authenticated users from seeing `/login` or `/signup`, redirecting them to the main dashboard (`/`).
