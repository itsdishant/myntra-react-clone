import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { RATING_OPTIONS } from "../utils/filters";
import { formatMoney } from "../utils/product";

/**
 * Amazon-lite filter sidebar — presentational.
 * Parent owns filter state and applies filtering.
 */
const FilterSidebar = ({
  facets = {},
  filters,
  onChange,
  onClear,
  className = "",
}) => {
  const priceBounds = [facets.minPrice ?? 0, facets.maxPrice ?? 100];
  const priceValue = [
    filters.minPrice ?? priceBounds[0],
    filters.maxPrice ?? priceBounds[1],
  ];

  const update = (patch) => onChange?.({ ...filters, ...patch });

  const toggle = (group, value) => {
    const current = filters[group] ?? [];
    const next = current.includes(value)
      ? current.filter((entry) => entry !== value)
      : [...current, value];
    update({ [group]: next });
  };

  const withSelected = (options = [], selected = []) =>
    [...new Set([...options, ...selected])].sort((a, b) =>
      String(a).localeCompare(String(b)),
    );

  const categoryOptions = withSelected(facets.categories, filters.categories);
  const availabilityOptions = withSelected(
    facets.availability,
    filters.availability,
  );

  return (
    <Box
      component="aside"
      className={`w-full rounded-2xl border border-(--color-border) bg-surface p-4 shadow-soft ${className}`}
    >
      <Box className="mb-4 flex items-center justify-between gap-3">
        <Typography
          className="text-xl! font-semibold! text-(--color-foreground)!"
          sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
        >
          Filters
        </Typography>
        <Button
          size="small"
          onClick={onClear}
          className="min-h-9! text-xs! text-(--color-primary)!"
        >
          Clear all
        </Button>
      </Box>

      <FilterSection title="Category">
        <FormGroup>
          {categoryOptions.map((category) => {
            const count = facets.categoryCounts?.[category] ?? 0;
            return (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.categories.includes(category)}
                    disabled={
                      count === 0 && !filters.categories.includes(category)
                    }
                    onChange={() => toggle("categories", category)}
                  />
                }
                label={<FilterLabel name={category} count={count} capitalize />}
              />
            );
          })}
        </FormGroup>
      </FilterSection>

      <FilterSection title="Price">
        <Typography className="mb-3 text-sm font-bold text-(--color-foreground)">
          {formatMoney(priceValue[0])} – {formatMoney(priceValue[1])}
        </Typography>
        <Slider
          value={priceValue}
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={1}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatMoney(value)}
          onChange={(_, value) => {
            update({
              minPrice: value[0],
              maxPrice: value[1],
            });
          }}
          sx={{
            color: "var(--color-primary)",
            mt: 1,
            "& .MuiSlider-valueLabel": {
              fontSize: 12,
            },
          }}
        />
      </FilterSection>

      <FilterSection title="Customer reviews">
        <FormGroup>
          {RATING_OPTIONS.map((stars) => {
            const count = facets.ratingCounts?.[stars] ?? 0;
            return (
              <FormControlLabel
                key={stars}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.minRating === stars}
                    disabled={count === 0}
                    onChange={() =>
                      update({
                        minRating: filters.minRating === stars ? null : stars,
                      })
                    }
                  />
                }
                label={
                  <Box className="flex w-full items-center justify-between gap-2">
                    <Box className="flex items-center gap-1.5">
                      <Rating
                        value={stars}
                        readOnly
                        size="small"
                        sx={{
                          fontSize: 16,
                          color: "var(--color-accent)",
                          "& .MuiRating-iconEmpty": {
                            color: "var(--color-neutral-300)",
                          },
                        }}
                      />
                      <Typography className="text-sm font-bold text-(--color-foreground-muted)">
                        & Up
                      </Typography>
                    </Box>
                    <Typography className="text-xs font-bold text-(--color-foreground-muted)">
                      ({count})
                    </Typography>
                  </Box>
                }
              />
            );
          })}
        </FormGroup>
      </FilterSection>

      <FilterSection title="Availability" last>
        <FormGroup>
          {availabilityOptions.map((status) => {
            const count = facets.availabilityCounts?.[status] ?? 0;
            return (
              <FormControlLabel
                key={status}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.availability.includes(status)}
                    disabled={
                      count === 0 && !filters.availability.includes(status)
                    }
                    onChange={() => toggle("availability", status)}
                  />
                }
                label={<FilterLabel name={status} count={count} />}
              />
            );
          })}
        </FormGroup>
      </FilterSection>
    </Box>
  );
};

const FilterSection = ({ title, children, last = false }) => (
  <Box className={last ? "pt-1" : "mb-4"}>
    <Typography className="mb-2 text-xs font-bold tracking-[0.12em] text-foreground uppercase">
      {title}
    </Typography>
    {children}
    {last ? null : <Divider className="mt-4! border-(--color-border)!" />}
  </Box>
);

const FilterLabel = ({ name, count, capitalize = false }) => (
  <Box className="flex w-full items-center justify-between gap-2">
    <span
      className={`text-sm font-bold text-foreground ${capitalize ? "capitalize" : ""}`}
    >
      {name}
    </span>
    <span className="text-xs font-bold text-(--color-foreground-muted)">
      ({count})
    </span>
  </Box>
);

export default FilterSidebar;
