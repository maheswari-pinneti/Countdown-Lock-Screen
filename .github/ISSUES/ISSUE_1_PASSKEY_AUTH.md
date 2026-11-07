---
title: "[Feature] WebAuthn Biometric Passkey Integration and Workstation Access Control"
labels: ["enhancement", "security", "auth"]
assignees: ["PinnetiMaheswari97"]
---

### Problem Statement
Users need a modern, passwordless way to secure their sensitive career countdown targets and confidential job offer compensation models from unauthorized access. Traditional passwords alone are cumbersome and prone to compromise.

### Proposed Solution
1. Integrate the browser WebAuthn API (`navigator.credentials.create` and `navigator.credentials.get`) to support biometric hardware authenticators:
   - Apple Touch ID & Face ID
   - Windows Hello (PIN, facial recognition, fingerprint)
   - FIDO2 / YubiKey physical security keys
2. Allow users to register a device passkey during account creation (`/signup`) or sign in seamlessly via one click (`/login`).
3. Add per-project passkey protection toggles to allow users to lock individual career workstations.

### Acceptance Criteria
- [x] WebAuthn credential creation and verification implemented in `src/services/passkeyService.ts`.
- [x] Biometric prompt modal with visual scanner animation created in `src/components/common/PasskeyModal.tsx`.
- [x] Passkey status badges (`+ Passkey`, `Passkey Protected`, `Passkey Open`) displayed on all project cards.
- [x] Fallback verification simulation provided for environments without secure contexts or physical authenticators.

