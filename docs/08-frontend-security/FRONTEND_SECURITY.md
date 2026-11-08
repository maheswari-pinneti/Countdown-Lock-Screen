# Frontend Security Architecture

## 1. Security Overview
OFFER MODE implements defense-in-depth principles across authentication, session management, input sanitization, and hardware passkeys:

```mermaid
graph TD
    User[User Input] --> Sanitize[Input Sanitization]
    Sanitize --> AuthEngine[PBKDF2 Cryptography Engine]
    AuthEngine --> RateLimit[Brute-Force Rate Limiter (5 attempts / 60s)]
    AuthEngine --> HardwarePasskey[W3C WebAuthn Hardware Authenticator]
    HardwarePasskey --> Session[24h Cryptographic Token tok_ts_rand]
    Session --> SafeStorage[Encrypted Client-Side Storage]
```
