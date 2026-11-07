---
title: "[Security] Client-side Session Encryption and Passkey Fallback Handling"
labels: ["security", "passkeys", "auth"]
assignees: ["PinnetiMaheswari97"]
---

### Problem Statement
In sandboxed iframe environments, local development servers without SSL certificates, or non-secure contexts, calls to `window.PublicKeyCredential` and `navigator.credentials.create` can throw `SecurityError` or `NotAllowedError`. The application must handle these exceptions gracefully without crashing.

### Proposed Solution
1. Check `window.isSecureContext` and `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()` before invoking native WebAuthn credentials APIs.
2. In non-HTTPS or test contexts, provide a simulated biometric verification flow so developers and demo users can test the authentication workflow without hardware dependencies.
3. Keep project unlock state scoped to the browser session (`sessionStorage` / in-memory nonces) so workstations relock on browser closure.

### Acceptance Criteria
- [x] Catch blocks in `passkeyService.ts` handle `NotAllowedError` and `SecurityError` gracefully.
- [x] Non-secure environments fall back to smooth client verification simulation.
- [x] Session unlock tokens expire cleanly on browser close or user sign-out.

