import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Bag from "./pages/Bag.jsx";
import Product from "./pages/Product.jsx";
import theme from "./theme.js";
import { mockBagItems, mockBagSummary } from "./data/mockItems.js";
import {
  DEFAULT_FILTERS,
  DEFAULT_PAGE_SIZE,
  buildFacetsWithCounts,
  filterProducts,
  searchProducts,
  sortProducts,
  getActiveFilterChips,
  removeFilterChip,
} from "./utils/filters.js";
import "./index.css";

async function homeLoader() {
  const response = await fetch("https://dummyjson.com/products?limit=0");
  if (!response.ok) {
    throw new Response("Failed to load products", {
      status: response.status,
      statusText: response.statusText,
    });
  }
  const data = await response.json();
  return { items: data.products };
}

async function productLoader({ params }) {
  const response = await fetch(`https://dummyjson.com/products/${params.id}`);
  if (!response.ok) {
    throw new Response("Product not found", {
      status: 404,
      statusText: "Not Found",
    });
  }
  const item = await response.json();
  return { item };
}

async function bagLoader() {
  return { items: mockBagItems, summary: mockBagSummary };
}

function ProductPreview() {
  const { item } = useLoaderData();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <Product
      item={item}
      activeImageIndex={activeImageIndex}
      onSelectImage={setActiveImageIndex}
      inBag={mockBagItems.some((bagItem) => bagItem.id === item.id)}
    />
  );
}

/**
 * Presentational Home + local filter/sort/search against catalog from homeLoader.
 */
function HomePreview() {
  const { items: catalogItems } = useLoaderData();
  const { searchQuery = "", onClearSearch } = useOutletContext() ?? {};
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const searchedItems = useMemo(
    () => searchProducts(catalogItems, searchQuery),
    [catalogItems, searchQuery],
  );

  const facets = useMemo(
    () => buildFacetsWithCounts(searchedItems, filters),
    [searchedItems, filters],
  );

  const visibleItems = useMemo(() => {
    return sortProducts(filterProducts(searchedItems, filters), sort);
  }, [searchedItems, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(visibleItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return visibleItems.slice(start, start + pageSize);
  }, [visibleItems, currentPage, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [filters, sort, searchQuery, pageSize]);

  const filteredCount = visibleItems.length;
  const pageStart = filteredCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(currentPage * pageSize, filteredCount);

  const chips = useMemo(() => {
    const next = getActiveFilterChips(filters);
    if (searchQuery.trim()) {
      next.unshift({
        id: `search:${searchQuery}`,
        group: "search",
        value: searchQuery,
        label: `“${searchQuery.trim()}”`,
      });
    }
    return next;
  }, [filters, searchQuery]);

  const handleRemoveChip = (chip) => {
    if (chip.group === "search") {
      onClearSearch?.();
      return;
    }
    setFilters((current) => removeFilterChip(current, chip));
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    document
      .getElementById("main-content")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    onClearSearch?.();
    setPage(1);
  };

  return (
    <Home
      items={paginatedItems}
      filteredCount={filteredCount}
      page={currentPage}
      pageSize={pageSize}
      pageStart={pageStart}
      pageEnd={pageEnd}
      bagItemIds={mockBagItems.map((item) => item.id)}
      facets={facets}
      filters={filters}
      sort={sort}
      chips={chips}
      filtersOpen={filtersOpen}
      onFiltersChange={setFilters}
      onSortChange={setSort}
      onPageChange={handlePageChange}
      onPageSizeChange={setPageSize}
      onRemoveChip={handleRemoveChip}
      onClearFilters={handleClearFilters}
      onOpenFilters={() => setFiltersOpen(true)}
      onCloseFilters={() => setFiltersOpen(false)}
    />
  );
}

/**
 * Layout route: owns header search draft + committed query for the hybrid demo.
 */
function RootLayout() {
  const navigate = useNavigate();
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (value) => {
    const next = typeof value === "string" ? value.trim() : "";
    setSearchDraft(next);
    setSearchQuery(next);
    navigate("/");
  };

  const handleClearSearch = () => {
    setSearchDraft("");
    setSearchQuery("");
  };

  return (
    <App
      bagCount={mockBagItems.length}
      searchValue={searchDraft}
      searchQuery={searchQuery}
      onSearchChange={(event) => setSearchDraft(event.target.value)}
      onSearchSubmit={handleSearchSubmit}
      onClearSearch={handleClearSearch}
    />
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePreview />, loader: homeLoader },
      {
        path: "product/:id",
        element: <ProductPreview />,
        loader: productLoader,
      },
      {
        path: "bag",
        element: <Bag items={mockBagItems} summary={mockBagSummary} />,
        loader: bagLoader,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
