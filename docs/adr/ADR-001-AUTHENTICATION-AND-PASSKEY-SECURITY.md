# ADR-001: Genuine WebAuthn Passkeys & PBKDF2 Password Security

**Status:** Accepted  
**Date:** November 2026  
**Deciders:** Product Security, Application Architecture  

---

## Context
Prior iterations of OFFER MODE implemented client-side passkey records with a fallback mechanism that simulated biometric passkeys when native WebAuthn was unavailable. Furthermore, the login routine accepted passwords without cryptographic verification.

A locally stored string in `localStorage` without hardware biometric verification does not constitute biometric authentication and gives users a false sense of security.

## Decision
1. **Strict WebAuthn Platform Enforcement:**
   - Eliminate synthetic passkey generation fallbacks.
   - Require `navigator.credentials.create` and `navigator.credentials.get` to execute against platform authenticators (Apple Touch ID/Face ID, Windows Hello, Android Biometrics).
   - If WebAuthn fails, is cancelled, or is executed in an insecure non-HTTPS context, fail fast with explicit user feedback.

2. **Web Crypto PBKDF2 Password Hashing:**
   - Use standard Web Crypto API (`window.crypto.subtle`) for local account verification.
   - Derive a 256-bit key from user passwords using PBKDF2 with HMAC-SHA256, 100,000 iterations, and a 16-byte cryptographically secure random salt (`crypto.getRandomValues`).
   - Store only the salt and the resulting hash; never store plaintext passwords.

3. **Login Protection & Rate Limiting:**
   - Enforce brute-force lockout after 5 consecutive failed attempts per email.
   - Use generic error messages ("Invalid email or password") to mitigate account enumeration.

## Consequences
- **Positive:** Authentic security guarantees, zero plaintext credentials, protection against shoulder-surfing and local password theft.
- **Negative:** Hardware biometrics require HTTPS or localhost. Users on non-secure origins must use password authentication.
