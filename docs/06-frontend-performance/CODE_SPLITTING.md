# Code Splitting & Chunk Strategy

## 1. Vite Rollup Configuration
Configured in [`vite.config.ts`](file:///f:/Countdown-Lock-Screen/vite.config.ts):
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        'vendor-icons': ['lucide-react', 'canvas-confetti'],
      },
    },
  },
}
```
Ensures core React runtimes and heavy dependencies are cached indefinitely by browser HTTP caches.
