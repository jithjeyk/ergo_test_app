import { createTheme, ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    darker: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    filter: true;
  }
}

type ThemeMode = "light" | "dark";

// Color palette extracted from the Document AI interface
const colors = {
  // Dark theme colors
  dark: {
    primary: {
      main: "#4285F4", // Blue used in charts and primary buttons
      light: "#5E97F6",
      dark: "#3367D6",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#9C27B0", // Purple used in processing section
      light: "#BA68C8",
      dark: "#7B1FA2",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#34A853", // Green used in users section
      light: "#4CAF50",
      dark: "#2E7D32",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#EA4335", // Red used in the TB avatar
      light: "#F44336",
      dark: "#D32F2F",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FBBC05", // Yellow/orange used in SM avatar
      light: "#FFC107",
      dark: "#FFA000",
      contrastText: "#000000",
    },
    info: {
      main: "#4285F4", // Blue info color
      light: "#64B5F6",
      dark: "#1976D2",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#FFFFFF", // White text
      secondary: "#B0BEC5", // Light gray text for secondary information
      disabled: "#546E7A", // Darker gray for disabled text
    },
    background: {
      default: "#1E2531", // Main dark background
      paper: "#252D3A", // Slightly lighter card background
      darker: "#1A202B", // Even darker background for sidebar
    },
    divider: "#313D4F",
    action: {
      active: "#FFFFFF",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
  },

  // Light theme colors
  light: {
    primary: {
      main: "#4285F4", // Keep the same blue as primary
      light: "#5E97F6",
      dark: "#3367D6",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#9C27B0", // Same purple
      light: "#BA68C8",
      dark: "#7B1FA2",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#34A853", // Same green
      light: "#4CAF50",
      dark: "#2E7D32",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#EA4335", // Same red
      light: "#F44336",
      dark: "#D32F2F",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FBBC05", // Same yellow/orange
      light: "#FFC107",
      dark: "#FFA000",
      contrastText: "#000000",
    },
    info: {
      main: "#4285F4", // Same blue info color
      light: "#64B5F6",
      dark: "#1976D2",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#202124", // Dark text for light theme
      secondary: "#5F6368", // Medium gray for secondary text
      disabled: "#9AA0A6", // Light gray for disabled text
    },
    background: {
      default: "#F8F9FA", // Light gray background
      paper: "#FFFFFF", // White card background
      darker: "#ECEFF1", // Slightly darker for sidebar
    },
    divider: "#E0E0E0",
    action: {
      active: "#202124",
      hover: "rgba(0, 0, 0, 0.04)",
      selected: "rgba(0, 0, 0, 0.08)",
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
    },
  },
};

// Theme configuration
const getDesignTokens = (mode: ThemeMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "dark" ? colors.dark : colors.light),
  },
  typography: {
    fontFamily: [
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1.1rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      opacity: 0.8,
    },
    body1: {
      fontSize: "0.875rem",
    },
    body2: {
      fontSize: "0.75rem",
    },
    button: {
      fontSize: "0.875rem",
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor:
            mode === "dark"
              ? colors.dark.background.darker
              : colors.light.background.paper,
          color:
            mode === "dark"
              ? colors.dark.text.primary
              : colors.light.text.primary,
          boxShadow: "none",
          borderBottom: `1px solid ${
            mode === "dark" ? colors.dark.divider : colors.light.divider
          }`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor:
            mode === "dark"
              ? colors.dark.background.darker
              : colors.light.background.darker,
          border: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: "6px 16px",
          textTransform: "none",
          fontWeight: 500,
        },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        outlinedPrimary: {
          borderWidth: 1,
        },
      },
      variants: [
        {
          props: { variant: "filter" },
          style: {
            backgroundColor:
              mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.05)",
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
            },
          },
        },
      ],
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "none",
          border: `1px solid ${
            mode === "dark" ? colors.dark.divider : colors.light.divider
          }`,
          backgroundColor:
            mode === "dark"
              ? colors.dark.background.paper
              : colors.light.background.paper,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "16px 20px 8px",
        },
        title: {
          fontSize: "1rem",
          fontWeight: 500,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "0px 20px 20px",
          "&:last-child": {
            paddingBottom: 20,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${
            mode === "dark" ? colors.dark.divider : colors.light.divider
          }`,
          padding: "12px 16px",
        },
        head: {
          fontWeight: 700,
          fontSize: "0.775rem",
          color:
            mode === "dark"
              ? colors.dark.text.secondary
              : colors.light.text.secondary,
          backgroundColor:
            mode === "dark"
              ? colors.dark.background.darker
              : colors.light.background.darker,
        },
        body: {
          maxWidth: "200px",
          // minWidth: "100px",
          wordBreak: "break-word",
        }
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          "&.Mui-selected": {
            backgroundColor:
              mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(66, 133, 244, 0.08)",
          },
          "&.Mui-selected:hover": {
            backgroundColor:
              mode === "dark"
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(66, 133, 244, 0.12)",
          },
          "&:hover": {
            backgroundColor:
              mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: "inherit",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 500,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 4,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          "& .MuiSwitch-switchBase": {
            padding: 2,
            "&.Mui-checked": {
              transform: "translateX(16px)",
              "& + .MuiSwitch-track": {
                opacity: 1,
              },
            },
          },
          "& .MuiSwitch-thumb": {
            width: 22,
            height: 22,
          },
          "& .MuiSwitch-track": {
            borderRadius: 13,
            opacity: 1,
          },
        },
      },
    },
  },
});

// Create the dark theme
export const darkTheme = createTheme(getDesignTokens("dark"));

// Create the light theme
export const lightTheme = createTheme(getDesignTokens("light"));

// Usage example:
// import { ThemeProvider } from '@mui/material/styles';
// import { darkTheme, lightTheme } from './path-to-this-file';
//
// function App() {
//   const [darkMode, setDarkMode] = useState(true);
//   const theme = darkMode ? darkTheme : lightTheme;
//
//   return (
//     <ThemeProvider theme={theme}>
//       <YourApp />
//     </ThemeProvider>
//   );
// }
