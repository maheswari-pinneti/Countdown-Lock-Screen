---
name: "Guided Step-by-Step Dashboard Workflow"
about: "Feature template for the 4-stage sequential dashboard workflow"
title: "[Feature] Guided Step-by-Step Onboarding and Sequential Workflow Navigation"
labels: ["enhancement", "ux", "dashboard"]
assignees: ["PinnetiMaheswari97"]
---

### Problem Statement
Upon entering the dashboard, users can feel overwhelmed by seeing multiple career tracks, milestones, statistics, and settings simultaneously. A structured, step-by-step guided layout is necessary to direct users through goal setting, milestone planning, security configuration, and ambient lock screen usage.

### Proposed Solution
1. Introduce a 4-stage sequential workflow on the main dashboard:
   - **Step 1:** Select active career goal & view countdown clocks.
   - **Step 2:** Review prioritized milestone checklist and check off deliverables.
   - **Step 3:** Enable biometric passkey protection for sensitive project workstations.
   - **Step 4:** Launch ambient full-screen distraction-free countdown lock screens.
2. Build an interactive Stepper bar at the top of the dashboard.
3. Provide a view mode switcher between "Step Focus" (guided one-step-at-a-time navigation) and "View All Steps" (expanded full sequence).

### Acceptance Criteria
- [x] Top stepper cards navigate between steps dynamically with sound and visual feedback.
- [x] Step 1 displays all 5 career tracks with real-time countdown blocks.
- [x] Step 2 features an interactive checklist where ticking boxes updates readiness percentage in real-time.
- [x] Step 3 provides a control board to toggle passkeys on/off per project.
- [x] Step 4 launches full-screen focus screen with ambient gradients and keyboard shortcut guides.
