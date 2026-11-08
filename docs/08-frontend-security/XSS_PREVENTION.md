# Cross-Site Scripting (XSS) Prevention

## 1. React JSX Safeguards
- All string interpolation in JSX is automatically escaped by React.
- `dangerouslySetInnerHTML` is strictly prohibited across the entire codebase.
