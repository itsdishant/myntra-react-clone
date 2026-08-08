import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FilterListIcon from "@mui/icons-material/FilterList";
import { SORT_OPTIONS, PAGE_SIZE_OPTIONS } from "../utils/filters";

/**
 * Results toolbar — count, sort, active filter chips, mobile filters trigger.
 */
const ResultsToolbar = ({
  pageStart = 0,
  pageEnd = 0,
  filteredCount = 0,
  sort = "featured",
  pageSize = 20,
  onSortChange,
  onPageSizeChange,
  chips = [],
  onRemoveChip,
  onClearFilters,
  onOpenFilters,
}) => {
  return (
    <Box className="mb-5 space-y-3">
      <Box className="flex flex-wrap items-center justify-between gap-3">
        <Box className="flex items-center gap-3">
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={onOpenFilters}
            className="min-h-11! md:hidden!"
          >
            Filters
          </Button>
          <Typography className="text-sm text-(--color-foreground-muted)">
            {filteredCount > 0 ? (
              <>
                Showing{" "}
                <Box
                  component="span"
                  className="font-semibold text-(--color-foreground)"
                >
                  {pageStart}–{pageEnd}
                </Box>{" "}
                of{" "}
                <Box
                  component="span"
                  className="font-semibold text-(--color-foreground)"
                >
                  {filteredCount}
                </Box>{" "}
                results
              </>
            ) : (
              "No results"
            )}
          </Typography>
        </Box>

        <Box className="flex flex-wrap items-center gap-2">
          <FormControl size="small" className="min-w-[148px]">
            <Select
              value={pageSize}
              onChange={(event) =>
                onPageSizeChange?.(Number(event.target.value))
              }
              displayEmpty
              inputProps={{ "aria-label": "Products per page" }}
              sx={{
                borderRadius: 999,
                fontSize: 13,
                backgroundColor: "var(--color-surface)",
              }}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" className="min-w-[200px]">
            <Select
              value={sort}
              onChange={(event) => onSortChange?.(event.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Sort products" }}
              sx={{
                borderRadius: 999,
                fontSize: 13,
                backgroundColor: "var(--color-surface)",
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  Sort by: {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {chips.length > 0 ? (
        <Box className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <Chip
              key={chip.id}
              label={chip.label}
              onDelete={() => onRemoveChip?.(chip)}
              className="capitalize!"
              size="small"
            />
          ))}
          <Button
            size="small"
            onClick={onClearFilters}
            className="min-h-8! text-xs! text-(--color-primary)!"
          >
            Clear filters
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default ResultsToolbar;
