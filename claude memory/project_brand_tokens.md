---
name: Brand tokens v0 — type, color, radii
description: Concrete starting tokens for the Soft & Playful brand — fonts, palette hexes, radii, shadow direction
type: project
---

Locked-in v0 brand tokens for the Calories Counting App. Decided 2026-05-07 alongside the Soft & Playful brand mood. Treat as starting tokens — refine on first real screen build.

**Type**
- Display: **Fraunces** (variable — use soft + wonk axes for warmth without going cartoony)
- UI / Body: **Inter** (variable — enable tabular figures `font-feature-settings: "tnum"` for calorie and macro numbers)
- Both free on Google Fonts.

**Surfaces**
- `bg` `#FFF8EE` (butter cream)
- `card` `#FFFFFF`
- `subtle` `#F5EFE3` (raised-but-quiet sections)

**Text**
- `text-primary` `#2A2730`
- `text-secondary` `#6F6878`
- `text-muted` `#A39CAB`

**Brand**
- `primary` `#FF8A7A` (coral — main CTAs, brand moments)
- `primary-pressed` `#F26F5E`

**Accent palette** (categories, charts, celebrations, illustrations)
- `mint` `#5FD49E`
- `sky` `#7CC2F2`
- `lavender` `#B8A4FF`
- `butter` `#FFD86B`

**Semantic**
- `success` = mint `#5FD49E`
- `warning` = butter `#FFD86B`
- `danger` `#E5544A` (deeper coral so it reads as alert, not brand)

**Radii** (rounded — central to the playful mood)
- `sm` 8 · `md` 12 · `lg` 16 · `xl` 24 · `pill` 999
- Cards: `lg`; Buttons: `pill` or `lg`; Inputs: `md`.

**Spacing scale** (t-shirt sizing, 4px base, mobile-first)
- `0` 0 · `xs` 4 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 20 · `2xl` 24 · `3xl` 32 · `4xl` 40 · `5xl` 48 · `6xl` 64

**Type ramp** (composite styles — Fraunces for display/heading, Inter for body/label/numeric)
- `display/xl` Fraunces 48/1.15 regular — hero / celebratory (e.g. total daily calories)
- `display/lg` Fraunces 36/1.15 regular — onboarding hero, big empty-state
- `heading/lg` Fraunces 24/1.3 semibold — screen title
- `heading/md` Fraunces 20/1.3 semibold — card title, section header
- `heading/sm` Fraunces 18/1.3 semibold — subsection
- `body/lg` Inter 16/1.45 regular — default reading
- `body/md` Inter 14/1.45 regular — secondary
- `body/sm` Inter 13/1.45 regular — helper text
- `label/md` Inter 16/1.3 semibold — button, tab label
- `label/sm` Inter 12/1.3 medium, +0.02em — form label, caption, micro-copy
- `numeric/xl` Inter 48/1.15 semibold (tabular figures) — big calorie number
- `numeric/md` Inter 16/1.15 semibold (tabular figures) — inline stat
- Always enable Inter tabular figures (`font-feature-settings: "tnum"`) anywhere a number is shown.

**Shadow direction**
- Soft, low-spread elevations only. No hard drop shadows. Prefer 1–2 layered shadows with low alpha.

**Why:** The chosen brand mood (project_brand_mood.md) is Soft & Playful — pastel base, rounded vibrant accents, friendly low-stakes tone. Pairing personality-rich Fraunces headlines with neutral, numerals-strong Inter keeps the Calculate tab credible while letting Recipes and celebratory moments feel warm. Coral was chosen as primary (over mint/lavender) because it's energetic without being childish and pairs well with the butter base.

**How to apply:** Use these tokens as the source of truth for any UI work in this project — color, type, radii, shadow. Reject suggestions that introduce hard shadows, sharp corners, neon/electric accents, or serif body type. If a screen needs a token that isn't defined here (e.g., chart palette extension, dark mode), propose the addition explicitly rather than improvising.
