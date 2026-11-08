# Session Management & Token Security

## 1. Token Architecture
- Session tokens use a secure random format: `tok_<timestamp>_<random>`.
- Tokens expire automatically after 24 hours.
- Expired tokens force re-authentication before sensitive routes can be viewed.
