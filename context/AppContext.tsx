import React from "react"
import { createContext, useContext, useState, useMemo, FC } from "react";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import { themeDark, themeLight } from "theme/theme";

const ThemeMode = {
    light: "light",
    dark: "dark",
} as const;

const AppContext = createContext({ toggleColorMode: () => {} });

const useAppContext = () => useContext(AppContext);

const AppProvider = ({ children }: { children: JSX.Element[] }) => {
    const [mode, setMode] = useState<keyof typeof ThemeMode>(ThemeMode.light);
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === ThemeMode.light ? ThemeMode.dark : ThemeMode.light));
            },
        }),
        []
    );

    const theme = useMemo(() => createTheme(mode === ThemeMode.light ? themeLight : themeDark), [mode]);

    return (
        <AppContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </AppContext.Provider>
    );
}

export { useAppContext, AppProvider, ThemeMode };