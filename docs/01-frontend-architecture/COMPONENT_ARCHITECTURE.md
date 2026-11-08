# Component Architecture & Composition

## 1. Component Hierarchy Principles
Components in OFFER MODE strictly adhere to **Single Responsibility** and **Unidirectional Data Flow**:

1. **Pages / Route Controllers (`src/features/*`)**: Orchestrate feature-level state, trigger storage services, and bind data to layout containers.
2. **Layout Wrappers (`src/components/layout/*`)**: Maintain structural UI (Sidebar, TopNav, Sticky Headers, Skip-to-Content landmarks).
3. **Compound Feature Workstations (`src/components/experiences/*`)**: Domain-specific complex cards (e.g. `InterviewWorkstation`, `JobHuntWorkstation`).
4. **Atomic UI Primitives (`src/components/common/*`)**: Low-level composable elements (`Button`, `Card`, `Badge`, `Input`, `Dropdown`, `Modal`).
5. **Feedback & Boundary Components (`src/components/feedback/*`)**: Declarative error fallbacks (`RouteErrorBoundary`), in-app toast alerts (`Toast`), and empty states (`EmptyState`).

## 2. Component Interface Conventions
- All components use standard TypeScript interfaces with explicit prop types.
- Event handlers follow the `on<Action>` naming convention (e.g., `onToggleMilestone`, `onClose`).
- Visual variants are managed using strict union literals (e.g., `variant?: 'primary' | 'secondary' | 'ghost' | 'danger'`).
