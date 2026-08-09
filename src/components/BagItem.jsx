import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import {
  formatMoney,
  getDiscountedPrice,
  getOriginalPrice,
} from "../utils/product";

/**
 * Cart line item with quantity controls.
 */
const BagItem = ({ item, onRemove, onUpdateQuantity }) => {
  const image = item.thumbnail || item.images?.[0];
  const discounted = getDiscountedPrice(item);
  const original = getOriginalPrice(item);
  const hasDiscount = (item.discountPercentage ?? 0) > 0;
  const quantity = item.quantity || 1;

  const lineSubtotal = discounted * quantity;

  return (
    <Box className="relative mb-4 flex flex-col gap-4 rounded-2xl border border-(--color-border) bg-surface p-4 shadow-soft transition-[box-shadow,border-color] duration-200 hover:border-(--color-primary)/15 hover:shadow-lift sm:flex-row">
      <Box className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-(--color-neutral-100) sm:h-36 sm:w-28">
        <img
          src={image}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </Box>

      <Box className="min-w-0 flex-1 pr-8">
        <Typography
          variant="overline"
          className="text-[11px]! tracking-[0.14em]! text-(--color-foreground-muted)!"
        >
          {item.brand || item.category}
        </Typography>

        <Typography
          className="text-lg! leading-snug! font-medium! text-(--color-foreground)!"
          sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
        >
          {item.title}
        </Typography>

        <Box className="mt-2 flex flex-wrap items-baseline gap-2">
          <Typography component="span" className="text-base font-semibold">
            {formatMoney(discounted)}
          </Typography>
          {hasDiscount ? (
            <>
              <Typography
                component="span"
                className="text-xs text-(--color-foreground-muted) line-through"
              >
                {formatMoney(original)}
              </Typography>
              <Typography
                component="span"
                className="text-xs font-medium text-(--color-accent)"
              >
                {item.discountPercentage.toFixed(0)}% off
              </Typography>
            </>
          ) : null}
        </Box>

        {/* Quantity Controls */}
        <Box className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Box className="flex items-center gap-2">
            <Typography className="text-xs font-medium text-(--color-foreground-muted)">
              Qty:
            </Typography>
            <Box className="flex items-center rounded-lg border border-(--color-border) bg-surface">
              <IconButton
                size="small"
                onClick={() => onUpdateQuantity?.(item.id, quantity - 1)}
                aria-label="Decrease quantity"
                className="p-1!"
              >
                <RemoveOutlinedIcon fontSize="small" />
              </IconButton>
              <Typography className="w-8 text-center text-xs font-semibold">
                {quantity}
              </Typography>
              <IconButton
                size="small"
                disabled={item.stock != null && quantity >= item.stock}
                onClick={() => onUpdateQuantity?.(item.id, quantity + 1)}
                aria-label="Increase quantity"
                className="p-1!"
              >
                <AddOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Typography className="text-sm font-semibold text-(--color-foreground)">
            Subtotal: {formatMoney(lineSubtotal)}
          </Typography>
        </Box>

        {item.shippingInformation ? (
          <Typography className="mt-3 text-xs text-(--color-foreground-muted)">
            {item.shippingInformation}
          </Typography>
        ) : null}
      </Box>

      <IconButton
        aria-label={`Remove ${item.title} from cart`}
        onClick={onRemove}
        className="absolute! top-3! right-3! min-h-10! min-w-10! text-(--color-foreground-muted)! hover:text-destructive!"
      >
        <DeleteOutlinedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default BagItem;
