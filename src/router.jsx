import { useMemo, useState } from "react";
import {
  createBrowserRouter,
  isRouteErrorResponse,
  RouterProvider,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useRevalidator,
  useRouteError,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Bag from "./pages/Bag.jsx";
import Product from "./pages/Product.jsx";
import { bagActions } from "./store/Bag.jsx";
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
    const isNotFound = response.status === 404;
    throw new Response(
      isNotFound ? "Product not found" : "Failed to load product",
      {
        status: response.status,
        statusText: isNotFound ? "Not Found" : response.statusText,
      },
    );
  }
  const item = await response.json();
  return { item };
}

function ProductPreview() {
  const { item } = useLoaderData();
  const dispatch = useDispatch();
  const bagItems = useSelector((state) => state.bag.items);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  const inBag = bagItems.some((bagItem) => bagItem.id === item.id);

  const handleAddToBag = (productItem, quantity = 1) => {
    dispatch(bagActions.addToBag({ item: productItem, quantity }));
    setToastMessage(
      `Added ${quantity} ${quantity === 1 ? "unit" : "units"} to your cart!`,
    );
  };

  const handleRemoveFromBag = (itemId) => {
    dispatch(bagActions.removeFromBag(itemId));
    setToastMessage("Removed item from your cart.");
  };

  return (
    <>
      <Product
        item={item}
        activeImageIndex={activeImageIndex}
        onSelectImage={setActiveImageIndex}
        inBag={inBag}
        onAddToBag={handleAddToBag}
        onRemoveFromBag={handleRemoveFromBag}
      />
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3000}
        onClose={() => setToastMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastMessage("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

/**
 * Presentational Home + Redux cart actions.
 */
function HomePreview() {
  const { items: catalogItems } = useLoaderData();
  const dispatch = useDispatch();
  const bagItems = useSelector((state) => state.bag.items);
  const { searchQuery = "", onClearSearch } = useOutletContext() ?? {};

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setPage(1);
  };

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  const handleRemoveChip = (chip) => {
    setPage(1);
    if (chip.group === "search") {
      onClearSearch?.();
      return;
    }
    setFilters((current) => removeFilterChip(current, chip));
  };

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

  const handleAddToBag = (item, quantity = 1) => {
    dispatch(bagActions.addToBag({ item, quantity }));
  };

  const handleRemoveFromBag = (itemId) => {
    dispatch(bagActions.removeFromBag(itemId));
  };

  return (
    <Home
      items={paginatedItems}
      filteredCount={filteredCount}
      page={currentPage}
      pageSize={pageSize}
      pageStart={pageStart}
      pageEnd={pageEnd}
      bagItemIds={bagItems.map((item) => item.id)}
      facets={facets}
      filters={filters}
      sort={sort}
      chips={chips}
      filtersOpen={filtersOpen}
      onFiltersChange={handleFiltersChange}
      onSortChange={handleSortChange}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      onRemoveChip={handleRemoveChip}
      onClearFilters={handleClearFilters}
      onOpenFilters={() => setFiltersOpen(true)}
      onCloseFilters={() => setFiltersOpen(false)}
      onAddToBag={handleAddToBag}
      onRemoveFromBag={handleRemoveFromBag}
    />
  );
}

function BagPreview() {
  const dispatch = useDispatch();
  const bagItems = useSelector((state) => state.bag.items);
  const [toastMessage, setToastMessage] = useState("");

  const handleRemove = (itemId) => {
    dispatch(bagActions.removeFromBag(itemId));
  };

  const handleUpdateQuantity = (id, quantity) => {
    dispatch(bagActions.updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    dispatch(bagActions.clearBag());
  };

  const handlePlaceOrder = () => {
    dispatch(bagActions.clearBag());
    setToastMessage(
      "Thank you for your order! Your purchase has been placed successfully.",
    );
  };

  return (
    <>
      <Bag
        items={bagItems}
        onRemove={handleRemove}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
      />
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastMessage("")}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

/**
 * Layout route: owns header search draft + committed query and bag count calculation.
 */
function RootLayout() {
  const navigate = useNavigate();
  const bagItems = useSelector((state) => state.bag.items);
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const totalBagCount = bagItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );

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
      bagCount={totalBagCount}
      searchValue={searchDraft}
      searchQuery={searchQuery}
      onSearchChange={(event) => setSearchDraft(event.target.value)}
      onSearchSubmit={handleSearchSubmit}
      onClearSearch={handleClearSearch}
    />
  );
}

function RootErrorElement() {
  const error = useRouteError();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  let title = "Something went wrong";
  let message = "An unexpected error occurred while loading this page.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText || "Error"}`.trim();
    message =
      typeof error.data === "string" ? error.data : error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <Box className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <Alert severity="error" sx={{ mb: 3, maxWidth: 480, width: "100%" }}>
        <Typography variant="h6" className="font-semibold">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {message}
        </Typography>
      </Alert>
      <Box className="flex gap-3">
        <Button variant="contained" onClick={() => revalidator.revalidate()}>
          Try Again
        </Button>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </Box>
    </Box>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RootErrorElement />,
    children: [
      { index: true, element: <HomePreview />, loader: homeLoader },
      {
        path: "product/:id",
        element: <ProductPreview />,
        loader: productLoader,
      },
      {
        path: "bag",
        element: <BagPreview />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
