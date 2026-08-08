import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

/**
 * Price summary panel — presentational.
 * Pass precomputed totals from parent; this component does not calculate.
 */
const BagSummary = ({
  totalItem = 0,
  totalMRP = 0,
  totalDiscount = 0,
  convenienceFee = 99,
  finalPayment = 0,
  onPlaceOrder,
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
        {totalItem} {totalItem === 1 ? "item" : "items"}
      </Typography>

      <Box className="mb-3 flex justify-between text-sm text-foreground">
        <span>Subtotal</span>
        <span>₹{totalMRP}</span>
      </Box>

      <Box className="mb-3 flex justify-between text-sm text-foreground">
        <span>Savings</span>
        <span className="text-success">−₹{totalDiscount}</span>
      </Box>

      <Box className="mb-3 flex justify-between text-sm text-foreground">
        <span>Delivery</span>
        <span>₹{convenienceFee}</span>
      </Box>

      <Divider className="my-4! border-(--color-border)!" />

      <Box className="mb-6 flex justify-between text-base font-semibold text-foreground">
        <span>Total</span>
        <span>₹{finalPayment}</span>
      </Box>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={onPlaceOrder}
        className="min-h-12! text-sm!"
      >
        Place order
      </Button>
    </Box>
  );
};

export default BagSummary;
