# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Architecture & Biometrics

OFFER MODE incorporates local-first client security architecture:
1. **WebAuthn Biometric Passkeys**: Device biometric credentials (Touch ID, Face ID, Windows Hello, and FIDO2 physical keys) are registered and verified using standard W3C Web Authentication APIs (`navigator.credentials.create` and `navigator.credentials.get`). Biometric data never leaves the user's hardware authenticator.
2. **Session Security**: Workstation unlock nonces are scoped strictly to in-memory runtime session state and automatically relock when the browser session terminates.
3. **Data Privacy**: All countdown configurations, target compensation figures, and milestone notes are stored locally in the user's browser (`localStorage`). No sensitive career data is transmitted to third-party tracking servers.

## Reporting a Vulnerability

If you discover a security vulnerability in OFFER MODE, please do not open a public issue. Instead, report it privately by emailing:

**pinnetimaheswari@gmail.com**

Please include:
- A description of the vulnerability
- Reproduction steps or proof-of-concept
- Any relevant logs or browser console stack traces

We will acknowledge receipt within 48 hours and provide a remediation plan.
