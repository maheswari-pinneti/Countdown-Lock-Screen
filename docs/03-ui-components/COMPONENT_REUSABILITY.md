# Component Reusability & Composition

## 1. Composition Rules
1. **Separation of Layout and Logic**: Presentation components receive pure data and callback functions.
2. **Compound Component Patterns**: Used in MilestoneManager where individual item rows are composed inside a parent list container.
3. **Zero Leaky Abstractions**: Components do not read from `window.localStorage` directly; they accept props or invoke custom hooks.
