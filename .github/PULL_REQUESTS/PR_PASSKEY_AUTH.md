# Pull Request: Biometric Passkey Authentication & WebAuthn Project Security

**Branch:** `feature/passkey-auth-security` ➔ `main`  
**Type:** Feature / Security  
**Status:** Ready for Review  

---

### Overview
Implements full-stack client-side authentication featuring native **WebAuthn Biometric Passkeys** (Touch ID, Face ID, Windows Hello, and FIDO2 Security Keys) along with standard email/password credentials and per-project passkey protection locks.

---

### Key Changes
1. **Authentication Gate**:
   - Protected application shell: Unauthenticated visitors automatically route to `/login` first.
   - Dual-tab toggle switcher between `/login` and `/signup`.
   - One-touch "Instant 1-Click Demo Login" for frictionless testing.
2. **WebAuthn Passkey Service (`src/services/passkeyService.ts`)**:
   - `navigator.credentials.create` for device passkey registration.
   - `navigator.credentials.get` for biometric challenge verification.
   - Client-side storage persistence with fallback simulation for non-HTTPS / sandbox testing contexts.
   - Per-project passkey security controls (`isProjectProtected`, `isProjectUnlocked`, `toggleProjectPasskeyProtection`, `promptUnlockProject`).
3. **Biometric Verification Modal (`src/components/common/PasskeyModal.tsx`)**:
   - Visual fingerprint scanning animation with pulse wave effects.
   - Sound engine integration with audio feedback.
   - Global event listener integrated into `AppLayout`.
4. **Per-Project Workstation Locks**:
   - Every career track (Interview, Job Hunt, Developer, First Job, Career Switch) features individual passkey protection toggles and status indicators.
   - Workstation access prompts for biometric confirmation before entry when protected.

---

### Testing & Verification
- [x] All 38 automated test suite assertions pass (`node scratch/test-suite.mjs`).
- [x] TypeScript 5.7 type-checking passes cleanly without errors.
- [x] Production build passes (`npm run build`).
- [x] Tested login with credentials and 1-click demo access.
- [x] Tested biometric passkey registration and verification flow.
- [x] Verified project lock prompts when navigating to protected tracks.

