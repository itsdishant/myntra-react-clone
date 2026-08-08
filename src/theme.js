import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", system-ui, sans-serif',
    h1: { fontFamily: '"Cormorant", Georgia, serif', fontWeight: 600 },
    h2: { fontFamily: '"Cormorant", Georgia, serif', fontWeight: 600 },
    h3: { fontFamily: '"Cormorant", Georgia, serif', fontWeight: 600 },
    h4: { fontFamily: '"Cormorant", Georgia, serif', fontWeight: 600 },
    h5: { fontFamily: '"Cormorant", Georgia, serif', fontWeight: 600 },
    h6: { fontFamily: '"Cormorant", Georgia, serif', fontWeight: 600 },
    button: {
      fontFamily: '"Montserrat", system-ui, sans-serif',
      textTransform: "none",
      fontWeight: 500,
      letterSpacing: "0.02em",
    },
  },
  palette: {
    primary: {
      main: "#A63D2D",
      light: "#E8A09A",
      dark: "#732A1F",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#3D7A7A",
      light: "#94B8B8",
      dark: "#2A5252",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#C4781E",
      light: "#E8C58A",
      dark: "#855113",
      contrastText: "#1C1C1B",
    },
    success: {
      main: "#2D7D46",
      light: "#6EC66E",
      dark: "#1E5D2E",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#B3261E",
      light: "#E8837E",
      dark: "#7D1A15",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#1C1C1B",
      secondary: "#6E6C68",
      disabled: "#9E9B96",
    },
    divider: "#E0DDD6",
    background: {
      default: "#F5F0EB",
      paper: "#FFFFFF",
    },
    action: {
      hover: "rgb(28 28 27 / 0.04)",
      selected: "rgb(166 61 45 / 0.08)",
      focus: "rgb(166 61 45 / 0.12)",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0 1px 2px rgb(28 28 27 / 0.04), 0 8px 24px rgb(28 28 27 / 0.04)",
    "0 2px 4px rgb(28 28 27 / 0.04), 0 16px 32px rgb(28 28 27 / 0.06)",
    "0 4px 8px rgb(28 28 27 / 0.05), 0 24px 48px rgb(28 28 27 / 0.07)",
    "0 8px 16px rgb(28 28 27 / 0.06), 0 32px 64px rgb(28 28 27 / 0.08)",
    ...Array(20).fill("none"),
  ],
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          paddingBlock: 10,
          transition:
            "background-color 200ms ease, color 200ms ease, border-color 200ms ease, transform 200ms ease",
          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
        containedPrimary: {
          backgroundColor: "#C4781E", // Accent gold for primary CTAs
          "&:hover": {
            backgroundColor: "#A36318",
          },
        },
        containedSecondary: {
          backgroundColor: "#3D7A7A",
          "&:hover": {
            backgroundColor: "#336666",
          },
        },
        outlined: {
          borderColor: "#E0DDD6",
          color: "#1C1C1B",
          "&:hover": {
            borderColor: "#A63D2D",
            backgroundColor: "rgb(166 61 45 / 0.04)",
          },
        },
        outlinedPrimary: {
          borderColor: "#A63D2D",
          color: "#A63D2D",
          "&:hover": {
            backgroundColor: "rgb(166 61 45 / 0.04)",
            borderColor: "#732A1F",
          },
        },
        outlinedSecondary: {
          borderColor: "#3D7A7A",
          color: "#3D7A7A",
          "&:hover": {
            backgroundColor: "rgb(61 122 122 / 0.04)",
            borderColor: "#2A5252",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "background-color 200ms ease, color 200ms ease",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: "#FDEAE8",
          color: "#A63D2D",
        },
        colorSecondary: {
          backgroundColor: "#E6F0F0",
          color: "#3D7A7A",
        },
        colorWarning: {
          backgroundColor: "#FFF7E6",
          color: "#C4781E",
        },
        colorError: {
          backgroundColor: "#FCE8E6",
          color: "#B3261E",
        },
        colorSuccess: {
          backgroundColor: "#E6F4EA",
          color: "#2D7D46",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#FFFFFF",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#C8C5BE",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#A63D2D",
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(245 240 235 / 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E0DDD6",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            "0 1px 2px rgb(28 28 27 / 0.04), 0 8px 24px rgb(28 28 27 / 0.04)",
          border: "1px solid #E0DDD6",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid #E0DDD6",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          borderColor: "#E0DDD6",
          color: "#43423F",
          "&:hover": {
            backgroundColor: "rgb(166 61 45 / 0.04)",
            borderColor: "#A63D2D",
          },
          "&.Mui-selected": {
            backgroundColor: "#A63D2D",
            color: "#FFFFFF",
            borderColor: "#A63D2D",
            "&:hover": {
              backgroundColor: "#8B3326",
            },
          },
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          "& .MuiRating-iconFilled": {
            color: "#C4781E",
          },
          "& .MuiRating-iconHover": {
            color: "#E8C58A",
          },
        },
      },
    },
  },
});

export default theme;
