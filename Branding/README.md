# Branding

A magazine-collage stylescape for the **Calories Calculator** app, modeled after the references in `../examples/` (Soccer Game, The Digital Archive, The Gallery, Nike).

## Files

| File              | Purpose                                                                            |
| ----------------- | ---------------------------------------------------------------------------------- |
| `stylescape.html` | Source of truth. Self-contained — open in any browser, no build step.              |
| `stylescape.png`  | 1500 × 400 PNG export (rendered via headless Edge). 30 : 8 banner ratio.           |

## Format

**1500 × 400 px · 30 : 8 ratio.** Single horizontal banner, designed to live in a portfolio strip or as a hero on a brand-summary page. The whole composition is anchored to that fixed canvas — overflowing typography is intentionally cropped at the edges.

## What's in the banner (left → right, plus floating elements)

### Anchor tiles

1. **Vertical marquee** — ink-black sidebar running the full left edge with a repeating `CALORIES CALCULATOR` word-mark (echoes the dark sidebar in the soccer reference).
2. **Brand block** (coral) — `No 01 / Soft & Playful` edition tag, `Calories Calculator` title set in Fraunces (regular for "Calories", italic regular for "Calculator"), and the real green pear app icon in a cream-framed 96 × 96 sub-tile that mirrors the Welcome onboarding screen.
3. **Huge type** (cream) — oversized italic Fraunces `EAT FRESH*` headline cropped at the top and left, with a brand-vibe caption underneath: *Brand vibe — pastel base, vibrant accents, friendly tone*.
4. **Calculate phone** (white, rotated −2°) — the search flow with one item already added: search bar, three result rows (oatmeal, banana w/ mint check, almond milk), and the live MealBar showing `1 ITEM · 105 kcal · View meal ›`.
5. **Recipe phone** (white, rotated +3°) — salad hero, recipe title, kcal/time meta, the three real badge tones (Fits you · Vegan · GF), and a centered servings stepper.
6. **Tagline tile** (ink) — *Find food. Find recipes. That fit you.* with a coral `↓ Download the app` CTA.
7. **Stat tile** (butter) — `2,150` daily-goal hero number with the line *a friendly number, not finger-wagging*.
8. **Tone of voice** (coral) — italic pull-quote (*"Three questions and you're in."*) with the three brand keywords (Soft / Playful / Low-stakes).
9. **Palette** (paper) — five brand colors stacked with hex codes (Coral · Mint · Sky · Lavender · Butter).

### Floating decorations (the chaos layer)

- **`100% playful`** mint circle, rotated −12°, straddling the brand + huge-type boundary
- **`$0 / month · forever`** white pill with ink border, rotated −6°, anchored above the huge-type tile
- **`Works offline`** ink circle, rotated +10°, sitting between the two phones
- **`Fresh!`** coral italic pill, rotated +8°, overlapping the recipe phone hero
- **`→ Try it · free forever`** butter pill, rotated −4°, bottom-right corner
- **Asterisks** in coral, mint-text, and lavender-text, scattered across the canvas at varying sizes and angles
- **Yellow tape strips** with dashed-edge texture, slapped onto the corners of both phone mockups (digital-archive vibe)

## Why these choices

- **Pastel base + vibrant rounded accents** — the brand mood approved 2026-05-07.
- **Fraunces (display, regular + italic) + Inter (body, 400/700/800, tabular nums)** — the type system used in the app.
- **Real component pieces** — every phone mockup uses the actual ResultRow / MealBar / RecipeCard / Chip patterns from `design/components.css`. Nothing is invented for the banner.
- **Coral as the through-line** — primary brand color appears in the title, the recipe gradient, the CTA pill, the tone tile, the asterisks, and the "Fresh!" sticker, so the eye knows what's brand at a glance.
- **Chaos via rotation, overlap, and cropping** — five rotated stickers, two tilted phones, one cropped headline, scattered asterisks, and tape strips break the grid the way the reference banners do.

## How to regenerate the PNG

The PNG is just a screenshot of the HTML at fixed dimensions. Two options:

### Option A — headless Edge (or Chrome)

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
  --headless=new --disable-gpu --hide-scrollbars `
  --window-size=1564,464 `
  --screenshot="$PWD\Branding\stylescape.png" `
  "file:///$PWD/Branding/stylescape.html"
```

The window size is `canvas + body padding ×2` (1500 + 64 wide, 400 + 64 tall).

### Option B — manual screenshot

Open `stylescape.html` in any browser at 100 % zoom, screenshot the canvas (the cream rectangle inside the dark backdrop).

## Editing

Open `stylescape.html` and edit. The tokens at the top of the `<style>` block mirror `design/tokens.css` — keep them in sync. Tile positions are absolute (every `.tile` has explicit `top`/`left`/`width`/`height`) so you can nudge a single tile without disturbing the others. Floating stickers and asterisks live at the bottom of the markup with inline `style="top: …; left: …; transform: rotate(…)"` for fine-tuning.

## Inspiration

The reference banners in `../examples/` (Soccer Game, The Digital Archive, The Gallery) use the same magazine-collage construction — bold display headlines, multiple small mockups at different angles, rotated stickers with playful copy, and ornaments (asterisks, tape strips, repeating word-marks). This stylescape applies that grammar to a single product brand.
