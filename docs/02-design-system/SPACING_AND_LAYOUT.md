# Spacing & Layout Architecture

## 1. Grid & Spatial Rhythm
- **Base Grid**: 4px / 8px incremental spatial rhythm (`p-2`, `p-4`, `p-6`, `p-8`).
- **Desktop Sidebar Offset**: Fixed 72-unit desktop width (`w-72`, `lg:pl-72`) preventing layout jumps when scrolling.
- **Viewport Constraints**: Main content container is constrained to `max-w-7xl mx-auto` with fluid horizontal padding (`px-4 sm:px-6 lg:px-8`).
- **Card Spacing**: Consistent 16px to 24px grid gaps (`gap-4`, `gap-6`).
