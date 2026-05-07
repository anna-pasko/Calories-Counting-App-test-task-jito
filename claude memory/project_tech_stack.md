---
name: Tech stack & data sources
description: Decided 2026-05-07 — Vite + React + TypeScript PWA, Open Food Facts for foods, curated static JSON for recipes, localStorage for user data
type: project
---

Tech stack and data source decisions for the Calories Counting App. Decided 2026-05-07. User explicitly delegated back-end decisions ("I trust you to make back-end decisions for me") and asked for a "real" app for artificial users — so choices favor real-feeling behavior with zero monthly cost and zero key/secret risk.

**Frontend stack**
- **Vite + React 18 + TypeScript** as a PWA (installable to home screen).
- **Zustand** for state, persisted to `localStorage` (prefs, favorites, recent searches, calorie goal).
- **No router** — per-tab stacks expressed as a reducer: `{ activeTab, stacks: { calculate: [...], recipes: [...], profile: [...] } }`. Cleaner than React Router for this 3-tab × 7-screen IA.
- Loads `design/tokens.css` and `design/components.css` once at root; reuses `design/components.tsx` directly.
- Hosted free on Vercel; deploys via `git push`.

**Foods data source: Open Food Facts (live API)**
- Free, open product database (~3 million products with macros).
- No API key, no signup, generous rate limits suitable for a single-user demo.
- Endpoint base: `https://world.openfoodfacts.org/api/v2`.
- Wrap behind a `DataSource` interface so the call sites don't depend on the upstream — swappable to USDA / Edamam / Spoonacular later.

**Recipes data source: curated static JSON**
- 30–40 hand-picked recipes shipped with the app at `src/data/recipes.json`.
- Each recipe has full ingredients (qty, unit, name), steps, kcal/serving, macros, prep time, diet tags, allergen tags, image URL.
- Default lean (unless overridden by user): balanced mix across diets (vegetarian, vegan, gluten-free, omnivore), mostly < 45 min prep, weeknight-friendly.
- Behind the same `DataSource` interface; swappable to Spoonacular/Edamam later if scale demands.

**User data persistence**
- `localStorage`-backed Zustand store. No backend, no auth, no server.

**Why these choices over alternatives**
- vs Expo/React Native: would force rewriting `components.css` to `StyleSheet`, slower dev loop, iOS prod builds need a Mac. No native APIs needed for MVP.
- vs Next.js: no SEO need, no SSR benefit for a single-user client app; needless complexity.
- vs Spoonacular/Edamam for recipes: free tiers cap quickly, recipe quality variable, API keys add risk to a public repo. Curated 30–40 looks better and filters cleanly.
- vs static seed JSON for foods: too small to feel real for the Calculate tab — Open Food Facts gives genuine catalog feel without cost.

**How to apply**
- When implementing screens: import components from `design/components.tsx` and styles from `design/tokens.css` + `design/components.css`. Don't reach for new UI primitives — extend existing ones if a gap appears.
- All data reads must go through the `DataSource` interface (not direct fetches) so the upstream is swappable.
- Persist user data via the Zustand `persist` middleware against `localStorage`. Don't introduce server state unless the user later asks for accounts or sync.
- Free hosting on Vercel; never commit API keys (none required for OFF, so this should not arise).
