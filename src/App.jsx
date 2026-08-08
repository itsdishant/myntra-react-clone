import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Header from "./components/Header";
import Footer from "./components/Footer";

/**
 * App shell — layout route outlet + chrome.
 * Search/cart props come from RootLayout until you wire real state.
 */
function App({
  bagCount = 0,
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
  searchQuery = "",
  onClearSearch,
}) {
  return (
    <Box className="flex min-h-screen flex-col">
      <Header
        bagCount={bagCount}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
      />
      <Box className="flex-1">
        <Outlet context={{ searchQuery, onClearSearch }} />
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
