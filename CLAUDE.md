# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Atelier** — A fashion e-commerce UI inspired by Myntra, rebuilt as an original brand with Amazon-lite shopping UX (filters, dense grid, search, PDP, bag).

- **Brand**: Atelier (rose `#BE185D`, amber `#D97706`, Cormorant + Montserrat)
- **Architecture**: Design-first, dumb/presentational components; data wiring in route loaders/wrappers
- **Product shape**: DummyJSON `/products` compatible (`src/data/mockItems.js`)
- **Routes**: `/` (Home/catalog), `/product/:id` (Product detail), `/bag` (Cart)

## Tech Stack

| Layer   | Choice                                                                                                          |
| ------- | --------------------------------------------------------------------------------------------------------------- |
| Runtime | React 19 + Vite 8                                                                                               |
| Routing | React Router 7 **data API**: `createBrowserRouter` + `RouterProvider`                                           |
| UI      | MUI 9 (components/icons) + Tailwind CSS v4 (`@theme` tokens in `src/index.css`)                                 |
| Theme   | MUI `ThemeProvider` via `src/theme.js` + Atelier design tokens                                                  |
| State   | Local React state in route wrappers; `@reduxjs/toolkit` installed but **not wired** (`src/store/Bag.jsx` empty) |
| Data    | Mock catalog + DummyJSON for PDP loader                                                                         |

**Do not** introduce Bootstrap or legacy `BrowserRouter` + `<Routes>`.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

```
src/
  main.jsx          # Router, loaders, hybrid preview wrappers (HomePreview, ProductPreview, RootLayout)
  App.jsx           # Shell: Header + <Outlet context> + Footer
  pages/            # Presentational pages (Home, Product, Bag) — props in, UI out
  components/       # Presentational UI pieces
  data/mockItems.js # DummyJSON-shaped mock catalog + bag fixtures
  utils/            # Pure helpers (filters, product formatting)
  store/            # Redux home (not wired yet)
```

### Data Flow

1. `createBrowserRouter` owns routes; layout route `RootLayout` owns header search draft/committed query.
2. `App` renders chrome and passes `{ searchQuery, onClearSearch }` via `<Outlet context>`.
3. Pages stay dumb: `Home` / `Product` / `Bag` receive props; no fetching inside them.
4. Wire fetching in **loaders / route wrappers / future store**, not in leaf UI.
5. Filter/sort helpers are pure functions in `src/utils/filters.js`.

### Key Patterns

- **Loaders**: `homeLoader` fetches from DummyJSON; `productLoader` returns `{ item }`; `bagLoader` returns mock fixtures.
- **Preview wrappers** (`HomePreview`, `ProductPreview`) read loader data via `useLoaderData()` and manage local UI state (filters, sort, pagination, image selection).
- **Search is two-step**: `searchDraft` (input) vs `searchQuery` (committed on submit); clearing chips calls `onClearSearch` from outlet context.
- **Outlet context**: `Home` must use `useOutletContext()` for search; don't re-invent search state inside `Home.jsx`.
- **404s**: failed product fetches throw `new Response(..., { status: 404 })` (data router), not swallow errors into `[]`.

## Design System

- Follow `design-system/atelier/MASTER.md`; page MD files override MASTER.
- Shell width token: `--max-width-shell` → `max-w-shell` (1600px).
- Header: light Atelier white/blur — logo + large search + cart only.
- **Tailwind v4**: tokens live in `@theme` in `index.css`; MUI `sx` / `className` often need `!` important utilities when fighting MUI defaults.
- **Colors**: rose (`primary`), amber (`accent`/`warning`), slate neutrals.
- **Fonts**: Cormorant (display), Montserrat (body/UI).
- **Shadows**: `shadow-soft`, `shadow-lift`.

## Hard Rules

1. **Presentational pages/components** — no API calls, no store subscriptions in `pages/` or dumb `components/` unless explicitly asked.
2. **Prefer latest React Router** — `createBrowserRouter`, loaders/actions, `useLoaderData`, `RouterProvider`. No new `BrowserRouter` / nested `<Routes>` trees.
3. **Prefer modern React** — functional components, hooks; use current patterns going forward.
4. **Keep Atelier styling** — rose/amber tokens, Cormorant display / Montserrat body; avoid generic Inter/Roboto and default purple AI themes.
5. **DummyJSON shape** — product objects must stay compatible with DummyJSON fields used by the UI (reviews, meta, dimensions, discountPercentage, etc.).
6. **Amazon-lite catalog UX** — results-first home (no editorial hero); sidebar filters; dense grid; whole card links to PDP; cart actions `stopPropagation`.
7. **Don't wire Redux** until asked — RTK is installed for later; leave bag mock wiring in `main.jsx` for now.
8. **Don't expand scope** — no drive-by refactors, no unsolicited README/docs beyond what was requested.
9. **`async function`**, never `function async`.
10. **Design system overrides** — page MD files beat MASTER when both apply.

## Gotchas

- **Fast refresh lint**: defining route components in `main.jsx` triggers `react-refresh/only-export-components` — expected until wrappers move to their own files.
- **Empty store file**: `src/store/Bag.jsx` is a stub; don't assume Redux bag state exists.
- **Favicon / brand**: public Atelier "A" SVG; keep brand visible in header, not only in copy.
- **Bag fixtures**: `mockBagItems` / `mockBagSummary` are static demos — cart actions on PDP are presentational until wired.
- **Tailwind + MUI conflicts**: use `!` important utilities (e.g., `bg-primary!`) when MUI defaults override Tailwind classes.
