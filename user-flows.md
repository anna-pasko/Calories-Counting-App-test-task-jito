# Calories Calculator — User Flows

Mobile-first flows for the two MVP user stories. Each step lists the user action, the screen they're on, the main UI elements involved, and the system response. Optimized for minimum steps and clarity. Assumes the bottom-tab IA defined in `information-architecture.md` (Calculate · Recipes · Profile) — there is no separate Home screen; each tab is its own entry point.

---

## Flow 1: Calculate calories for a dish or product

**Step 1**
- **User action:** Open the app, or tap the **Calculate** tab from any other tab.
- **Screen:** Any (bottom tab bar is always reachable on tab roots).
- **UI elements:** Bottom tab bar (Calculate · Recipes · Profile).
- **System response:** Show the Calculate — Search screen. On first entry in a session, focus the search field and open the keyboard; on return from a detail screen or another tab, restore the prior query and results so partial input is not lost.

**Step 2**
- **User action:** Type a product or dish name (e.g. "banana", "chicken caesar salad").
- **Screen:** Calculate — Search.
- **UI elements:** Search input with placeholder "Search a product or dish"; cancel/clear icon; recent searches list (shown until query starts).
- **System response:** Live, debounced search against the food database; display matching results as the user types; show a loading indicator while fetching; show an empty state with hint text if no matches.

**Step 3**
- **User action:** Tap the correct match from the results list.
- **Screen:** Calculate — Search (results list).
- **UI elements:** Result rows showing item name, brand/category if relevant, base portion size, and a kcal hint per base portion.
- **System response:** Open the Product / Dish detail screen for the selected item, prefilled with the default portion size.

**Step 4**
- **User action:** Adjust the portion size (type a number, change the unit).
- **Screen:** Product / Dish detail.
- **UI elements:** Item name and image; portion input field; unit selector (g / pieces / cups / tbsp / serving); large calorie readout; macros strip (protein / carbs / fat); "Save to favorites" button; back button.
- **System response:** Recalculate calories and macros live as the input changes; remember the last-used unit for that item type.

**Step 5 (optional)**
- **User action:** Tap "Save to favorites."
- **Screen:** Product / Dish detail.
- **UI elements:** Save button (heart/star icon); toast/snackbar.
- **System response:** Add the item to local favorites; toggle the button to its "Saved" state; show a brief "Saved to favorites" toast.

**Exit:** User taps back to return to Calculate — Search (prior query and results preserved), or switches tabs to continue elsewhere.

---

## Flow 2: Find a recipe suitable for me

**Step 1**
- **User action:** Tap the **Recipes** tab.
- **Screen:** Any (bottom tab bar is always reachable on tab roots).
- **UI elements:** Bottom tab bar (Calculate · Recipes · Profile).
- **System response:** Show the Recipes — Search & Filters screen with the user's stored profile filters pre-applied (diet, allergens, daily calorie cap) so the default state is already personalized. If onboarding was skipped, open with no filters and show a soft "Set my preferences" banner at the top.

**Step 2 (optional)**
- **User action:** Adjust filters or search by ingredient / keyword.
- **Screen:** Recipe search & filters.
- **UI elements:** Search input ("Search by ingredient or recipe"); filter chips row (Diet, Allergens, Max calories, Ingredient); "Clear filters" link; results list of recipe cards (image, title, kcal/serving, prep time, "fits you" badge).
- **System response:** Refetch and update the results list in real time as filters or query change; show an empty state with "Loosen filters" suggestion if zero results.

**Step 3**
- **User action:** Tap a recipe card.
- **Screen:** Recipe search & filters.
- **UI elements:** Recipe card.
- **System response:** Open the Recipe detail screen for that recipe.

**Step 4**
- **User action:** Review ingredients and cooking steps; optionally adjust the number of servings.
- **Screen:** Recipe detail.
- **UI elements:** Hero image; title; "Fits your profile" badge; per-serving nutrition strip (kcal, P / C / F); servings adjuster (− / +); ingredients list; numbered steps; save button; back button.
- **System response:** When the servings adjuster changes, scale the ingredient quantities accordingly; per-serving nutrition stays constant (it's per serving, by definition); recipe content stays scrollable.

**Step 5 (optional)**
- **User action:** Tap "Save to favorites."
- **Screen:** Recipe detail.
- **UI elements:** Save button; toast/snackbar.
- **System response:** Add the recipe to local favorites; toggle the button state; show "Saved to favorites" toast.

**Exit:** User taps back to return to Recipes — Search & Filters (filters and query preserved), or switches tabs to continue elsewhere.

---

## Notes on edge cases

- **No profile set (onboarding skipped):** Flow 2 still works with no filters; a one-tap "Set my preferences" banner sits at the top of Recipe search until preferences are filled in.
- **No internet:** Both flows show an inline retry banner on search; cached favorites remain accessible.
- **Ambiguous match in Flow 1:** If multiple branded variants share a name, the result row shows brand/category as a secondary line so the user can distinguish them at a glance.
