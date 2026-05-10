# Component Spec Sheet

Source of truth for rebuilding these in Figma. Every spec maps directly to tokens defined in `design-tokens.json`. If you change a token, change it in the JSON, then regenerate `tokens.css` from it.

Notation: `--color-bg-card` refers to the semantic CSS variable; the alias resolves to `#FFFFFF` in v0.

---

## 1 · Button

**Variants**: primary · secondary · link · icon
**Sizes**: md (default) · lg

### Anatomy

```
┌────────────────────────────────────┐
│      [icon?]   Label                │   ← min-height token
└────────────────────────────────────┘
```

### Tokens

| Token              | Primary                      | Secondary                              | Link                  | Icon                           |
| ------------------ | ---------------------------- | -------------------------------------- | --------------------- | ------------------------------ |
| Background         | `--color-brand-primary`      | transparent                            | transparent           | `--color-bg-card`              |
| Background hover   | `--color-brand-primary-pressed` | rgba(255,138,122,.08)               | —                     | `--color-bg-subtle`            |
| Text               | `--color-text-on-brand`      | `--color-brand-primary`                | `--color-brand-primary` | `--color-text-primary`       |
| Border             | none                         | inset 0 0 0 1.5px `--color-brand-primary` | none               | none                           |
| Min-height (md/lg) | 48 / 56                      | 48 / 56                                | 32                    | 44                             |
| Padding-x          | `--space-2xl` / `--space-3xl`| same                                   | `--space-sm`          | 0                              |
| Border-radius      | `--radius-pill`              | `--radius-pill`                        | `--radius-sm`         | `--radius-pill`                |
| Typography         | `t-label-md`                 | `t-label-md`                           | `t-label-md`          | —                              |

### States

- **default** · **hover** (background shift) · **pressed** (scale 0.98) · **disabled** (opacity 0.4) · **focus-visible** (2 px coral outline, 2 px offset)

### Used on

Onboarding · Edit preferences · Empty state CTA · CTAs across all flows.

---

## 2 · SearchInput

**Anatomy**: pill container · leading search icon · text field · trailing clear button (when filled).

| Token            | Value                              |
| ---------------- | ---------------------------------- |
| Height           | 48                                 |
| Background       | `--color-bg-card`                  |
| Border-radius    | `--radius-pill`                    |
| Padding-x        | `--space-lg`                       |
| Gap              | `--space-sm`                       |
| Shadow           | `--shadow-sm`                      |
| Icon size        | 20 × 20, color `--color-text-muted`|
| Field typography | `font-size: --font-size-lg`, color `--color-text-primary` |
| Placeholder      | `--color-text-muted`               |
| Clear button     | 24 × 24 pill, bg `--color-bg-subtle` |

### States

- **empty** (placeholder) · **filled** (clear button visible) · **focus-within** (2 px coral outline on container).

### Used on

Calculate search · Recipes search.

---

## 2b · TextInput

Single-line pill input — no icon, no clear button. The plain-text counterpart to `SearchInput`.

| Token            | Value                              |
| ---------------- | ---------------------------------- |
| Height           | 48                                 |
| Background       | `--color-bg-card`                  |
| Border-radius    | `--radius-pill`                    |
| Padding-x        | `--space-lg`                       |
| Shadow           | `--shadow-sm`                      |
| Field typography | `--font-size-lg`, color `--color-text-primary` |
| Placeholder      | `--color-text-muted`               |

### States

- **empty** (placeholder) · **filled** · **focus-visible** (2 px coral outline, 2 px offset).

### Used on

Onboarding (name step) · Profile edit (name).

---

## 3 · NumberStepper

**Anatomy**: pill container · `−` button · numeric value (+ unit) · `+` button.

| Token             | Value                                  |
| ----------------- | -------------------------------------- |
| Container bg      | `--color-bg-card`                      |
| Container radius  | `--radius-pill`                        |
| Container shadow  | `--shadow-sm`                          |
| Container padding | `--space-xs`                           |
| Gap               | `--space-md`                           |
| Button size       | 40 × 40, radius `--radius-pill`, bg `--color-bg-subtle` |
| Button hover      | `--color-accent-butter`                |
| Value typography  | Inter 18 / 1.3 semibold, `tabular-nums`|
| Min value width   | 56                                     |
| Unit color        | `--color-text-secondary`, `--font-size-md`|

### States

- **default** · **at-min** (− disabled, opacity 0.3) · **at-max** (+ disabled).

### Used on

Onboarding (calorie goal) · Edit preferences (goal) · Portion adjuster · Servings adjuster.

---

## 4 · UnitSelector

Small horizontal segmented control for switching between units (g · pieces · cups · tbsp · serving).

| Token         | Value                                |
| ------------- | ------------------------------------ |
| Container     | bg `--color-bg-subtle`, padding 4 px, radius `--radius-pill`, full-width (`width: 100%`) |
| Button height | 32                                   |
| Button padding| `--space-sm --space-lg` (8 / 16)     |
| Button flex   | `1 1 0` — buttons share row equally  |
| Active button | bg `--color-bg-card`, color `--color-text-primary`, shadow `--shadow-sm` |
| Inactive btn  | color `--color-text-secondary`       |
| Typography    | `--font-size-sm`, `--font-weight-medium`|

### Used on

Product / Dish detail (PortionAdjuster).

---

## 5 · Chip

Single component, three variants:

| Variant   | Use                                       | Selection          |
| --------- | ----------------------------------------- | ------------------ |
| `option`  | Multi-select (diet, allergens)            | toggleable         |
| `filter`  | Filter dropdown trigger (with `▾` glyph)  | toggleable         |
| `badge`   | Read-only label with tone color           | not interactive    |

### Tokens (option / filter)

- min-height 36 · padding 0 `--space-lg` · radius `--radius-pill`
- typography `--font-size-md`, `--font-weight-medium`
- default: bg `--color-bg-card`, 1px inset border `--color-border-default`
- selected: bg `--color-brand-primary`, color `--color-text-on-brand`, no border
- hover: border darkens to `--color-border-strong`

### Tokens (badge)

- min-height 24 · padding 0 `--space-sm` · radius `--radius-pill`
- typography `--font-size-xs` semibold, uppercase, `letter-spacing-wide`
- tones (background colors):
  - `fits-you` → `--color-accent-mint`
  - `diet`     → `--color-accent-lavender`
  - `allergen` → `--color-feedback-warning`
  - `warning`  → `--color-feedback-danger` (text `--color-text-on-brand`)

### Used on

Onboarding · Edit preferences · Recipe search filter row · Recipe card · Recipe detail · Profile summary.

---

## 6 · SegmentedControl

Two-or-more option toggle. Same construction as UnitSelector but full-width and bigger.

| Token         | Value                              |
| ------------- | ---------------------------------- |
| Container     | bg `--color-bg-subtle`, radius `--radius-pill`, padding 4 px |
| Button height | 40                                 |
| Active        | bg `--color-bg-card`, shadow `--shadow-sm` |
| Inactive color| `--color-text-secondary`           |
| Typography    | `--font-size-md`, `--font-weight-semibold`|

### Used on

Profile · Favorites (Foods / Recipes).

---

## 7 · StepDots

3-dot progress for onboarding.

- dot size 8 × 8 (inactive) · 24 × 8 (active, capsule)
- gap `--space-sm`
- inactive bg `--color-border-strong`
- active bg `--color-brand-primary`
- transition 200 ms standard easing on `width` and `background`

### Used on

Onboarding (3 steps).

---

## 8 · SaveButton

Round 44 px floating heart toggle.

| State    | Token                            |
| -------- | -------------------------------- |
| Default  | bg `--color-bg-card`, color `--color-text-secondary`, glyph `♡` |
| Saved    | color `--color-brand-primary`, glyph `♥` |
| Shadow   | `--shadow-sm`                    |
| Press    | scale 0.95                       |
| Hover    | scale 1.05                       |

### Used on

Product / Dish detail · Recipe card overlay · Recipe detail.

---

## 9 · Toast

Snackbar-style transient feedback.

| Token       | Value                                     |
| ----------- | ----------------------------------------- |
| Background  | `--color-text-primary` (dark ink)         |
| Text        | `--color-text-on-brand`                   |
| Padding     | `--space-md --space-lg`                   |
| Radius      | `--radius-lg`                             |
| Max width   | 360                                       |
| Shadow      | `--shadow-lg`                             |
| Icon dot    | 20 × 20 pill, tone-coloured               |

### Tones

- `success` (default) — dot bg `--color-feedback-success`
- `warning` — dot bg `--color-feedback-warning`
- `danger`  — dot bg `--color-feedback-danger`

### Used on

Save confirmations · Edit preferences saved · Errors.

---

## 10 · ResultRow

Search result line for foods.

```
[thumb 48]   Title (semibold, lg, ellipsed)         [kcal · large]
             Meta (sm, secondary)                    [unit small]
```

| Token     | Value                                   |
| --------- | --------------------------------------- |
| Container | bg `--color-bg-card`, radius `--radius-lg`, padding `--space-md --space-lg`, gap `--space-lg` |
| Hover     | bg `--color-bg-subtle`                  |
| Thumb     | 48 × 48, radius `--radius-md`, bg `--color-bg-subtle` |
| Title     | `--font-size-lg`, `--font-weight-semibold`, ellipsis 1 line |
| Meta      | `--font-size-sm`, `--color-text-secondary`|
| kcal      | `--font-size-md`, `--font-weight-semibold`, tabular-nums |

### Used on

Calculate search results · Profile · Favorites (Foods).

---

## 11 · RecipeCard

Vertical card with hero image, title, meta, badges.

```
┌─────────────────────────┐
│  [16:10 image]   ♡       │
├─────────────────────────┤
│  Title (display, sm,    │
│  semibold, 2-line clamp)│
│  520 kcal · 25 min      │
│  [Fits you] [Vegan]     │
└─────────────────────────┘
```

| Token        | Value                                  |
| ------------ | -------------------------------------- |
| Card radius  | `--radius-lg`                          |
| Card shadow  | `--shadow-sm` → `--shadow-md` on hover |
| Image ratio  | 16 / 10                                |
| Body padding | `--space-md --space-lg --space-lg`     |
| Title        | Fraunces 18 / 1.3 semibold, 2-line clamp|
| Meta         | `--font-size-sm`, `--color-text-secondary`; numbers bold + tabular-nums |
| Badge gap    | `--space-xs`                           |
| Hover        | `translateY(-2px)`                     |

### Used on

Recipe search · Profile · Favorites (Recipes).

---

## 12 · NutritionStrip

Horizontal layout: hero kcal + 3 macro stats.

```
┌──────────────────────────────────────────┐
│  389         13g  66g  7g                │
│  KCAL · per  PROT CARB FAT               │
└──────────────────────────────────────────┘
```

| Token            | Value                                     |
| ---------------- | ----------------------------------------- |
| Container        | bg `--color-bg-card`, radius `--radius-lg`, padding `--space-lg`|
| kcal value       | `t-numeric-xl` scaled to 36 px (`--font-size-5xl`) |
| kcal label       | `t-label-sm`                              |
| Macro value      | Inter 16 semibold, tabular-nums           |
| Macro label P    | color `--color-accent-sky`, uppercase     |
| Macro label C    | color `--color-accent-lavender`, uppercase|
| Macro label F    | color `--color-brand-primary`, uppercase  |

### Used on

Product / Dish detail · Recipe detail.

---

## 13 · ListItem

Tappable row with icon, title/sub, chevron.

| Token      | Value                                  |
| ---------- | -------------------------------------- |
| Min height | 56                                     |
| Padding    | `--space-lg`                           |
| Gap        | `--space-lg`                           |
| Icon       | 36 × 36 pill, bg `--color-bg-subtle`   |
| Title      | `--font-size-lg`, `--font-weight-semibold`|
| Sub        | `--font-size-sm`, `--color-text-secondary`|
| Chevron    | `›`, color `--color-text-muted`        |
| Hover      | bg `--color-bg-subtle`                 |

### Used on

Profile overview rows (Edit, Favorites, Reset).

---

## 14 · SummaryCard

Profile header card.

| Token           | Value                                         |
| --------------- | --------------------------------------------- |
| Padding         | `--space-2xl`                                 |
| Radius          | `--radius-xl`                                 |
| Bg              | `--color-bg-card`                             |
| Shadow          | `--shadow-sm`                                 |
| Greeting        | Fraunces 24 / 1.3 semibold                    |
| Goal value      | Inter 28 / 1.15 semibold, tabular-nums, color `--color-brand-primary` |
| Goal label      | `--font-size-sm`, `--color-text-secondary`    |
| Tags row        | gap `--space-xs`, wraps                       |

### Used on

Profile overview.

---

## 15 · EmptyState

Centered art + title + description + optional CTA.

| Token       | Value                                     |
| ----------- | ----------------------------------------- |
| Padding     | `--space-4xl --space-2xl`                 |
| Art bubble  | 88 × 88 pill, bg `--color-bg-subtle`, 36 px glyph |
| Title       | Fraunces 20 / 1.3 semibold                |
| Description | `--font-size-md`, `--color-text-secondary`, max-width 280 |
| CTA         | Button primary or secondary               |

### Used on

Search no-results · Favorites (per segment) · Recipes search no-match.

---

## 16 · TopAppBar

Sticky top bar; varies between tab roots and detail screens.

| Token           | Value                                |
| --------------- | ------------------------------------ |
| Height (min)    | 56                                   |
| Padding         | `--space-md --space-lg`              |
| Background      | `--color-bg-default`                 |
| Title           | Fraunces 20 / 1.3 semibold; centered when back/right action present, left-aligned at tab root |
| Icon button     | 44 × 44 pill, bg `--color-bg-card`, shadow `--shadow-sm`|

### Variants

- **detail** — back button left, optional right action right, title centered.
- **tab-root** — left-aligned title, no back button.

### Used on

All detail / sub-screens · Tab roots.

---

## 17 · BottomTabBar

3-tab spine. Visible on tab roots only.

| Token             | Value                                       |
| ----------------- | ------------------------------------------- |
| Bg                | `--color-bg-card`                           |
| Border-top        | 1 px `--color-border-default`               |
| Padding           | `--space-sm --space-sm --space-md`          |
| Tab button height | 56                                          |
| Active color      | `--color-brand-primary`                     |
| Inactive color    | `--color-text-muted`                        |
| Icon size         | 22                                          |
| Label             | `--font-size-xs`, `--font-weight-semibold`  |

### Tabs (MVP)

| Key       | Label     | Suggested icon |
| --------- | --------- | -------------- |
| calculate | Calculate | search glass   |
| recipes   | Recipes   | salad / book   |
| profile   | Profile   | person         |

### Used on

All three tab roots. Hidden on push detail screens.

---

## 18 · ConfirmDialog

Centered modal that replaces the native `confirm()` prompt — used for destructive actions where mobile-native prompts feel out-of-brand.

| Token        | Value                                   |
| ------------ | --------------------------------------- |
| Backdrop     | `rgba(42, 39, 48, 0.45)`                |
| Card bg      | `--color-bg-card`                       |
| Card radius  | `--radius-xl`                           |
| Card padding | `--space-2xl`                           |
| Max width    | 360                                     |
| Shadow       | `--shadow-lg`                           |
| Title        | Fraunces 20 / 1.3 semibold              |
| Message      | `--font-size-md`, `--color-text-secondary` |
| Actions      | flex row, equal-width buttons, gap `--space-sm` |

### Variants

- **default** — secondary cancel · primary confirm
- **destructive** — confirm button uses `--color-feedback-danger` background, on-brand text

### Behavior

- Esc key → cancel · Backdrop click → cancel · Confirm button receives `autoFocus`.

### Used on

Reset onboarding · Discard meal · Delete dish.

---

## 19 · BottomSheet

Slide-up modal anchored to the bottom edge — mobile-friendly alternative to a full dialog. Variants are content-driven (not separate components).

| Token            | Value                                       |
| ---------------- | ------------------------------------------- |
| Backdrop         | `rgba(42, 39, 48, 0.45)`                    |
| Sheet bg         | `--color-bg-card`                           |
| Sheet radius     | `--radius-xl --radius-xl 0 0` (top corners) |
| Sheet padding    | `--space-md` top, `--space-xl` sides, bottom + safe-area |
| Max width        | 480                                         |
| Max height       | 90vh                                        |
| Handle           | 40 × 4 pill, `--color-border-strong`, centered |
| Title            | Fraunces 18 / 1.3 semibold                  |
| Subtitle         | `--font-size-sm`, `--color-text-secondary`  |
| Thumb            | 56 × 56, radius `--radius-md`, bg `--color-bg-subtle` |
| Save toggle (in header) | 44 × 44, 1 px `--color-border-default`, no shadow |
| Input            | 1.5 px border `--color-border-default`, focus-coral |
| Destructive link | `--color-feedback-danger`, button-link style |

### Patterns

- **PortionPicker** (Calculate / food detail) — header (thumb + title + save) · NutritionStrip · NumberStepper + UnitSelector row · primary/secondary actions · optional "Remove from meal" destructive link.
- **NameDishSheet** (save meal as dish) — title block · single text input · primary/secondary actions.

### Behavior

- Esc → cancel · Backdrop click → cancel · Body scroll lock while open · Slide-up + fade animation (`--duration-base`).

### Used on

Calculate (food detail) · MealReview (save as dish) · SavedDishDetail (rename).

---

## 20 · LoadMoreButton

Round 44 px coral button with a circular reload glyph, centered below paginated lists.

| Token             | Value                                   |
| ----------------- | --------------------------------------- |
| Size              | 44 × 44                                 |
| Radius            | `--radius-pill`                         |
| Background        | `--color-brand-primary`                 |
| Background hover  | `--color-brand-primary-pressed`         |
| Foreground        | `--color-text-primary`                  |
| Shadow            | `--shadow-md`                           |
| Wrapper padding   | `--space-md` top, `--space-sm` bottom   |

### States

- **default** · **loading** (`is-loading`, 800 ms spin, opacity 0.7) · **disabled** (opacity 0.4) · **active** (rotate 180° + scale 0.96).

### Used on

Recipes search results (paginated load).

---

## 21 · DishCard

Saved meal row on the Calculate landing — shows dish name, ingredient summary, and total kcal.

| Token            | Value                                    |
| ---------------- | ---------------------------------------- |
| Container bg     | `--color-bg-card`                        |
| Container radius | `--radius-lg`                            |
| Padding          | `--space-md --space-lg`                  |
| Gap              | `--space-md`                             |
| Hover            | bg `--color-bg-subtle`                   |
| Title            | Fraunces 18 / 1.3 semibold               |
| Ingredients      | `--font-size-sm`, `--color-text-secondary`, 2-line clamp; falls back to `"N ingredients"` if joined names overflow |
| kcal value       | Inter 14 semibold, tabular-nums, right-aligned |
| kcal unit        | `--font-size-xs`, `--color-text-muted`   |

### Used on

Calculate landing — "My dishes" section.

---

## 22 · MealBar

Sticky cart-style strip — appears across the Calculate tab whenever the draft meal has items. Tap → opens MealReview.

| Token            | Value                                   |
| ---------------- | --------------------------------------- |
| Background       | `#FFD7CC` (light coral, 30 % over butter-cream) |
| Padding          | `--space-md --space-lg`                 |
| Min height       | 60 (12 + line-heights)                  |
| Position         | sticky, `bottom: 0`, z-index 10         |
| Shadow           | `0 -4px 12px rgba(0, 0, 0, 0.04)`        |
| Count label      | `--font-size-xs` semibold, uppercase, `letter-spacing-wide` |
| kcal             | Fraunces 18 / 1.3 semibold              |
| CTA pill         | bg `--color-brand-primary`, text `--color-text-primary`, padding `--space-sm --space-md`, radius `--radius-pill` |

### Variants

- **default** — sits above the BottomTabBar.
- **`--at-bottom`** — bar owns the bottom edge (no tab bar follows); adds safe-area padding.

### Behavior

- Hidden when `draftMeal.length === 0` · slide-up animation on first appearance · sticks during scroll.

### Used on

All Calculate tab screens except MealReview.

---

## 23 · RenameInput

Pill input with inline X-clear — used to rename a meal in MealReview.

| Token            | Value                                   |
| ---------------- | --------------------------------------- |
| Height           | 48                                      |
| Background       | `--color-bg-card`                       |
| Border-radius    | `--radius-pill`                         |
| Padding          | 0 `--space-sm` 0 `--space-lg`           |
| Gap              | `--space-sm`                            |
| Shadow           | `--shadow-sm`                           |
| Field typography | `--font-size-lg`                        |
| Clear button     | 28 × 28 pill, bg `--color-bg-subtle`, hover bumps to `--color-border-strong` |
| Focus ring       | 2 px coral, 2 px offset (on container)  |

### Difference vs SearchInput

No leading icon · larger 28 × 28 clear (vs 24 × 24) since the field is the primary editing surface, not a search affordance.

### Used on

MealReview (rename meal).

---

## 24 · DetailHero

Full-bleed 16 / 10 image at the top of a detail screen, with overlay back + right-action buttons.

| Token             | Value                                  |
| ----------------- | -------------------------------------- |
| Aspect ratio      | 16 / 10 (matches RecipeCard image)     |
| Background        | `--color-bg-subtle` (fallback)         |
| Image fit         | `object-fit: cover`                    |
| Placeholder glyph | 96 px emoji, `opacity: 0.6`            |
| Back button       | 44 × 44 pill, bg `--color-bg-card`, shadow `--shadow-sm`, top + safe-area / left `--space-md` |
| Save toggle       | `SaveButton` (44 × 44), top + safe-area / right `--space-md` |

### Used on

Recipe detail screen.

---

## Composite patterns (built from atoms — not separate components)

### PortionAdjuster (Calculate detail)

`NumberStepper (g) + UnitSelector (g · pieces · cups · tbsp · serving)`, gap `--space-md`, wraps on narrow.

### ServingsAdjuster (Recipe detail)

`NumberStepper` with unit "serving" / "servings", min 1.

### Recent search row

`ResultRow` with thumb glyph `↺`, no kcal — meta line shows time-ago.
