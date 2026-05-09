# Calories Calculator

A mobile-first web app for finding calories on any food and discovering recipes that fit your diet.

> Brand: Soft & Playful · Stack: Vite + React + TypeScript + Zustand · Data: Open Food Facts (foods) + curated JSON (recipes) · Hosting: free on Vercel.

---

## Run it locally

You need **Node.js** installed (one-time setup, free, ~5 minutes).

1. Download Node.js from <https://nodejs.org/> — click the green **LTS** button. Run the installer, click "Next" through everything.
2. Open a fresh PowerShell window in this project folder.
3. Install dependencies (~2 min, only needed once):
   ```powershell
   npm install
   ```
4. Start the app:
   ```powershell
   npm run dev
   ```
5. Open the URL it prints (usually <http://localhost:5173>) in your browser. On a phone connected to the same Wi-Fi, use the "Network" URL it prints.

To stop the app, press `Ctrl+C` in the terminal.

## Deploy it for free

1. Create a free account on <https://vercel.com/>.
2. Connect this GitHub repo to Vercel.
3. Vercel will detect Vite automatically; click **Deploy**. You'll get a public URL like `your-app.vercel.app`.

Every push to `main` deploys automatically.

---

## Project layout

```
.
├── design/                    Design system (tokens, components, gallery, specs)
│   ├── tokens.css             CSS variables (colors, spacing, type)
│   ├── components.css         All 17 component styles
│   ├── components.tsx         React + TS reference components
│   ├── preview.html           Standalone gallery — open in browser
│   └── COMPONENTS.md          Per-component spec sheet (anatomy, tokens, states)
│
├── design-tokens.json         Tokens Studio JSON (source of truth for tokens)
├── information-architecture.md  IA: 7 screens, 3-tab spine, navigation rules
├── user-flows.md              Per-feature user flows
├── claude memory/             Persistent project memory (mood, tokens, stack, IA)
│
├── src/                       App code
│   ├── main.tsx               Entry: mounts React, loads CSS
│   ├── App.tsx                Shell: onboarding gate + 3-tab + push navigation
│   ├── index.css              Imports design tokens & components, app layout
│   ├── data/
│   │   ├── types.ts           Food, Recipe, dietary tags, etc.
│   │   ├── openFoodFacts.ts   Live foods API wrapper (no API key needed)
│   │   ├── recipes.json       Curated recipes
│   │   ├── recipes.ts         Recipe search & filter helpers
│   │   └── source.ts          DataSource interface (single import for screens)
│   ├── store/
│   │   └── useApp.ts          Zustand store (prefs, navigation, favorites, recents)
│   └── screens/               One file per IA screen
│       ├── Onboarding.tsx
│       ├── Calculate.tsx
│       ├── Recipes.tsx
│       ├── RecipeDetail.tsx
│       ├── Profile.tsx
│       ├── ProfileEdit.tsx
│       └── ProfileFavorites.tsx
│
├── public/                    Static assets (favicon, PWA manifest)
├── index.html                 HTML entry — Google Fonts, root mount point
├── package.json               Dependencies + scripts
└── vite.config.ts             Build config
```

## How the pieces fit

- **`src/screens/`** call **`src/data/source.ts`** for everything — never `fetch()` directly.
- **`src/screens/`** import components from **`design/components.tsx`** — never write new UI primitives without first checking the design folder.
- **State** (prefs, favorites, recents, navigation) flows through **`src/store/useApp.ts`** — automatically persists to `localStorage`.
- **Navigation** uses per-tab stacks (`useApp.push/pop/setActiveTab`) — no React Router.

## What's curated and what's live

- **Foods**: live from Open Food Facts. Real product database, ~3 million items, no API key.
- **Recipes**: 12 curated recipes in `src/data/recipes.json`. Add more by editing the JSON; the app picks them up on save.

## Notes

- **No accounts, no server.** All user data (preferences, favorites, recent searches) is stored in the browser's `localStorage`. Clearing browser data resets the app.
- **Add to Home Screen** on iPhone or Android to install as a PWA — works offline for the static parts, falls back gracefully when offline (food search needs internet).
- **Icons** in v0 are emoji placeholders. Plan to swap to a real icon library (Lucide is recommended) before final.
