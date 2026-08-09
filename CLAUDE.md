# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Atelier** — A fashion e-commerce UI inspired by Myntra, rebuilt as an original brand with Amazon-lite shopping UX (filters, dense grid, search, PDP, bag).

- **Brand**: Atelier (rose `#BE185D`, amber `#D97706`, Cormorant + Montserrat)
- **Architecture**: Design-first, dumb/presentational components; data wiring in router/wrappers and Redux store
- **Product shape**: DummyJSON `/products` compatible
- **Routes**: `/` (Home/catalog), `/product/:id` (Product detail), `/bag` (Cart), `/success` (Order confirmation)

## Tech Stack

| Layer   | Choice                                                                                    |
| ------- | ----------------------------------------------------------------------------------------- |
| Runtime | React 19 + Vite 8                                                                         |
| Routing | React Router 7 **data API**: `createBrowserRouter` + `RouterProvider` in `src/router.jsx` |
| UI      | MUI 9 (components/icons) + Tailwind CSS v4 (`@theme` tokens in `src/index.css`)           |
| Theme   | MUI `ThemeProvider` via `src/theme.js` + Atelier design tokens                            |
| State   | Redux Toolkit (`@reduxjs/toolkit` + `react-redux`) for cart state (`src/store/`)          |
| Data    | DummyJSON catalog API for Home & Product details                                          |
| Payment | Stripe Checkout API via Express backend (`server.js`) & Stripe Sandbox                    |

**Do not** introduce Bootstrap or legacy `BrowserRouter` + `<Routes>`.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
npm run format   # Format all files with Prettier
npm run preview  # Preview production build
```

## Architecture

```text
server.js         # Node/Express backend for Stripe Checkout Session API (port 4000)
src/
  main.jsx        # App bootstrap: Redux Provider, MUI ThemeProvider, AppRouter
  router.jsx      # Routes, loaders, preview wrappers, RootErrorElement, Success route
  App.jsx         # Shell: Header + <Outlet context> + Footer
  pages/          # Presentational pages (Home, Product, Bag, Success) — props in, UI out
  components/     # Presentational UI pieces
  utils/          # Pure helpers (filters, product formatting)
  store/          # Redux store (`Store.jsx`) and bag slice (`Bag.jsx`)
```

### Data Flow

1. `createBrowserRouter` in `src/router.jsx` owns routes; layout route `RootLayout` owns header search draft/committed query.
2. `App` renders chrome and passes `{ searchQuery, onClearSearch }` via `<Outlet context>`.
3. Redux store (`src/store/Bag.jsx`) manages cart items, quantities, and cart modifications.
4. Pages stay dumb: `Home` / `Product` / `Bag` receive props; no direct API fetching inside leaf pages.
5. Filter/sort helpers are pure functions in `src/utils/filters.js`.

### Key Patterns

- **Loaders**: `homeLoader` fetches from DummyJSON `/products?limit=0`; `productLoader` fetches from DummyJSON `/products/:id`.
- **Error Boundaries**: `RootErrorElement` in `src/router.jsx` catches thrown loader responses and renders a recoverable error UI.
- **Preview wrappers** (`HomePreview`, `ProductPreview`, `BagPreview`) bridge loader data and Redux store state to presentational page components.
- **Stripe Integration**: `BagPreview` POSTs to `http://localhost:4000/api/create-checkout-session` for Stripe Checkout redirect; `/success` page fetches payment confirmation details via `GET /api/checkout-session/:sessionId` and dispatches `clearBag()`.
- **Search is two-step**: `searchDraft` (input) vs `searchQuery` (committed on submit); clearing chips calls `onClearSearch` from outlet context.
- **Outlet context**: `Home` uses `useOutletContext()` for search; don't re-invent search state inside `Home.jsx`.
- **404s**: failed product fetches throw `new Response(..., { status: 404 })` (data router), preserving response status codes.

## Design System

- Follow `design-system/atelier/MASTER.md`; page MD files override MASTER.
- Shell width token: `--max-width-shell` → `max-w-shell` (1600px).
- Header: light Atelier white/blur — logo + large search + cart only.
- **Tailwind v4**: tokens live in `@theme` in `index.css`; MUI `sx` / `className` often need `!` important utilities when fighting MUI defaults.
- **Colors**: rose (`primary`), amber (`accent`/`warning`), slate neutrals.
- **Fonts**: Cormorant (display), Montserrat (body/UI).
- **Shadows**: `shadow-soft`, `shadow-lift`.

## Hard Rules

1. **Presentational pages/components** — no direct API calls in `pages/` or dumb `components/`.
2. **Prefer latest React Router** — `createBrowserRouter`, loaders/actions, `useLoaderData`, `RouterProvider` in `src/router.jsx`.
3. **Prefer modern React** — functional components, hooks; use current patterns going forward.
4. **Keep Atelier styling** — rose/amber tokens, Cormorant display / Montserrat body; avoid generic Inter/Roboto and default purple AI themes.
5. **DummyJSON shape** — product objects must stay compatible with DummyJSON fields used by the UI (reviews, meta, dimensions, discountPercentage, etc.).
6. **Amazon-lite catalog UX** — results-first home (no editorial hero); sidebar filters; dense grid; whole card links to PDP; cart actions `stopPropagation`.
7. **Redux for Cart State** — RTK slice in `src/store/Bag.jsx` manages cart state (`addToBag`, `removeFromBag`, `updateQuantity`, `clearBag`).
8. **Don't expand scope** — no drive-by refactors, no unsolicited README/docs beyond what was requested.
9. **`async function`**, never `function async`.
10. **Design system overrides** — page MD files beat MASTER when both apply.

## Gotchas

- **Fast Refresh Cleanliness**: `src/router.jsx` is isolated from `main.jsx` so React Fast Refresh works without `react-refresh/only-export-components` lint errors.
- **Favicon / brand**: public Atelier "A" SVG; keep brand visible in header, not only in copy.
- **Tailwind + MUI conflicts**: use `!` important utilities (e.g., `bg-primary!`) when MUI defaults override Tailwind classes.
