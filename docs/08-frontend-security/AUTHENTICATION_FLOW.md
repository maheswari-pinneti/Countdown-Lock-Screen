# Authentication Flow & Cryptography

## 1. PBKDF2 Password Key Derivation
Implemented in [`src/services/authSecurityService.ts`](file:///f:/Countdown-Lock-Screen/src/services/authSecurityService.ts):
- **Algorithm**: PBKDF2 with HMAC-SHA256.
- **Iterations**: 100,000 rounds.
- **Salt**: 16 cryptographically secure random bytes generated via `crypto.getRandomValues()`.
- **Brute-Force Mitigation**: 5 consecutive failed attempts trigger an automatic 60-second client-side lockout.
