# LocalStorage Utility Architecture

## 1. Safe Access Wrapper
Implemented in [`src/utils/storage.ts`](file:///f:/Countdown-Lock-Screen/src/utils/storage.ts):
```typescript
export function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Error reading key "${key}":`, error);
    return fallback;
  }
}
```
Protects against disabled storage, incognito quota limits, and corrupted JSON.
