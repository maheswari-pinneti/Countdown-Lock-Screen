# Theming Architecture & Modes

## 1. Theme Configuration
OFFER MODE supports dark and light modes toggled via `AppSettings.themeMode` and persisted in LocalStorage.

- **Dark Mode (Default)**: Class `.bg-[#0B0F19]` with `.cutting-mat-grid` background texture and high-contrast neon accents.
- **Light Mode**: Class `.theme-light bg-slate-50 text-slate-900` with subtle gray borders and crisp dark typography.
- **Dynamic Lock Screen Presets**: 5 customizable visual themes (Cyber Obsidian, Emerald Glass, Neon Horizon, Soft Gradient, Clean Professional) rendered dynamically onto HTML5 Canvas.
