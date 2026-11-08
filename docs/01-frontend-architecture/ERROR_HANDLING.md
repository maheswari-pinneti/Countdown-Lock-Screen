# Error Handling & Boundary Strategy

## 1. Architectural Strategy
Runtime exceptions must never crash the entire page or leave users stranded with blank white screens. OFFER MODE implements **layered error defenses**:

1. **Route Error Boundaries (`RouteErrorBoundary.tsx`)**: Bound to `createBrowserRouter({ errorElement: <RouteErrorBoundary /> })`. Catches unhandled routing or chunk load failures and renders a localized recovery card with a "Reload Application" button.
2. **Component Error Boundaries (`ErrorBoundary.tsx`)**: Wraps isolated experimental widgets (e.g. Canvas generator, audio player).
3. **Safe Storage Parsing (`src/utils/storage.ts`)**: All LocalStorage reads and writes are wrapped in `try/catch` blocks with fallback values, preventing corrupted JSON from crashing the app.
4. **Structured Security Logging (`loggerService.ts`)**: Error stacks are captured in the client ring buffer and sanitized to prevent sensitive data leakage.
