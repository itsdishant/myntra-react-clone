import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

/**
 * Loading indicator — presentational only.
 */
const LoadingSpinner = () => {
  return (
    <Box
      className="my-24 flex flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <CircularProgress size={40} thickness={3} color="primary" />
      <Typography className="text-sm text-(--color-foreground-muted)">
        Gathering the collection…
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
