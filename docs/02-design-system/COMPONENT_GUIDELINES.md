# Component Authoring Guidelines

## 1. Rules for Component Construction
1. **Zero Raw Style Strings**: Use Tailwind classes or tokens from `theme.css`. Never hardcode hex colors in inline style attributes unless dynamic (e.g. canvas rendering).
2. **Keyboard Focus States**: Every interactive element must have visible focus rings (`focus:outline-none focus:ring-2 focus:ring-indigo-500`).
3. **Optimistic Updates**: Mutating user data must immediately reflect in UI before background persistence completes.
4. **Prop Types Over Any**: Strictly forbid `any` in component props.
