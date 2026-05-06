# Calories Calculator — MVP Structuring

## Context
Greenfield mobile app. Two user stories drive scope:
1. Calculate calories in a dish or specific product.
2. Find a recipe suitable for me.

The repo currently contains no code (only empty `README.txt` and `test.txt`), so this document is a pre-design structuring exercise — translating user stories into goals, features, MVP screens, and the assumptions behind them. Goal: produce a clear, mobile-first, usability-focused skeleton that designers can take into wireframes without re-debating scope.

---

## 1. User Stories Breakdown

### Story 1 — "Calculate calories in a dish or product"
**Core goal:** Quickly find out how many calories (and ideally macros) are in something the user is about to eat or has eaten.

**User actions:**
- Open the calorie calculator.
- Search for a product (e.g. "banana") or a dish (e.g. "chicken caesar salad").
- Pick the right match from results.
- Enter or adjust the portion size (grams, pieces, cups, servings).
- See the calculated calories (and macros) for that portion.

### Story 2 — "Find a recipe suitable for me"
**Core goal:** Discover recipes that fit the user's personal constraints — diet type, allergies, calorie budget, ingredients available.

**User actions:**
- Open recipe search.
- Apply filters (diet, allergens, max calories, key ingredient) — or rely on profile defaults.
- Browse results.
- Open a recipe to see ingredients, steps, and nutrition.
- (Optional) Save it for later.

---

## 2. Features List (MVP)

- **Food/product search** — text-based lookup against a food database.
- **Portion input & calorie calculation** — adjustable serving size with live recalculation of calories + macros.
- **Recipe search with filters** — diet type, allergens, calorie cap, ingredient keyword.
- **Recipe detail view** — ingredients, steps, per-serving nutrition, suitability indicator.
- **User preferences** — diet (e.g. vegetarian, keto), allergies, daily calorie target. Used to make "suitable for me" meaningful.
- **Lightweight favorites** — save a product/dish or recipe for quick access.

Out of scope for MVP (worth flagging): barcode scanning, daily food diary/tracking, weight-loss progress, social/sharing, AI meal planning, offline mode.

---

## 3. Screens List (MVP)

| # | Screen | Purpose |
|---|--------|---------|
| 1 | **Onboarding / Preferences setup** | One-time flow capturing diet, allergies, and daily calorie goal so recipe suggestions can be personalized. Skippable. |
| 2 | **Home** | Single entry point with two clear CTAs: "Calculate calories" and "Find a recipe." Optional shortcut to recent/favorite items. |
| 3 | **Calorie calculator (search)** | Search field + results list for products and dishes. |
| 4 | **Product / Dish detail** | Selected item with portion-size input and live calorie + macro readout. Save-to-favorites action. |
| 5 | **Recipe search & filters** | List of recipes with filter controls (diet, allergens, max calories, ingredient). Profile preferences pre-applied by default. |
| 6 | **Recipe detail** | Ingredients, steps, per-serving nutrition, "fits your profile" badge, save action. |
| 7 | **Profile / Settings** | View and edit preferences captured at onboarding; manage favorites. |

That is the minimum viable set — 7 screens. Favorites is reused inside Profile rather than getting its own top-level screen.

---

## 4. Assumptions

- **Data source exists.** A food/nutrition database and a recipe database (with pre-calculated per-serving nutrition) are available via API — the app is not a content-authoring tool.
- **Input is text search.** No barcode scan, no photo recognition, no voice input in MVP.
- **"Suitable for me" = rules-based filtering** against the user's stored preferences (diet tag, allergen exclusion, calorie cap). No ML personalization.
- **Single-user, no account sync required for MVP.** Preferences and favorites can live in local storage; auth can come later.
- **Portion units are flexible** — grams plus common household units (pieces, cups, tbsp, servings). Default unit is grams; user can switch.
- **Macros are shown alongside calories** (protein, carbs, fat) because the data is essentially free once calories are computed and users expect it.
- **No food diary / no tracking over time.** The calculator is on-demand only; logging is a future feature.
- **Mobile-first, portrait orientation, single-hand reachable.** Bottom-anchored primary actions; lists over grids for scannability.
- **Online-first.** No offline mode in MVP.
- **English-only, single locale** at launch; units configurable (metric/imperial) but copy is not localized yet.
- **Onboarding is skippable.** Users who skip get unfiltered recipe results until they set preferences in Profile.

---

## Verification (how to validate this structuring before design)

This is a planning artifact, not code, so verification is review-based:
- Walk each user story through the screen flow end-to-end and confirm every listed user action maps to a screen + feature.
- Sanity-check the MVP screen count against the two stories — every screen should earn its place; cut any that don't.
- Review assumptions with the stakeholder (especially: data source availability, no-tracking scope, no-auth scope) before wireframing — these are the most likely scope-changers.
