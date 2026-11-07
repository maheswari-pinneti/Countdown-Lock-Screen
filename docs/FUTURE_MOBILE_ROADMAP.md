# OFFER MODE — Future Mobile Roadmap (Web-First Acceptance Handover)

## 1. Executive Summary

OFFER MODE v2.0.0 is built with a **decoupled, headless business core**. No mobile frameworks (React Native, Expo, Flutter) were introduced into the web application repository during Phase 1. 

However, all mathematical calculations, domain models, validation logic, and storage interfaces are strictly isolated from browser DOM APIs, making direct code sharing with a future mobile application seamless.

---

## 2. Decoupled Business Core Audit (Ready for Mobile Reusability)

The following modules can be copied or imported directly into a React Native + Expo codebase with zero refactoring:

| Web Module | Reusability in React Native | Dependencies |
| :--- | :--- | :--- |
| `src/utils/countdownEngine.ts` | **100% Direct Reuse** | Zero DOM dependencies. Pure TypeScript. |
| `src/hooks/useCountdownEngine.ts` | **100% Direct Reuse** | React primitives (`useState`, `useEffect`, `useMemo`). |
| `src/hooks/useMilestoneEngine.ts` | **100% Direct Reuse** | React primitives. Pure milestone manipulation. |
| `src/types/index.ts` | **100% Direct Reuse** | Core interfaces, enum types, domain schemas. |
| `src/data/defaultExperiences.ts` | **100% Direct Reuse** | Initial presets, milestone libraries, default modules. |
| `src/utils/date.ts` | **100% Direct Reuse** | Standard JS `Intl.DateTimeFormat` (supported in React Native Hermes). |

---

## 3. Platform Adapter Strategy for React Native / Expo

When authorized to initiate Phase 4 (Mobile Development), adopt the following platform adapters:

### 1. Storage Adapter
- **Web**: `window.localStorage` (implemented in `src/utils/storage.ts`).
- **React Native**: `@react-native-async-storage/async-storage` or `react-native-mmkv`.
- **Implementation**: Wrap storage calls with an interface:
  ```typescript
  export interface KeyValueStorage {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
  }
  ```

### 2. Audio Engine Adapter
- **Web**: Web Audio API oscillator synthesis (`src/services/soundEngine.ts`).
- **React Native**: `expo-av` or `react-native-sound`.

### 3. Native Lock-Screen Integration
- **iOS**: Live Activities and Dynamic Island widgets via WidgetKit (`ActivityKit`).
- **Android**: Foreground service lock-screen overlay or Glance AppWidget.
- **Wallpaper Exporter**: `react-native-view-shot` or `@shopify/react-native-skia` using the exact coordinate logic from `src/utils/wallpaperGenerator.ts`.

---

## 4. Proposed Mobile Project Structure

```
offer-mode-mobile/
├── packages/
│   ├── core/           # Symlink or shared package with web: countdownEngine, types, data
│   ├── app/            # Expo Router or React Navigation screens
│   └── widgets/        # iOS WidgetKit and Android Lock Screen Glance extensions
```

*Note: Mobile development must remain deferred until explicit authorization following final web acceptance.*

