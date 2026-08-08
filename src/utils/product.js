/** Presentational helpers for DummyJSON product fields. */

export const getDiscountedPrice = (product) => product?.price ?? 0;

export const getOriginalPrice = (product) => {
  if (!product?.discountPercentage) return product?.price ?? 0;
  return product.price / (1 - product.discountPercentage / 100);
};

export const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value ?? 0);

export const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatDimensions = (dimensions) => {
  if (!dimensions) return null;
  const { width, height, depth } = dimensions;
  if (width == null && height == null && depth == null) return null;
  return `${width ?? "—"} × ${height ?? "—"} × ${depth ?? "—"} cm`;
};
