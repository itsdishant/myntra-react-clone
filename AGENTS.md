# AGENTS.md — Atelier (myntra-react-clone)

Agent memory for this repo. Prefer current React / React Router patterns; keep pages presentational.

---

## Project overview

**Atelier** is a fashion e-commerce UI inspired by a Myntra-style catalog, rebuilt as an original brand with Amazon-lite shopping UX (filters, dense grid, search, PDP, bag).

- Brand: **Atelier** (rose `#BE185D`, amber `#D97706`, Cormorant + Montserrat)
- Goal: design-first, dumb/presentational components; data wiring lives in routers/wrappers (and later Redux)
- Product shape: DummyJSON `/products` compatible
- Home and product detail load from DummyJSON via route loaders; client filter/sort/search runs on the loaded catalog

Routes:

| Path           | Page                     |
| -------------- | ------------------------ |
| `/`            | Home (catalog + filters) |
| `/product/:id` | Product detail           |
| `/bag`         | Bag / cart               |

---

## Tech stack

| Layer   | Choice                                                                           |
| ------- | -------------------------------------------------------------------------------- |
| Runtime | React 19 + Vite 8                                                                |
| Routing | React Router 7 **data API**: `createBrowserRouter` + `RouterProvider`            |
| UI      | MUI 9 (components/icons) + Tailwind CSS v4 (`@theme` tokens in `src/index.css`)  |
| Theme   | MUI `ThemeProvider` via `src/theme.js` + Atelier design tokens                   |
| State   | Redux Toolkit (`@reduxjs/toolkit` + `react-redux`) for cart state (`src/store/`) |
| Data    | DummyJSON catalog API for Home & Product details                                 |

**Do not** introduce Bootstrap or the legacy `BrowserRouter` + `<Routes>` tree.

---

## Architecture

```
src/
  main.jsx          # App bootstrap: Redux Provider, MUI ThemeProvider, AppRouter
  router.jsx        # Routes, loaders (homeLoader, productLoader), preview wrappers, RootErrorElement
  App.jsx           # Shell: Header + <Outlet context> + Footer
  pages/            # Presentational pages (Home, Product, Bag) — props in, UI out
  components/       # Presentational UI pieces
  utils/            # Pure helpers (filters, product formatting)
  store/            # Redux store (`Store.jsx`) and bag slice (`Bag.jsx`)
design-system/atelier/
  MASTER.md         # Global design rules
  pages/*.md        # Per-page overrides (win over MASTER)
```

**Data flow**

1. `createBrowserRouter` owns routes; layout route `RootLayout` owns header search draft/committed query.
2. `App` renders chrome and passes `{ searchQuery, onClearSearch }` via `<Outlet context>`.
3. Pages stay dumb: `Home` / `Product` / `Bag` receive props; no fetching inside them.
4. Wire fetching in **loaders / route wrappers / future store**, not in leaf UI.
5. Filter/sort helpers are pure functions in `src/utils/filters.js`.

**Design**

- Follow `design-system/atelier/MASTER.md`; if `design-system/atelier/pages/<page>.md` exists, it overrides MASTER.
- Shell width token: `--max-width-shell` → `max-w-shell` (1600px).
- Header: light Atelier white/blur — logo + large search + cart only (no wishlist/profile nav).

---

## Hard rules

1. **Presentational pages/components** — no API calls, no store subscriptions in `pages/` or dumb `components/` unless explicitly asked.
2. **Prefer latest React Router** — `createBrowserRouter`, loaders/actions, `useLoaderData`, `RouterProvider`. No new `BrowserRouter` / nested `<Routes>` trees.
3. **Prefer modern React** — functional components, hooks; use current patterns going forward (do not pile on every React API “just because”).
4. **Keep Atelier styling** — rose/amber tokens, Cormorant display / Montserrat body; avoid generic Inter/Roboto and default purple AI themes.
5. **DummyJSON shape** — product objects must stay compatible with DummyJSON fields used by the UI (reviews, meta, dimensions, discountPercentage, etc.).
6. **Amazon-lite catalog UX** — results-first home (no editorial hero); sidebar filters; dense grid; whole card links to PDP; cart actions `stopPropagation`.
7. **Don’t wire Redux** until asked — RTK is installed for later; leave bag mock wiring in `main.jsx` for now.
8. **Don’t expand scope** — no drive-by refactors, no unsolicited README/docs beyond what was requested.
9. **`async function`**, never `function async`.
10. **Design system overrides** — page MD files beat MASTER when both apply.
11. **Run Prettier after changes** — Always run `npx prettier --write .` (or `npm run format`) for proper code formatting after making any file changes.

---

## Gotchas

- **Home loader:** `homeLoader` fetches `https://dummyjson.com/products?limit=0` and returns `{ items }`; `HomePreview` reads it via `useLoaderData()`.
- **Loader return shape:** `productLoader` must return `{ item }` — `ProductPreview` does `const { item } = useLoaderData()`.
- **404s:** failed product fetches should `throw new Response(..., { status: 404 })` (data router), not swallow errors into `[]`.
- **Search is two-step:** `searchDraft` (input) vs `searchQuery` (committed on submit); clearing chips must call `onClearSearch` from outlet context.
- **Outlet context:** Home must use `useOutletContext()` for search; don’t re-invent search state inside `Home.jsx`.
- **Tailwind v4:** tokens live in `@theme` in `index.css`; MUI `sx` / `className` often need `!` important utilities when fighting MUI defaults.
- **Fast refresh lint:** defining route components in `main.jsx` triggers `react-refresh/only-export-components` — expected until wrappers move to their own files.
- **Empty store file:** `src/store/Bag.jsx` is a stub; don’t assume Redux bag state exists.
- **Favicon / brand:** public Atelier “A” SVG; keep brand visible in header, not only in copy.
- **Bag fixtures:** `mockBagItems` / `mockBagSummary` are static demos — cart actions on PDP are presentational until wired.

---

## Quick commands

```bash
npm run dev
npm run build
npm run lint
```

API reference: https://dummyjson.com/products
