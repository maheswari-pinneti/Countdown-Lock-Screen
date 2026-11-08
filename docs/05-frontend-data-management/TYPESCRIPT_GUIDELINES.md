# TypeScript Guidelines & Strict Standards

## 1. Compiler Configuration
Configured in [`tsconfig.json`](file:///f:/Countdown-Lock-Screen/tsconfig.json):
- `"strict": true`
- `"noImplicitAny": true`
- `"strictNullChecks": true`
- `"noUnusedLocals": true`
- `"noUnusedParameters": true`

## 2. Type Definition Rules
- All domain types reside in [`src/types/index.ts`](file:///f:/Countdown-Lock-Screen/src/types/index.ts).
- No `any` types permitted. Use `unknown` when dealing with unparsed JSON and validate with type guards.
