import { getDiscountedPrice } from "./product";

export const DEFAULT_FILTERS = {
  categories: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  availability: [],
};

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Avg. Customer Review" },
];

export const DEFAULT_PAGE_SIZE = 20;

export const PAGE_SIZE_OPTIONS = [
  { value: 20, label: "20 per page" },
  { value: 40, label: "40 per page" },
  { value: 60, label: "60 per page" },
  { value: 100, label: "100 per page" },
];

export const RATING_OPTIONS = [4, 3, 2, 1];

const uniqueSorted = (values) =>
  [...new Set(values.filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b)),
  );

/** Build facet options from a product catalog (DummyJSON-shaped). */
export const buildFacets = (products = []) => {
  const prices = products.map((product) => getDiscountedPrice(product));
  const minPrice = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 0;

  return {
    categories: uniqueSorted(products.map((product) => product.category)),
    availability: uniqueSorted(
      products.map((product) => product.availabilityStatus),
    ),
    minPrice,
    maxPrice,
  };
};

const countValues = (products, getValues) => {
  const counts = {};
  products.forEach((product) => {
    getValues(product).forEach((value) => {
      if (!value) return;
      counts[value] = (counts[value] ?? 0) + 1;
    });
  });
  return counts;
};

/**
 * Facets with per-option counts from the current search scope.
 * Each group ignores its own active filter so counts stay useful while filtering.
 */
export const buildFacetsWithCounts = (
  products = [],
  filters = DEFAULT_FILTERS,
) => {
  const categoryPool = filterProducts(products, { ...filters, categories: [] });
  const availabilityPool = filterProducts(products, {
    ...filters,
    availability: [],
  });
  const ratingPool = filterProducts(products, { ...filters, minRating: null });
  const pricePool = filterProducts(products, {
    ...filters,
    minPrice: null,
    maxPrice: null,
  });

  const categoryCounts = countValues(categoryPool, (product) => [
    product.category,
  ]);
  const availabilityCounts = countValues(availabilityPool, (product) => [
    product.availabilityStatus,
  ]);

  const ratingCounts = {};
  RATING_OPTIONS.forEach((stars) => {
    ratingCounts[stars] = ratingPool.filter(
      (product) => (product.rating ?? 0) >= stars,
    ).length;
  });

  const prices = pricePool.map((product) => getDiscountedPrice(product));
  const minPrice = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 0;

  const visibleValues = (counts) =>
    uniqueSorted(Object.keys(counts).filter((key) => counts[key] > 0));

  return {
    categories: visibleValues(categoryCounts),
    availability: visibleValues(availabilityCounts),
    categoryCounts,
    availabilityCounts,
    ratingCounts,
    minPrice,
    maxPrice,
    resultCount: filterProducts(products, filters).length,
  };
};

export const filterProducts = (products = [], filters = DEFAULT_FILTERS) => {
  return products.filter((product) => {
    if (
      filters.categories?.length &&
      !filters.categories.includes(product.category)
    ) {
      return false;
    }

    const price = getDiscountedPrice(product);
    if (filters.minPrice != null && price < filters.minPrice) return false;
    if (filters.maxPrice != null && price > filters.maxPrice) return false;

    if (
      filters.minRating != null &&
      (product.rating ?? 0) < filters.minRating
    ) {
      return false;
    }

    if (
      filters.availability?.length &&
      !filters.availability.includes(product.availabilityStatus)
    ) {
      return false;
    }

    return true;
  });
};

/** Case-insensitive search across title, brand, category, and tags. */
export const searchProducts = (products = [], query = "") => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return products;

  return products.filter((product) => {
    const haystack = [
      product.title,
      product.brand,
      product.category,
      ...(product.tags ?? []),
      product.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
};

export const sortProducts = (products = [], sort = "featured") => {
  const next = [...products];

  switch (sort) {
    case "price-asc":
      return next.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
    case "price-desc":
      return next.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
    case "rating-desc":
      return next.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "featured":
    default:
      return next;
  }
};

export const getActiveFilterChips = (filters = DEFAULT_FILTERS) => {
  const chips = [];

  filters.categories?.forEach((value) => {
    chips.push({
      id: `category:${value}`,
      group: "categories",
      value,
      label: value,
    });
  });

  filters.availability?.forEach((value) => {
    chips.push({
      id: `availability:${value}`,
      group: "availability",
      value,
      label: value,
    });
  });

  if (filters.minRating != null) {
    chips.push({
      id: `rating:${filters.minRating}`,
      group: "minRating",
      value: filters.minRating,
      label: `${filters.minRating}+ stars`,
    });
  }

  if (filters.minPrice != null || filters.maxPrice != null) {
    const min = filters.minPrice ?? 0;
    const max = filters.maxPrice ?? "∞";
    chips.push({
      id: "price-range",
      group: "price",
      value: null,
      label: `$${min} – $${max}`,
    });
  }

  return chips;
};

export const removeFilterChip = (filters, chip) => {
  const next = {
    ...filters,
    categories: [...(filters.categories ?? [])],
    availability: [...(filters.availability ?? [])],
  };

  if (chip.group === "categories") {
    next.categories = next.categories.filter((value) => value !== chip.value);
  } else if (chip.group === "availability") {
    next.availability = next.availability.filter(
      (value) => value !== chip.value,
    );
  } else if (chip.group === "minRating") {
    next.minRating = null;
  } else if (chip.group === "price") {
    next.minPrice = null;
    next.maxPrice = null;
  }

  return next;
};

export const hasActiveFilters = (filters = DEFAULT_FILTERS) =>
  Boolean(
    filters.categories?.length ||
    filters.availability?.length ||
    filters.minRating != null ||
    filters.minPrice != null ||
    filters.maxPrice != null,
  );
