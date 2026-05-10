---
name: IA dropped Home screen in favor of 3-tab spine
description: Calories Counting App MVP IA decision — no Home screen; the bottom-tab bar (Calculate · Recipes · Profile) is the spine
type: project
originSessionId: b0c6162c-fc40-4546-a9de-6d021f1648e3
---
The MVP information architecture (see `information-architecture.md` in the repo root) intentionally dropped the originally-planned Home screen. The app shell is a persistent **bottom tab bar with three tabs**: Calculate · Recipes · Profile. Onboarding remains a one-time pre-app flow.

**Why:** The original structuring plan listed Home as a landing screen with two CTAs ("Calculate calories", "Find a recipe"). With a bottom tab bar, those two CTAs *are* the two main tabs — making Home redundant. Dropping it keeps the MVP leaner without losing any user-story entry point. Decided 2026-05-06 during the IA pass.

**How to apply:**
- When designing flows, wireframes, or new features, do not reintroduce Home as a screen-with-CTAs. Each tab is its own entry point.
- `user-flows.md` was updated on 2026-05-06 to drop Home references; both flows now start at a tab tap.
- If a landing dashboard becomes desirable later, model it as a **4th tab** (e.g. "Today" or "Home"), not as a screen that pushes into other tabs. This preserves the per-tab stack model.
- Detail screens stay children of their tab's search/list screen — never reachable from another tab. Favorites in Profile open their detail *inside the Profile stack* to keep "back" intuitive.
