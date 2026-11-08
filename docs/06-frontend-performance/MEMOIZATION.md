# Memoization & Computational Caching

## 1. Pure Computations
Expensive operations such as SVG calendar string generation (`calendarSync.ts`), PBKDF2 hash computation, and wallpaper canvas scaling are executed only upon explicit user triggers rather than inside standard render cycles.
