# WebAuthn Hardware Passkey Integration

## 1. Zero Synthetic Passkeys Rule
Implemented in [`src/services/passkeyService.ts`](file:///f:/Countdown-Lock-Screen/src/services/passkeyService.ts):
- Strictly invokes genuine browser `navigator.credentials.create()` and `navigator.credentials.get()`.
- Zero synthetic fake passkey fallbacks. If hardware authenticators (Touch ID, Windows Hello, YubiKey) are unsupported, users receive explicit guidance to use PBKDF2 credentials.
