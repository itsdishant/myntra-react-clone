# Atelier — Fashion E-commerce UI

A Myntra-inspired fashion e-commerce clone rebuilt as an original brand with Amazon-lite shopping UX (filters, dense grid, search, PDP, bag).

## Brand Identity

**Atelier** — A design-first fashion marketplace with its own distinct design language.

### 4-Color Design System (Split-Complementary Harmony)

| Role          | Hue              | Hex                   | Usage                                               |
| ------------- | ---------------- | --------------------- | --------------------------------------------------- |
| **Primary**   | Deep Terracotta  | `#A63D2D`             | Brand identity, key CTAs, active states             |
| **Secondary** | Muted Teal       | `#3D7A7A`             | Supporting actions, filters, alternate CTAs         |
| **Accent**    | Warm Gold        | `#C4781E`             | Discount badges, ratings, highlights, search submit |
| **Neutral**   | Warm Stone scale | `#1C1C1B` – `#F5F0EB` | Text, borders, backgrounds, surfaces                |

**Typography:** Cormorant (display) + Montserrat (body/UI)  
**Max shell width:** 1600px

---

## Tech Stack

| Layer   | Choice                                                                                     |
| ------- | ------------------------------------------------------------------------------------------ |
| Runtime | React 19 + Vite 8                                                                          |
| Routing | React Router 7 **data API** (`createBrowserRouter` + `RouterProvider` in `src/router.jsx`) |
| UI      | MUI 9 (components/icons) + Tailwind CSS v4 (`@theme` tokens in `src/index.css`)            |
| Theme   | MUI `ThemeProvider` via `src/theme.js` + Atelier design tokens                             |
| State   | Redux Toolkit (`@reduxjs/toolkit` + `react-redux`) for cart state (`src/store/`)           |
| Data    | DummyJSON catalog API for Home & Product details                                           |
| Payment | Stripe Checkout API via Express backend (`server.js`) & Stripe Sandbox                     |

---

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

---

## Commands

```bash
npm run dev       # Start Vite dev server (port 5173)
node server.js    # Start Express backend server for Stripe Checkout (port 4000)
npm run build     # Production build
npm run lint      # Run ESLint
npm run format    # Format all files with Prettier
npm run preview   # Preview production build
```

---

## Code Style

- **Prettier** enforced via `prettier.config.json` with `prettier-plugin-tailwindcss`
- **ESLint** with React hooks + refresh plugins
- **Format on save** recommended (VS Code: `editor.formatOnSave: true`)

---

## Design System Tokens

All design tokens live in `src/index.css` under `@theme`:

- **Colors:** `--color-primary`, `--color-secondary`, `--color-accent`, `--color-neutral-*`, semantic aliases (`--color-background`, `--color-surface`, `--color-foreground`, etc.)
- **Typography:** `--font-display`, `--font-sans`
- **Shadows:** `--shadow-soft`, `--shadow-lift`, `--shadow-focus`
- **Layout:** `--max-width-shell`
- **Radius:** `--radius-xs` through `--radius-full`

Utility classes available in `@layer utilities`:

- `.text-primary`, `.text-secondary`, `.text-accent`, `.text-foreground`, `.text-foreground-muted`
- `.bg-primary`, `.bg-primary-soft`, `.bg-secondary`, `.bg-accent`, `.bg-surface`, `.bg-background`
- `.border-border`, `.border-primary`, `.border-secondary`, `.border-accent`

---

## Hard Rules

1. **Presentational pages/components** — no API calls in `pages/` or dumb `components/`
2. **React Router 7 data API** — `createBrowserRouter`, loaders/actions, `useLoaderData`, `RouterProvider`
3. **Keep Atelier styling** — rose/amber token palette, Cormorant display / Montserrat body; avoid generic themes (`design-system/atelier/MASTER.md` remains authoritative for styling contract)
4. **DummyJSON shape** — product objects must stay compatible with DummyJSON fields
5. **Amazon-lite catalog UX** — results-first home; sidebar filters; dense grid; whole card links to PDP
6. **Redux for Cart State** — RTK slice in `src/store/Bag.jsx` manages cart state
7. **`async function`**, never `function async`

---

## Routes

| Path           | Page                     | Loader / Source                              |
| -------------- | ------------------------ | -------------------------------------------- |
| `/`            | Home (catalog + filters) | `homeLoader` → DummyJSON `/products?limit=0` |
| `/product/:id` | Product detail           | `productLoader` → DummyJSON `/products/:id`  |
| `/bag`         | Cart                     | Redux store (`bag.items`)                    |
| `/success`     | Order confirmation       | Stripe Checkout Session verification API     |

---

## Project Structure (Key Files)

```text
├── server.js                    # Express server for Stripe Checkout APIs
├── .env.example                 # Tracked template for required env keys (STRIPE_SECRET_KEY, PORT, FRONTEND_URL, VITE_API_BASE_URL)
│                                # Verify template tracking with: git check-ignore -v .env.example
├── src/
│   ├── main.jsx                 # React root render: Provider, ThemeProvider, AppRouter
│   ├── router.jsx               # Router setup, loaders, route wrappers, RootErrorElement
│   ├── App.jsx                  # App shell
│   ├── index.css                # Tailwind v4 @theme (ALL design tokens)
│   ├── theme.js                 # MUI theme (mirrors CSS tokens)
│   ├── pages/
│   │   ├── Home.jsx             # Catalog page (presentational)
│   │   ├── Product.jsx          # PDP (presentational)
│   │   ├── Bag.jsx              # Cart page (presentational)
│   │   └── Success.jsx          # Order confirmation page (Stripe post-checkout)
│   ├── components/
│   │   ├── Header.jsx           # Sticky header with search + cart
│   │   ├── HomeItem.jsx         # Product card
│   │   ├── FilterSidebar.jsx    # Amazon-lite filters
│   │   ├── ResultsToolbar.jsx   # Sort, page size, filter chips
│   │   ├── BagItem.jsx          # Cart line item
│   │   ├── BagSummary.jsx       # Order summary panel
│   │   ├── CatalogPagination.jsx
│   │   ├── Footer.jsx
│   │   └── LoadingSpinner.jsx
│   ├── utils/
│   │   ├── filters.js           # Pure filter/sort/search helpers
│   │   └── product.js           # Price formatting, dimensions
│   └── store/
│       ├── Store.jsx            # Redux store configuration
│       └── Bag.jsx              # Redux bag slice (cart state & actions)
├── design-system/atelier/
│   ├── MASTER.md                # Global design rules
│   └── pages/*.md               # Per-page overrides
├── prettier.config.json         # Prettier + Tailwind plugin config
├── eslint.config.js
├── vite.config.js
└── CLAUDE.md                    # Agent guidance for this repo
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Format codebase
npm run format

# Lint
npm run lint

# Build for production
npm run build
```

---

## License

Private project — not for distribution.
