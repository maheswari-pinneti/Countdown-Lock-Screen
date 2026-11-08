# Technology Stack & Dependency Justification

## 1. Core Stack
| Layer | Technology | Version | Architectural Justification |
| :--- | :--- | :--- | :--- |
| **Runtime & Language** | TypeScript | `^5.7.2` | Strict null checks, exhaustive union switching, and compile-time type safety. |
| **UI Library** | React | `^18.3.1` | Concurrent features, `React.lazy`, suspense boundaries, and hook composability. |
| **Routing** | React Router DOM | `^7.18.5` | Declarative nested layout routes, lazy loading, and custom route error boundaries. |
| **Build Tooling** | Vite | `^6.0.7` | Lightning-fast HMR and optimized Rollup code splitting. |
| **CSS & Design Tokens** | Tailwind CSS | `^3.4.17` | Atomic utility classes, minimal CSS footprint, and CSS custom properties. |
| **Visual Effects** | Canvas Confetti | `^1.9.4` | GPU-accelerated celebrations on milestone completion. |
| **Primary Icons** | Lucide React | `^1.16.0` | Lightweight tree-shakable SVG glyphs. |
| **Multi-Library Icons** | Custom In-Tree SVG | In-Tree | 7 providers (Simple Icons, FA, Bootstrap, etc.) with zero external CDNs. |

## 2. Platform & Browser APIs
- **Web Audio API**: AudioContext, GainNode, BiquadFilterNode, ChannelMergerNode, OscillatorNode for real-time focus soundscapes.
- **Web Crypto API**: `crypto.subtle.deriveBits`, `crypto.getRandomValues` for PBKDF2 key derivation.
- **WebAuthn API**: `navigator.credentials.create`, `navigator.credentials.get` for biometric security.
- **HTML5 Canvas**: 2D Context rendering for dynamic 1080p lock-screen generation.
