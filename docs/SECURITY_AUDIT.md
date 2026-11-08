# OFFER MODE — Application Security Audit & Remediation Guide

**Product:** OFFER MODE — Personal Life, Career & Productivity Command Center  
**Audit Date:** November 2026  
**Status:** Phase 0 Baseline Security Review  
**Risk Level:** Moderate (Remediation Required in Stage 2)  

---

## 1. Executive Summary

OFFER MODE is built as a local-first web application. Because it is designed to store personal life goals, career milestones, interview notes, compensation details, daily reflections, and financial aspirations, its security architecture must be held to high standards.

This security review identifies vulnerabilities in the existing authentication and passkey flow, establishes strict rules for WebAuthn credentials, and specifies the cryptographic and data-handling standards for all subsequent development.

---

## 2. Identified Vulnerabilities & Remediation Plan

### Vulnerability 1: Synthetic Fallback in WebAuthn Passkey Registration (High Priority)
* **Location:** `src/services/passkeyService.ts` (lines 104–128)
* **Analysis:** When `navigator.credentials.create()` throws an error (e.g., user cancels, platform authenticator is missing, or the origin is not HTTPS), the service logs a warning and proceeds to generate a synthetic passkey ID string (`passkey-${Date.now()}-...`), saving it to `localStorage` as a "verified" passkey record.
* **Risk:** A client-side simulated passkey creates a false sense of biometric security. The user believes their account or project is protected by hardware biometric authentication (Touch ID, Windows Hello, Face ID), when in reality it is protected by nothing more than an unverified string in `localStorage`.
* **Remediation (Stage 2):**
  1. Remove all synthetic fallback passkey creation.
  2. If `navigator.credentials.create()` fails or is unsupported, fail fast and return a descriptive error (`WebAuthnNotSupportedError` or `UserCancelledError`).
  3. Require genuine platform authenticator availability (`PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()`).
  4. Explicitly inform the user in the UI when their device or origin cannot perform hardware biometric authentication.

---

### Vulnerability 2: Plain Email Login Without Password Hashing (High Priority)
* **Location:** `src/store/AppContext.tsx` (lines 225–251)
* **Analysis:** The `login(email, password)` function accepts a `password` parameter but ignores it entirely, creating a `UserProfile` object and authenticating any session as long as the email string contains an `@` symbol.
* **Risk:** Anyone with access to the browser can type any email address and assume the identity of that user without proving knowledge of a secret.
* **Remediation (Stage 2):**
  1. Implement client-side cryptographic password verification using the standard **Web Crypto API** (`window.crypto.subtle`).
  2. Derive an encryption key and verification hash using **PBKDF2** with **HMAC-SHA256**, a minimum of **100,000 iterations**, and a **16-byte cryptographically secure random salt** (`crypto.getRandomValues`).
  3. Store only the salt and the derived hash in local storage; never store plaintext passwords.
  4. Clearly separate **Instant Demo Mode** (a transient guest sandbox) from **Private Account Mode** (which requires password or genuine passkey verification).

---

### Vulnerability 3: Plaintext Credentials & Sensitive Data in LocalStorage (Medium Priority)
* **Location:** `src/store/AppContext.tsx`, `src/services/storageService.ts`
* **Analysis:** Storing sensitive interview notes, compensation expectations, journal reflections, and personal financial data unencrypted in `localStorage` leaves it accessible to any script executing on the same origin (such as malicious browser extensions).
* **Remediation (Stage 2 & Stage 9):**
  1. For sensitive modules (Private Journal, Compensation Matrix, Financial Vault), provide an optional passkey-gated or password-derived AES-GCM 256-bit encryption layer.
  2. Isolate sensitive session states to `sessionStorage` or in-memory React state where appropriate.
  3. Clear sensitive cache records upon explicit user logout.

---

### Vulnerability 4: JSON Backup Import Parsing Vulnerability (Low Priority)
* **Location:** `src/services/storageService.ts` (`importAppState`)
* **Analysis:** `importAppState` parses JSON strings with minimal schema validation, checking only `Array.isArray(data.experiences)`.
* **Risk:** An attacker could craft a malicious JSON backup containing invalid payloads or prototype pollution constructs.
* **Remediation (Stage 2):**
  1. Implement strict schema validation on imported backup objects.
  2. Strip unexpected prototype properties (`__proto__`, `constructor`).
  3. Sanitize all string fields to prevent HTML/script injection before mounting into React state.

---

## 3. Dependency Vulnerability Status

A verifiable vulnerability scan was conducted against the repository using `npm audit`:
```bash
npm audit
# Output: found 0 vulnerabilities
```
* **Production Dependencies:**
  - `canvas-confetti`: ^1.9.4 (clean)
  - `lucide-react`: ^1.16.0 (clean)
  - `react`: ^18.3.1 (clean)
  - `react-dom`: ^18.3.1 (clean)
  - `react-router-dom`: ^7.18.5 (clean)
* **Conclusion:** Zero known CVEs or supply-chain vulnerabilities exist in the installed dependency tree.

---

## 4. Security Principles for OFFER MODE

1. **No Fake Security:** Never simulate hardware biometric authentication or cryptographic guarantees. If a capability cannot be provided securely in the browser environment, state it plainly to the user.
2. **Local-First Privacy:** All user data belongs exclusively to the user. No telemetry, third-party trackers, or analytics scripts shall be injected.
3. **Data Erasure & Reset:** Users must always have the ability to perform a complete, irreversible wipe of all local data via Settings, protected by a double-confirmation dialogue.
4. **Content Security Policy Compliance:** All scripts and styles must adhere to standard modern CSP guidelines (no `eval()`, no external unvetted CDNs, inline scripts minimized).
