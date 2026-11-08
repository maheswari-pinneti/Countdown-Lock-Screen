# Form Architecture & Validation

## 1. Principles
- **Controlled State**: Forms maintain typed state to ensure predictable validation.
- **Generic Security Error Messages**: Authentication forms in `LoginPage.tsx` and `SignupPage.tsx` display uniform error messages ("Invalid credentials or rate limit exceeded") to prevent username enumeration attacks.
- **Sanitization**: All text inputs are trimmed of leading/trailing whitespace prior to state submission.
