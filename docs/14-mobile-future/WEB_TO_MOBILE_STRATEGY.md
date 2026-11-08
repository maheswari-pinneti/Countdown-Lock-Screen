# Web to Mobile Migration Strategy

## 1. Code Sharing Strategy
1. **Phase 1 (Monorepo Extraction)**: Move `src/types/`, `src/utils/`, and business logic services into a shared `@offer-mode/core` package.
2. **Phase 2 (Expo Native UI)**: Build native mobile screens replicating the 3 Command Centers.
3. **Phase 3 (Widget Development)**: Write Swift WidgetKit and Kotlin Glance native widgets.
