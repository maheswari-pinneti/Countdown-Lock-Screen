# Production Build Pipeline

## 1. Execution
```bash
npm run build
```
Triggers:
1. `tsc --noEmit`: Strict TypeScript typechecking.
2. `vite build`: Rollup bundling, CSS minification, chunk hashing, and asset compression into `dist/`.
