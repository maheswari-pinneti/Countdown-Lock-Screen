# Input Sanitization & Data Normalization

## 1. Principles
- Text input fields strip dangerous script tags and escape angle brackets.
- URL parameters are validated against domain whitelists.
- Numbers are cast with `Number()` and checked with `Number.isFinite()`.
