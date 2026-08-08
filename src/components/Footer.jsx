import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/**
 * Minimal footer — copyright only, centered.
 */
const Footer = () => {
  return (
    <Box
      component="footer"
      className="mt-auto border-t border-(--color-border)/80 bg-transparent"
    >
      <Typography className="px-4 py-6 text-center text-sm tracking-wide text-(--color-foreground-muted)">
        © {new Date().getFullYear()} Atelier. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
