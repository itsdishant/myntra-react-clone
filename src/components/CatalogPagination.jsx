import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";

/**
 * Catalog pagination — presentational page controls.
 */
const CatalogPagination = ({
  page = 1,
  pageSize = 12,
  totalItems = 0,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems === 0) {
    return null;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <Box className="mt-8 flex flex-col items-center gap-4 border-t border-(--color-border) pt-6 sm:flex-row sm:justify-between">
      <Typography className="text-sm text-(--color-foreground-muted)">
        Showing{" "}
        <Box
          component="span"
          className="font-semibold text-(--color-foreground)"
        >
          {start}–{end}
        </Box>{" "}
        of{" "}
        <Box
          component="span"
          className="font-semibold text-(--color-foreground)"
        >
          {totalItems}
        </Box>
      </Typography>

      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => onPageChange?.(value)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
        aria-label="Product pages"
        sx={{
          "& .MuiPaginationItem-root": {
            fontSize: 13,
            fontWeight: 600,
            minWidth: 36,
            height: 36,
          },
        }}
      />
    </Box>
  );
};

export default CatalogPagination;
