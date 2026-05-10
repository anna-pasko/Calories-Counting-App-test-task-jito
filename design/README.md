# `design/` — Component Library

Framework-agnostic component library for the Calories Counting App.

## Files

| File              | Purpose                                                                            |
| ----------------- | ---------------------------------------------------------------------------------- |
| `tokens.css`      | CSS custom properties mirroring `../design-tokens.json`. Loaded once at the root.  |
| `components.css`  | All 27 component styles. Uses tokens via `var()`. Load after `tokens.css`.         |
| `preview.html`    | Self-contained gallery page. Open in any browser. No build step.                   |
| `components.tsx`  | React + TypeScript reference implementations. One file, named exports.             |
| `COMPONENTS.md`   | Per-component spec sheet (anatomy, tokens, states). Source of truth for Figma.     |

## How they relate

```
design-tokens.json   ──(manual sync)──▶   tokens.css
                                              │
                                              ▼
                                        components.css
                                              │
                          ┌───────────────────┼───────────────────┐
                          ▼                   ▼                   ▼
                    preview.html        components.tsx       (your app)
                  (visual gallery)    (React reference)   (any framework)
```

## Preview

Open `preview.html` in any browser. The gallery renders every component in key states. Use it for visual QA and to screenshot sections for Figma.

## Use in a React app

1. Copy `tokens.css` and `components.css` into your app (e.g. `src/styles/`).
2. Import them once at the root, in order:
   ```ts
   import "./styles/tokens.css";
   import "./styles/components.css";
   ```
3. Copy `components.tsx` into `src/components/` (or split per component as the project grows).
4. Load Fraunces and Inter — either link the Google Fonts CSS in `<head>` (see `preview.html`) or self-host.

## Use in Vue / Svelte / SolidJS

The CSS layer is portable. Re-implement the JSX in your framework's template syntax — class names stay identical.

## Use in React Native

Tokens transfer (port `design-tokens.json` to a JS object), but `StyleSheet` rules need rewriting. The component anatomy and visual specs in `COMPONENTS.md` are the authoritative reference.

## Editing tokens

`../design-tokens.json` is the source of truth. After changing values there:

1. Update `tokens.css` to match (only the `:root` declarations need editing — primitives and semantic).
2. Visually verify by opening `preview.html`.
3. Re-import the JSON into Tokens Studio in Figma to keep Figma variables in sync.

## What's not included yet (deferred)

- **Shadow tokens** — only `--shadow-sm/md/lg` placeholders. Refine when the first card/modal needs them.
- **Dark mode** — single mode (Light) for v0. Add a `[data-theme="dark"]` block to `tokens.css` when needed.
- **Motion tokens** — minimal (`--duration-fast`, `--duration-base`, `--easing-standard`). Extend per pattern.
- **Icon set** — Lucide (`lucide-react` in the app, inlined SVG sprite in `preview.html`).
