import { createTheme, ThemeOptions } from "@mui/material/styles";
import { red } from "@mui/material/colors";

declare module "@mui/material/styles" {
    interface Palette {
        backgroundSecondary: Palette["primary"];
        black: Palette["primary"];
    }

    interface PaletteOptions {
        backgroundSecondary?: PaletteOptions["primary"];
        black?: PaletteOptions["primary"];
    }
}

const themeLight: ThemeOptions = {
    typography: {
        fontFamily: ["Poppins", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    },
    palette: {
        mode: "light",
        primary: {
            main: "#1725a4",
        },
        secondary: {
            main: "#f50057",
        },
        background: {
            default: "#f9f9f9",
            paper: "#ffffff",
        },
        backgroundSecondary: {
            main: "#f1f2f4",
        },
        text: {
            primary: "#111112",
        },
        black: {
            main: "#111112",
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#f1f2f4",
                    color: "#111112",
                    boxShadow: "none",
                }
            },
            defaultProps: {
                color: "inherit",
            }
        }
    },
};
const themeDark: ThemeOptions = {
    typography: {
        fontFamily: ["Poppins", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    },
    palette: {
        mode: "dark",
        primary: {
            main: "#5462e7",
        },
        secondary: {
            main: "#f50057",
        },
        background: {
            default: "#1e1e1e",
            paper: "#303030",
        },
        backgroundSecondary: {
            main: "#262627",
        },
        text: {
            primary: "#fafafa",
        },
        black: {
            main: "#111112",
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#111112",
                    color: "#fafafa",
                    boxShadow: "none",
                },
            },
            defaultProps: {
                color: "inherit",
            },
        },
    },
};

export {
    themeLight,
    themeDark,
}

