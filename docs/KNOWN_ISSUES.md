# OFFER MODE — Known Issues & Technical Limitations

## 1. Browser Notification Scope
- **Limitation**: Web notifications rely on the Chrome browser process being open. If Google Chrome is completely terminated, desktop OS-level scheduled reminders cannot wake the browser without an active Service Worker registered with a remote Web Push server.
- **Resolution**: Clear guidance is surfaced in the **Notifications & Scheduled Reminders** page (`/notifications`), and an in-app fallback toast system (`<Toast>`) activates whenever permission is denied or the browser is backgrounded.

## 2. Canvas Font Loading in Offline Mode
- **Limitation**: Custom Google Fonts (e.g., Space Grotesk, JetBrains Mono) require network availability on the very first load to cache locally.
- **Resolution**: `wallpaperGenerator.ts` specifies a robust fallback font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace`) and checks `document.fonts.ready` before rendering canvas exports.

## 3. Large Bundle Size Warning During Vite Build
- **Notice**: Vite emits a standard notice `(!) Some chunks are larger than 500 kB after minification (index-*.js)`.
- **Context**: This is expected for single-bundle web workstations containing comprehensive interactive canvas engines, Lucide icons, and audio synthesis without aggressive dynamic route chunking. Future production optimizations can introduce `React.lazy()` if initial download time requires further reduction.

