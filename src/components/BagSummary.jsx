import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { formatMoney } from "../utils/product";

/**
 * Price summary panel — presentational.
 * Computes or displays formatted totals.
 */
const BagSummary = ({
  totalItem = 0,
  totalMRP = 0,
  totalDiscount = 0,
  convenienceFee = 0,
  finalPayment = 0,
  isPlacingOrder = false,
  onPlaceOrder,
  onClearCart,
}) => {
  return (
    <Box className="h-fit w-full rounded-2xl border border-(--color-border) bg-surface p-6 shadow-soft md:sticky md:top-24 md:w-[36%]">
      <Typography
        className="mb-5! text-2xl! font-semibold! text-(--color-foreground)!"
        sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
      >
        Order summary
      </Typography>

      <Typography className="mb-4 text-xs font-semibold tracking-[0.14em] text-(--color-foreground-muted) uppercase">
        {totalItem} {totalItem === 1 ? "unit" : "units"}
      </Typography>

      <Box className="mb-3 flex justify-between text-sm text-foreground">
        <span>Subtotal (MRP)</span>
        <span>{formatMoney(totalMRP)}</span>
      </Box>

      {totalDiscount > 0 ? (
        <Box className="mb-3 flex justify-between text-sm text-foreground">
          <span>Discount savings</span>
          <span className="text-success font-medium">
            −{formatMoney(totalDiscount)}
          </span>
        </Box>
      ) : null}

      <Box className="mb-3 flex justify-between text-sm text-foreground">
        <span>Delivery fee</span>
        <span>
          {convenienceFee === 0 ? (
            <span className="text-success font-semibold">FREE</span>
          ) : (
            formatMoney(convenienceFee)
          )}
        </span>
      </Box>

      <Divider className="my-4! border-(--color-border)!" />

      <Box className="mb-6 flex justify-between text-base font-semibold text-foreground">
        <span>Total Amount</span>
        <span className="text-lg text-(--color-primary)">
          {formatMoney(finalPayment)}
        </span>
      </Box>

      <Box className="flex flex-col gap-3">
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={onPlaceOrder}
          disabled={totalItem === 0 || isPlacingOrder}
          className="min-h-12! text-sm font-semibold!"
        >
          {isPlacingOrder ? "Redirecting to Stripe…" : "Place order"}
        </Button>
        {totalItem > 0 ? (
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={onClearCart}
            className="min-h-10! text-xs! text-(--color-foreground-muted)!"
          >
            Clear cart
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};

export default BagSummary;
