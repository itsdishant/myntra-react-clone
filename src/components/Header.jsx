import { Link, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

/**
 * Amazon-lite structure + light Atelier header.
 * Logo, big search (submit), cart — presentational.
 */
const Header = ({
  bagCount = 0,
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
}) => {
  const { pathname } = useLocation();

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit?.(searchValue);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      className="border-b border-(--color-border)/80 backdrop-blur-md"
      sx={{ bgcolor: "rgb(253 252 252 / 0.9)" }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-(--color-foreground) focus:shadow-soft"
      >
        Skip to main content
      </a>

      <Toolbar className="mx-auto flex w-full max-w-shell min-h-16 gap-3 px-3 sm:gap-4 sm:px-6 lg:min-h-[4.25rem]">
        <Link to="/" className="group shrink-0 cursor-pointer px-1">
          <Typography
            component="span"
            className="font-display! text-[1.85rem]! leading-none! font-semibold! tracking-[0.06em]! text-(--color-foreground)! transition-colors duration-200 group-hover:text-(--color-primary)"
            sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
          >
            Atelier
          </Typography>
        </Link>

        <Box
          component="form"
          onSubmit={handleSubmit}
          className="flex min-w-0 flex-1 items-stretch overflow-hidden rounded-full border border-(--color-border) bg-surface shadow-soft transition-[border-color,box-shadow] duration-200 focus-within:border-(--color-primary)/35 focus-within:shadow-lift"
          role="search"
        >
          <InputBase
            fullWidth
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search Atelier"
            className="px-4 py-2 text-sm text-(--color-foreground) sm:px-5 sm:text-[15px]"
            inputProps={{ "aria-label": "Search products" }}
          />
          <Button
            type="submit"
            aria-label="Search"
            className="min-h-11! min-w-12! rounded-none! rounded-r-full! bg-(--color-accent)! px-3! text-white! hover:bg-(--color-accent-hover)! sm:min-w-14!"
          >
            <SearchIcon />
          </Button>
        </Box>

        <Button
          component={Link}
          to="/bag"
          className={`min-h-11! gap-1.5! rounded-full! px-2! text-(--color-foreground)! normal-case! hover:bg-(--color-neutral-100)! sm:px-3! ${
            pathname === "/bag" ? "bg-primary-soft!" : ""
          }`}
          aria-label={`Cart with ${bagCount} items`}
        >
          <Badge
            badgeContent={bagCount}
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: "var(--color-primary)",
                color: "var(--color-on-primary)",
                fontWeight: 700,
                fontSize: 11,
                minWidth: 18,
                height: 18,
              },
            }}
          >
            <ShoppingBagOutlinedIcon />
          </Badge>
          <Typography
            component="span"
            className="hidden text-sm font-semibold tracking-wide sm:inline"
          >
            Cart
          </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
