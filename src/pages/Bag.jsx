import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import BagItem from "../components/BagItem";
import BagSummary from "../components/BagSummary";
import { getDiscountedPrice, getOriginalPrice } from "../utils/product";

const FREE_DELIVERY_THRESHOLD = 50;
const CONVENIENCE_FEE = 5;

/**
 * Cart page layout.
 * Calculates summary metrics dynamically from `items`.
 */
const Bag = ({
  items = [],
  onRemove,
  onUpdateQuantity,
  onClearCart,
  onPlaceOrder,
}) => {
  const { totalItemCount, totalMRP, totalDiscountedPrice } = items.reduce(
    (acc, item) => {
      const qty = item.quantity || 1;
      acc.totalItemCount += qty;
      acc.totalMRP += getOriginalPrice(item) * qty;
      acc.totalDiscountedPrice += getDiscountedPrice(item) * qty;
      return acc;
    },
    { totalItemCount: 0, totalMRP: 0, totalDiscountedPrice: 0 },
  );

  const totalDiscount = Math.max(0, totalMRP - totalDiscountedPrice);
  const convenienceFee =
    totalDiscountedPrice > FREE_DELIVERY_THRESHOLD || items.length === 0
      ? 0
      : CONVENIENCE_FEE;
  const finalPayment = totalDiscountedPrice + convenienceFee;

  return (
    <Box
      component="main"
      id="main-content"
      className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6 sm:py-14"
    >
      <Box className="mb-8 flex items-baseline justify-between gap-4">
        <Typography
          component="h1"
          className="text-4xl! font-semibold! text-foreground!"
          sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
        >
          Your cart
        </Typography>
        {items.length > 0 ? (
          <Typography className="text-sm font-medium text-(--color-foreground-muted)">
            {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
          </Typography>
        ) : null}
      </Box>

      <Box className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <Box className="min-w-0 flex-1">
          {items.length === 0 ? (
            <Box className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--color-border) bg-surface/70 px-6 py-16 text-center shadow-soft">
              <Box className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--color-primary-soft) text-(--color-primary)">
                <ShoppingBagOutlinedIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography
                className="mb-2 text-2xl! font-semibold! text-(--color-foreground)!"
                sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
              >
                Your cart is empty
              </Typography>
              <Typography className="mb-6 max-w-sm text-sm text-(--color-foreground-muted)">
                Explore our collection of curated items and add your favorite
                pieces to your cart.
              </Typography>
              <Button
                component={Link}
                to="/"
                variant="contained"
                color="primary"
                className="min-h-11! px-6! font-semibold!"
              >
                Explore collection
              </Button>
            </Box>
          ) : (
            items.map((item) => (
              <BagItem
                key={item.id}
                item={item}
                onRemove={() => onRemove?.(item.id)}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))
          )}
        </Box>

        <BagSummary
          totalItem={totalItemCount}
          totalMRP={totalMRP}
          totalDiscount={totalDiscount}
          convenienceFee={convenienceFee}
          finalPayment={finalPayment}
          onPlaceOrder={onPlaceOrder}
          onClearCart={onClearCart}
        />
      </Box>
    </Box>
  );
};

export default Bag;
