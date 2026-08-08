import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  formatMoney,
  getDiscountedPrice,
  getOriginalPrice,
} from "../utils/product";

/**
 * Denser Amazon-lite product card (DummyJSON shape).
 * Category / product type intentionally omitted from the listing.
 */
const HomeItem = ({ item, inBag = false, onAddToBag, onRemoveFromBag }) => {
  const handleActionClick = (event, handler) => {
    event.preventDefault();
    event.stopPropagation();
    handler?.();
  };

  const image = item.thumbnail || item.images?.[0];
  const reviewCount = item.reviews?.length ?? 0;
  const discounted = getDiscountedPrice(item);
  const original = getOriginalPrice(item);
  const hasDiscount = (item.discountPercentage ?? 0) > 0;

  return (
    <Card
      component={Link}
      to={`/product/${item.id}`}
      elevation={0}
      className="group flex! h-full cursor-pointer flex-col overflow-hidden rounded-xl! border border-(--color-border) bg-surface no-underline transition-[box-shadow,border-color] duration-200 hover:border-(--color-primary)/25 hover:shadow-lift"
      sx={{ boxShadow: "var(--shadow-soft)", color: "inherit" }}
    >
      <Box className="relative overflow-hidden bg-(--color-neutral-100)">
        <CardMedia
          component="img"
          image={image}
          alt={item.title}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
        />
        {item.availabilityStatus === "Low Stock" ? (
          <Chip
            label="Low stock"
            size="small"
            className="absolute! top-2.5! left-2.5! bg-(--color-accent-soft)! text-(--color-accent)! text-[11px]! font-medium!"
          />
        ) : null}
      </Box>

      <CardContent className="flex flex-1 flex-col gap-1.5 p-3.5!">
        <Typography
          variant="overline"
          className="text-[10px]! leading-none! tracking-[0.14em]! text-(--color-foreground-muted)!"
        >
          {item.brand || "Atelier"}
        </Typography>

        <Typography
          variant="h6"
          className="line-clamp-2! min-h-[2.5em] text-[0.98rem]! leading-snug! font-medium! text-(--color-foreground)!"
          sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
        >
          {item.title}
        </Typography>

        <Box className="flex items-center gap-1">
          <Rating
            value={item.rating ?? 0}
            precision={0.1}
            size="small"
            readOnly
            sx={{
              fontSize: 13,
              color: "var(--color-accent)",
              "& .MuiRating-iconEmpty": { color: "var(--color-neutral-300)" },
            }}
          />
          <Typography
            variant="caption"
            className="text-(--color-foreground-muted)"
          >
            {item.rating?.toFixed?.(1) ?? item.rating}
            {reviewCount ? ` (${reviewCount})` : ""}
          </Typography>
        </Box>

        <Box className="mt-auto flex flex-wrap items-baseline gap-1.5 pt-1">
          <Typography
            component="span"
            className="text-sm font-semibold text-(--color-foreground)"
          >
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
                className="text-[11px] font-medium text-(--color-accent)"
              >
                ({item.discountPercentage.toFixed(0)}% off)
              </Typography>
            </>
          ) : null}
        </Box>

        {inBag ? (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteOutlinedIcon />}
            onClick={(event) => handleActionClick(event, onRemoveFromBag)}
            className="mt-2! min-h-10!"
          >
            Remove
          </Button>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={(event) => handleActionClick(event, onAddToBag)}
            className="mt-2! min-h-10!"
          >
            Add to cart
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default HomeItem;
