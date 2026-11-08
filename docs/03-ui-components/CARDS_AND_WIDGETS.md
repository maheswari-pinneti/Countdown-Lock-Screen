# Cards, Bento Grids & Dashboard Widgets

## 1. Bento Grid Architecture
Cards use a standardized glassmorphic container:
```tsx
<div className="card p-6 border border-white/10 bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-xl">
  {children}
</div>
```
- **Interactive States**: Subtle scale transitions (`hover:scale-[1.01]`) and border glow highlighting active tracks.
- **Bento Widget Types**: KPI stat cards, circular progress meters, habit sparklines, and time-blocked MIT items.
