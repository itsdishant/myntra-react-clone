import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  formatMoney,
  getDiscountedPrice,
  getOriginalPrice,
} from "../utils/product";

/**
 * Cart line item — DummyJSON product shape.
 */
const BagItem = ({ item, onRemove }) => {
  const image = item.thumbnail || item.images?.[0];
  const discounted = getDiscountedPrice(item);
  const original = getOriginalPrice(item);
  const hasDiscount = (item.discountPercentage ?? 0) > 0;

  return (
    <Box className="relative mb-4 flex gap-4 rounded-2xl border border-(--color-border) bg-surface p-4 shadow-soft transition-[box-shadow,border-color] duration-200 hover:border-(--color-primary)/15 hover:shadow-lift">
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
          <Typography component="span" className="text-sm font-semibold">
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

        <Typography className="mt-3 text-sm text-(--color-foreground-muted)">
          {item.shippingInformation}
        </Typography>
        <Typography className="mt-1 text-sm text-(--color-foreground-muted)">
          {item.returnPolicy}
        </Typography>
      </Box>

      <IconButton
        aria-label={`Remove ${item.title} from cart`}
        onClick={onRemove}
        className="absolute! top-3! right-3! min-h-11! min-w-11! text-(--color-foreground-muted)! hover:text-destructive!"
      >
        <DeleteOutlinedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default BagItem;
