import { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import {
  formatDate,
  formatDimensions,
  formatMoney,
  getDiscountedPrice,
  getOriginalPrice,
  isOutOfStock,
} from "../utils/product";

/**
 * Full DummyJSON product detail page — presentational.
 */
const Product = ({
  item,
  inBag = false,
  activeImageIndex = 0,
  onSelectImage,
  onAddToBag,
  onRemoveFromBag,
}) => {
  const minQuantity = item?.minimumOrderQuantity ?? 1;
  const [quantity, setQuantity] = useState(minQuantity);

  if (!item) {
    return (
      <Box
        component="main"
        id="main-content"
        className="mx-auto max-w-shell px-4 py-20 text-center sm:px-6"
      >
        <Typography
          className="mb-4 text-3xl! font-bold!"
          sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
        >
          Product not found
        </Typography>
        <Typography className="mb-8 text-(--color-foreground-muted)">
          This item is no longer in the collection.
        </Typography>
        <Button component={Link} to="/" variant="outlined">
          Back to shop
        </Button>
      </Box>
    );
  }

  const images =
    item.images?.length > 0
      ? item.images
      : item.thumbnail
        ? [item.thumbnail]
        : [];
  const safeIndex = Math.min(activeImageIndex, Math.max(images.length - 1, 0));
  const activeImage = images[safeIndex];
  const reviewCount = item.reviews?.length ?? 0;
  const discounted = getDiscountedPrice(item);
  const original = getOriginalPrice(item);
  const hasDiscount = (item.discountPercentage ?? 0) > 0;
  const isLowStock = item.availabilityStatus === "Low Stock";
  const outOfStock = isOutOfStock(item);
  const dimensionsLabel = formatDimensions(item.dimensions);

  const specificationRows = [
    { label: "SKU", value: item.sku },
    { label: "Brand", value: item.brand },
    { label: "Category", value: item.category, capitalize: true },
    { label: "Stock", value: item.stock },
    { label: "Availability", value: item.availabilityStatus },
    {
      label: "Minimum order",
      value:
        item.minimumOrderQuantity != null
          ? `${item.minimumOrderQuantity} units`
          : null,
    },
    {
      label: "Weight",
      value: item.weight != null ? `${item.weight}` : null,
    },
    { label: "Dimensions (W × H × D)", value: dimensionsLabel },
    { label: "Barcode", value: item.meta?.barcode },
  ].filter((row) => row.value != null && row.value !== "");

  return (
    <Box component="main" id="main-content" className="w-full pb-20">
      <Box className="mx-auto max-w-shell px-4 pt-6 sm:px-6">
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackOutlinedIcon />}
          className="min-h-11! px-0! font-semibold! text-(--color-foreground-muted)! hover:bg-transparent! hover:text-foreground!"
        >
          Back to results
        </Button>
      </Box>

      <Box className="mx-auto grid max-w-shell gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:py-10">
        <Box className="lg:sticky lg:top-24 lg:self-start">
          <Box className="overflow-hidden rounded-3xl border border-(--color-border) bg-surface shadow-soft">
            <Box className="relative aspect-square w-full bg-(--color-neutral-100)">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
              {hasDiscount ? (
                <Chip
                  label={`${item.discountPercentage.toFixed(0)}% off`}
                  size="small"
                  className="absolute! top-4! left-4! bg-(--color-accent-soft)! font-bold! text-(--color-accent)!"
                />
              ) : null}
            </Box>
          </Box>

          {images.length > 1 ? (
            <Box className="mt-5 flex gap-3 overflow-x-auto pb-1">
              {images.map((src, index) => (
                <Box
                  key={`${src}-${index}`}
                  component="button"
                  type="button"
                  onClick={() => onSelectImage?.(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={safeIndex === index}
                  className={`h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl border bg-surface transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 ${
                    safeIndex === index
                      ? "border-(--color-primary) shadow-soft"
                      : "border-(--color-border) hover:border-(--color-primary)/40"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </Box>
              ))}
            </Box>
          ) : null}
        </Box>

        <Box className="flex flex-col">
          <Box className="rounded-3xl border border-(--color-border) bg-surface p-6 shadow-soft sm:p-8">
            <Box className="mb-4 flex flex-wrap items-center gap-2">
              <Typography className="text-xs font-bold tracking-[0.18em] text-(--color-primary) uppercase">
                {item.brand || "Atelier"}
              </Typography>
              {item.category ? (
                <Chip
                  label={item.category}
                  size="small"
                  variant="outlined"
                  className="capitalize! text-[11px]! font-semibold!"
                />
              ) : null}
              {item.availabilityStatus ? (
                <Chip
                  label={item.availabilityStatus}
                  size="small"
                  className={`text-[11px]! font-bold! ${
                    isLowStock
                      ? "bg-(--color-accent-soft)! text-(--color-accent)!"
                      : "bg-(--color-primary-soft)! text-(--color-primary)!"
                  }`}
                />
              ) : null}
            </Box>

            <Typography
              component="h1"
              className="mb-4 text-3xl! leading-tight! font-bold! text-foreground! sm:text-4xl!"
              sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
            >
              {item.title}
            </Typography>

            <Box className="mb-6 flex flex-wrap items-center gap-2">
              <Rating
                value={item.rating ?? 0}
                precision={0.01}
                size="small"
                readOnly
                sx={{
                  color: "var(--color-accent)",
                  "& .MuiRating-iconEmpty": {
                    color: "var(--color-neutral-300)",
                  },
                }}
              />
              <Typography className="text-sm font-semibold text-foreground">
                {typeof item.rating === "number"
                  ? item.rating.toFixed(2)
                  : item.rating}
              </Typography>
              {reviewCount ? (
                <Typography className="text-sm text-(--color-foreground-muted)">
                  · {reviewCount} reviews
                </Typography>
              ) : null}
            </Box>

            <Box className="mb-5 flex flex-wrap items-baseline gap-3">
              <Typography className="text-3xl font-bold text-foreground">
                {formatMoney(discounted)}
              </Typography>
              {hasDiscount ? (
                <>
                  <Typography className="text-base text-(--color-foreground-muted) line-through">
                    {formatMoney(original)}
                  </Typography>
                  <Typography className="rounded-full bg-(--color-accent-soft) px-2.5 py-1 text-xs font-bold text-(--color-accent)">
                    Save {item.discountPercentage.toFixed(2)}%
                  </Typography>
                </>
              ) : null}
            </Box>

            <Box
              className={`mb-6 rounded-2xl border px-4 py-3.5 ${
                isLowStock
                  ? "border-(--color-accent)/25 bg-(--color-accent-soft)/70"
                  : "border-(--color-primary)/15 bg-(--color-primary-soft)/60"
              }`}
            >
              <Typography className="text-sm leading-relaxed text-foreground">
                {typeof item.stock === "number" ? (
                  <>
                    <Box component="span" className="font-bold">
                      {item.stock}
                    </Box>{" "}
                    in stock
                  </>
                ) : (
                  <Box component="span" className="font-bold">
                    Stock unavailable
                  </Box>
                )}
                {item.minimumOrderQuantity != null ? (
                  <>
                    {" "}
                    · Min. order{" "}
                    <Box component="span" className="font-bold">
                      {item.minimumOrderQuantity}
                    </Box>
                  </>
                ) : null}
              </Typography>
            </Box>

            <Typography className="mb-6 text-base leading-relaxed text-(--color-foreground-muted)">
              {item.description}
            </Typography>

            {item.tags?.length ? (
              <Box className="mb-7 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    className="capitalize! font-medium!"
                  />
                ))}
              </Box>
            ) : null}

            <Box className="mb-8 grid gap-3">
              <PolicyRow
                icon={<LocalShippingOutlinedIcon fontSize="small" />}
                title="Shipping"
                body={item.shippingInformation}
              />
              <PolicyRow
                icon={<VerifiedOutlinedIcon fontSize="small" />}
                title="Warranty"
                body={item.warrantyInformation}
              />
              <PolicyRow
                icon={<ReplayOutlinedIcon fontSize="small" />}
                title="Returns"
                body={item.returnPolicy}
              />
              <PolicyRow
                icon={<Inventory2OutlinedIcon fontSize="small" />}
                title="Availability"
                body={item.availabilityStatus}
              />
            </Box>

            {!inBag && !outOfStock ? (
              <Box className="mb-4 flex items-center gap-3">
                <Typography className="text-sm font-semibold text-(--color-foreground)">
                  Quantity:
                </Typography>
                <Box className="flex items-center rounded-lg border border-(--color-border) bg-surface">
                  <IconButton
                    size="small"
                    disabled={quantity <= minQuantity}
                    onClick={() =>
                      setQuantity((q) => Math.max(minQuantity, q - 1))
                    }
                    aria-label="Decrease quantity"
                    className="p-1.5!"
                  >
                    <RemoveOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Typography className="w-10 text-center text-sm font-semibold">
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    disabled={item.stock != null && quantity >= item.stock}
                    onClick={() =>
                      setQuantity((q) =>
                        item.stock != null
                          ? Math.min(item.stock, q + 1)
                          : q + 1,
                      )
                    }
                    aria-label="Increase quantity"
                    className="p-1.5!"
                  >
                    <AddOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ) : null}

            {inBag ? (
              <Button
                fullWidth
                variant="outlined"
                color="error"
                size="large"
                startIcon={<DeleteOutlinedIcon />}
                onClick={() => onRemoveFromBag?.(item.id)}
                className="min-h-12! font-bold!"
              >
                Remove from cart
              </Button>
            ) : outOfStock ? (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled
                className="min-h-12! font-bold!"
              >
                Out of stock
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddCircleOutlineOutlinedIcon />}
                onClick={() => onAddToBag?.(item, quantity)}
                className="min-h-12! font-bold!"
              >
                Add to cart
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Box className="mx-auto mt-2 grid max-w-shell gap-6 px-4 sm:px-6 lg:mt-4 lg:grid-cols-2 lg:gap-8">
        <SectionCard title="Specifications">
          {specificationRows.length ? (
            <Box component="dl" className="divide-y divide-border">
              {specificationRows.map((row) => (
                <Box
                  key={row.label}
                  className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-4 py-3.5 text-sm"
                >
                  <Typography
                    component="dt"
                    className="font-medium text-(--color-foreground-muted)"
                  >
                    {row.label}
                  </Typography>
                  <Typography
                    component="dd"
                    className={`m-0 font-bold text-foreground ${
                      row.capitalize ? "capitalize" : ""
                    }`}
                  >
                    {row.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography className="text-sm text-(--color-foreground-muted)">
              No specifications available.
            </Typography>
          )}
        </SectionCard>

        <SectionCard
          title={`Customer reviews${reviewCount ? ` (${reviewCount})` : ""}`}
        >
          {reviewCount > 0 ? (
            <Box className="grid gap-4">
              {item.reviews.map((review, index) => (
                <Box
                  key={`${review.reviewerName}-${review.date}-${index}`}
                  className="rounded-2xl border border-(--color-border) bg-(--color-neutral-100)/40 p-5"
                >
                  <Box className="mb-3 flex items-start justify-between gap-3">
                    <Box className="min-w-0">
                      <Typography className="truncate text-sm font-bold text-foreground">
                        {review.reviewerName}
                      </Typography>
                      {review.reviewerEmail ? (
                        <Typography className="mt-0.5 truncate text-xs text-(--color-foreground-muted)">
                          {review.reviewerEmail}
                        </Typography>
                      ) : null}
                    </Box>
                    <Rating
                      value={review.rating}
                      size="small"
                      readOnly
                      sx={{
                        fontSize: 14,
                        color: "var(--color-accent)",
                        "& .MuiRating-iconEmpty": {
                          color: "var(--color-neutral-300)",
                        },
                      }}
                    />
                  </Box>
                  <Typography className="mb-3 text-sm leading-relaxed text-(--color-foreground-muted)">
                    {review.comment}
                  </Typography>
                  {review.date ? (
                    <Typography className="text-xs font-medium text-(--color-foreground-muted)">
                      {formatDate(review.date)}
                    </Typography>
                  ) : null}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography className="text-sm text-(--color-foreground-muted)">
              No reviews yet for this product.
            </Typography>
          )}
        </SectionCard>
      </Box>
    </Box>
  );
};

const SectionCard = ({ title, children }) => (
  <Box className="rounded-3xl border border-(--color-border) bg-surface p-6 shadow-soft sm:p-7">
    <Typography
      component="h2"
      className="mb-5 text-2xl! font-bold! text-foreground!"
      sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

const PolicyRow = ({ icon, title, body }) => {
  if (!body) return null;
  return (
    <Box className="flex items-start gap-3 rounded-xl border border-(--color-border)/80 bg-(--color-neutral-100)/50 px-4 py-3.5">
      <Box className="mt-0.5 text-(--color-primary)">{icon}</Box>
      <Box className="min-w-0">
        <Typography className="text-xs font-bold tracking-wide text-foreground uppercase">
          {title}
        </Typography>
        <Typography className="mt-1 text-sm text-(--color-foreground-muted)">
          {body}
        </Typography>
      </Box>
    </Box>
  );
};

export default Product;
