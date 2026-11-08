# Buttons, Inputs & Micro-Interactions

## 1. Button Component Specification
Implemented in [`src/components/common/Button.tsx`](file:///f:/Countdown-Lock-Screen/src/components/common/Button.tsx):
- **Variants**: `primary` (Indigo/Purple gradient), `secondary` (Slate-800), `outline` (Border-slate-700), `ghost` (Transparent), `danger` (Rose-600).
- **Tactile Feedback**: Plays auditory click sound via `soundEngine.playKeyClick()` when clicked, respecting user sound mute preferences.
- **Sizes**: `sm` (px-3 py-1.5), `md` (px-4 py-2), `lg` (px-6 py-3).

## 2. Input Component Specification
Implemented in [`src/components/common/Input.tsx`](file:///f:/Countdown-Lock-Screen/src/components/common/Input.tsx):
- **Password Visibility**: Built-in toggle button with `Eye` and `EyeOff` glyphs to inspect obscured credentials.
- **Error States**: Renders crimson border (`border-rose-500`) and accessible `aria-invalid="true"` when error string is present.
