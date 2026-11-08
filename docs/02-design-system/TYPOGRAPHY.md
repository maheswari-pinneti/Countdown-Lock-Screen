# Typography System

## 1. Font Family Architecture
- **Display Headings**: `Inter`, system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) with ultra-bold weights (`font-extrabold`, `font-black`).
- **Body & Data**: Clean, neutral sans-serif with generous line heights (`leading-relaxed`) for high legibility.
- **Timers & Clocks**: Monospace tabular numbers (`font-mono`, `tabular-nums`) ensuring countdown digits never shift layout during millisecond ticks.

## 2. Scale & Hierarchy
- **Giant Countdown Clocks**: `text-7xl` to `text-9xl` (Monospace, drop-shadow glow).
- **Page Titles**: `text-2xl` to `text-4xl` (`font-extrabold`, `tracking-tight`).
- **Section Headers**: `text-lg` to `text-xl` (`font-bold`).
- **Body Text**: `text-sm` (`text-slate-300`).
- **Micro Badges**: `text-[10px]` to `text-xs` (`font-bold`, `uppercase`, `tracking-wider`).
