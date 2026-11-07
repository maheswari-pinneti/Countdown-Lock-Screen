# Contributing to OFFER MODE

Thank you for your interest in contributing to **OFFER MODE**! We welcome bug reports, feature proposals, and pull requests from developers of all experience levels.

---

## Getting Started

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/maheswari-pinneti/Countdown-Lock-Screen.git
   cd Countdown-Lock-Screen
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Local Development Server**:
   ```bash
   npm run dev
   ```

---

## Verification & Testing

Before submitting any code changes, ensure all automated verification checks pass cleanly:

```bash
# Run complete 136-assertion test suite
npm test

# Run strict TypeScript typecheck
npm run typecheck

# Run production build
npm run build
```

---

## Branching & Pull Request Process

1. Create a feature branch off `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Adhere to [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(scope): ...`
   - `fix(scope): ...`
   - `docs(scope): ...`
   - `test(scope): ...`
   - `refactor(scope): ...`
3. Push your branch to GitHub and open a Pull Request against `main`.
4. Ensure all CI checks pass. All PRs are reviewed before merging.

---

## Code Style & Architecture

- **Strict TypeScript**: Never use `any`; use strongly-typed interfaces in `src/types/index.ts`.
- **Pure Functions**: Mathematical formulas, countdown calculations, and date parsing should remain pure and decoupled from DOM state.
- **Tailwind CSS**: Follow existing utility-first styling and theme token naming conventions.
