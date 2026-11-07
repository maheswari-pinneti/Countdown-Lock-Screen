# OFFER MODE — Countdown Studio & Wallpaper Engine

## 1. Overview

The Countdown Studio (`src/features/countdown-studio/CountdownStudioPage.tsx` and `src/utils/wallpaperGenerator.ts`) turns active career goals into high-resolution, exportable smartphone lock-screen wallpapers.

---

## 2. The 5 Signature Wallpaper Themes

Each theme possesses a distinct layout, background style, color palette, and visual hierarchy:

| Theme ID | Display Name | Background | Accent | Typography & Layout |
| :--- | :--- | :--- | :--- | :--- |
| `minimal-focus` | **Minimal Focus** | Deep charcoal/monochrome `#0f1117` | Sky Blue `#38bdf8` | Centered massive countdown numerals; zero visual clutter; distraction-free. |
| `dark-premium` | **Dark Premium** | Pitch black carbon `#000000` | Executive Gold `#f59e0b` | Gold badge highlights; refined letter-spacing; luxury high-status appearance. |
| `motivational-career` | **Motivational Career** | Futuristic navy cyber gradient `#020b1f` | Neon Cyan `#00f0ff` | Cyber grid overlay; prominent career quote card; high-energy progress bar. |
| `soft-gradient` | **Soft Gradient** | Twilight violet to midnight indigo `#1e1035` | Lavender `#c084fc` | Frosted glass containers; pill badges; ambient atmospheric glow. |
| `clean-professional` | **Clean Professional** | Crisp dark slate `#0b1329` | Cobalt Blue `#2563eb` | Structured corporate card layout; high-contrast tabular milestone checklist. |

---

## 3. High-Resolution Canvas Rendering

Wallpapers are rendered directly onto an HTML5 Canvas using pure graphics primitives:

- **1080 × 1920 px** (Standard 9:16)
- **1080 × 2340 px** (Modern 9:19.5 iPhone aspect ratio)
- **1080 × 2400 px** (Tall 9:20 Android aspect ratio)

### Native Clock Safe-Zone
The canvas incorporates a 260px designated safe area at the top ($y = 100\text{px}$ to $360\text{px}$). When set as a phone lock screen, the operating system's native clock (iOS / Android) rests inside this zone without obscuring countdown titles or milestone cards.

---

## 4. Real PNG Wallpaper Export

Exports trigger client-side blob rendering:

```typescript
export async function downloadWallpaperPng(
  config: WallpaperConfig,
  filename?: string
): Promise<{ success: boolean; filename: string }>
```

- Converts the canvas buffer to a high-density PNG file via `canvas.toBlob('image/png')`.
- Synthesizes a virtual anchor and initiates an automated download to the user's local machine.
- Provides immediate visual feedback via `<Toast>`.

