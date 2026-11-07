# Pull Request: Step-by-Step Guided Dashboard & Protected Router Flow

**Branch:** `feature/step-by-step-dashboard` ➔ `main`  
**Type:** Feature / UX  
**Status:** Ready for Review  

---

### Overview
Transforms the primary career dashboard into a structured **4-stage sequential workflow**, allowing users to progress step-by-step through goal selection, milestone execution, passkey security configuration, and ambient focus lock screen activation.

---

### Key Changes
1. **Interactive Stepper Navigator**:
   - 4 clickable step cards with active state highlights, progress badges, and direct navigation links.
   - **View Mode Switcher**:
     - *Step Focus (Guided Mode)*: Focuses on one step at a time with "Next Step" and "Previous Step" action buttons.
     - *View All Steps*: Expands all 4 steps sequentially down the page with visual connectors and step number badges (`01`, `02`, `03`, `04`).
2. **Step Breakdown**:
   - **Step 1 (Select Career Track)**: 5 dedicated tracks with live countdown tickers, compensation modeling, and role specs.
   - **Step 2 (Milestone Roadmap)**: Interactive action checklist with clickable checkboxes, real-time readiness scoring, and upcoming deadline countdown card.
   - **Step 3 (Passkey Security Center)**: Project-by-project hardware passkey protection control board.
   - **Step 4 (Ambient Focus Lock Screen)**: Interactive preview, one-click launcher (`Press L`), and keyboard shortcuts guide.
3. **Protected Router Architecture (`src/app/router.tsx`)**:
   - `ProtectedRoute` component guards all workstations and dashboard routes against unauthenticated visits.
   - `GuestRoute` component redirects authenticated users away from auth pages to `/`.
   - Sleek distraction-free layout for auth routes in `AppLayout.tsx`.

---

### Testing & Verification
- [x] Verified unauthenticated redirect to `/login`.
- [x] Verified step navigation between Steps 1, 2, 3, and 4.
- [x] Verified interactive milestone check-offs update overall readiness percentage in real-time.
- [x] Verified view mode toggle between Step Focus and View All Steps.
- [x] Full production build passed (`npm run build`).
