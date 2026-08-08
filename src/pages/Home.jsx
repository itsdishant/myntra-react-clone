import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import HomeItem from "../components/HomeItem";
import FilterSidebar from "../components/FilterSidebar";
import ResultsToolbar from "../components/ResultsToolbar";
import CatalogPagination from "../components/CatalogPagination";

/**
 * Amazon-lite catalog layout — presentational.
 * Pass filtered/sorted `items`, facets, and filter/sort handlers from parent.
 */
const Home = ({
  items = [],
  filteredCount,
  page = 1,
  pageSize = 20,
  pageStart = 0,
  pageEnd = 0,
  bagItemIds = [],
  facets = {},
  filters,
  sort = "featured",
  chips = [],
  filtersOpen = false,
  onFiltersChange,
  onSortChange,
  onPageChange,
  onPageSizeChange,
  onRemoveChip,
  onClearFilters,
  onOpenFilters,
  onCloseFilters,
  onAddToBag,
  onRemoveFromBag,
}) => {
  const resultCount = filteredCount ?? items.length;

  return (
    <Box component="main" id="main-content" className="w-full">
      <Box className="mx-auto w-full max-w-shell px-4 py-6 sm:px-6 sm:py-8">
        <Box className="flex gap-6 lg:gap-8">
          <Box className="hidden w-64 shrink-0 md:block lg:w-72">
            <Box className="sticky top-24">
              <FilterSidebar
                facets={facets}
                filters={filters}
                onChange={onFiltersChange}
                onClear={onClearFilters}
              />
            </Box>
          </Box>

          <Box className="min-w-0 flex-1">
            <ResultsToolbar
              pageStart={pageStart}
              pageEnd={pageEnd}
              filteredCount={resultCount}
              sort={sort}
              pageSize={pageSize}
              onSortChange={onSortChange}
              onPageSizeChange={onPageSizeChange}
              chips={chips}
              onRemoveChip={onRemoveChip}
              onClearFilters={onClearFilters}
              onOpenFilters={onOpenFilters}
            />

            {resultCount === 0 ? (
              <Box className="rounded-2xl border border-dashed border-(--color-border) bg-surface/80 px-6 py-16 text-center">
                <Typography className="mb-2 text-lg font-medium text-foreground">
                  No products match these filters
                </Typography>
                <Typography className="text-sm text-(--color-foreground-muted)">
                  Try clearing a filter or widening the price range.
                </Typography>
              </Box>
            ) : (
              <>
                <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((item) => (
                    <HomeItem
                      key={item.id}
                      item={item}
                      inBag={bagItemIds.includes(item.id)}
                      onAddToBag={
                        onAddToBag ? () => onAddToBag(item.id) : undefined
                      }
                      onRemoveFromBag={
                        onRemoveFromBag
                          ? () => onRemoveFromBag(item.id)
                          : undefined
                      }
                    />
                  ))}
                </Box>

                <CatalogPagination
                  page={page}
                  pageSize={pageSize}
                  totalItems={resultCount}
                  onPageChange={onPageChange}
                />
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Drawer
        anchor="left"
        open={filtersOpen}
        onClose={onCloseFilters}
        PaperProps={{
          className: "w-[min(100vw,22rem)]! bg-background! p-3!",
        }}
      >
        <Box className="mb-2 flex items-center justify-between px-1">
          <Typography className="text-sm font-semibold text-foreground">
            Filter products
          </Typography>
          <IconButton
            aria-label="Close filters"
            onClick={onCloseFilters}
            className="min-h-11! min-w-11!"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <FilterSidebar
          facets={facets}
          filters={filters}
          onChange={onFiltersChange}
          onClear={onClearFilters}
        />
      </Drawer>
    </Box>
  );
};

export default Home;
