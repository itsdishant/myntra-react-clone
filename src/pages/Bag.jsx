import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BagItem from "../components/BagItem";
import BagSummary from "../components/BagSummary";

/**
 * Cart page layout — presentational.
 * Pass bag `items` and precomputed `summary` from parent later.
 */
const Bag = ({ items = [], summary = {}, onRemove, onPlaceOrder }) => {
  return (
    <Box
      component="main"
      id="main-content"
      className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6 sm:py-14"
    >
      <Typography
        component="h1"
        className="mb-8 text-4xl! font-semibold! text-foreground!"
        sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
      >
        Your cart
      </Typography>

      <Box className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <Box className="min-w-0 flex-1">
          {items.length === 0 ? (
            <Box className="rounded-2xl border border-dashed border-(--color-border) bg-surface/70 px-6 py-16 text-center">
              <Typography className="text-(--color-foreground-muted)">
                Your cart is empty for now.
              </Typography>
            </Box>
          ) : (
            items.map((item) => (
              <BagItem
                key={item.id}
                item={item}
                onRemove={onRemove ? () => onRemove(item.id) : undefined}
              />
            ))
          )}
        </Box>

        <BagSummary {...summary} onPlaceOrder={onPlaceOrder} />
      </Box>
    </Box>
  );
};

export default Bag;
