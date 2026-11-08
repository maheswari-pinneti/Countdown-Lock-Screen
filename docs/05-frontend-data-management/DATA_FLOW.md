# Data Flow Architecture

## 1. Unidirectional Data Flow
```mermaid
graph LR
    User[User Interaction] --> Action[State Action / Hook]
    Action --> Context[AppContext / State Layer]
    Context --> Optimistic[Optimistic UI Update]
    Context --> Service[Storage Service]
    Service --> Storage[Browser LocalStorage]
```

All user interactions trigger state mutations that update React components immediately (optimistic UI), followed by serialization into browser storage.
