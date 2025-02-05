import { colors } from "@/utils/constants";
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext<{
    theme: "light"|"dark",
    setTheme: (value: "light"|"dark") => void,
    textColor: string
}>({
    theme: "light",
    setTheme: (value: "light"|"dark") => null,
    textColor: colors.light.text
});

export function useTheme() {
    const value = useContext(ThemeContext);
    return value;
}

const teste = createContext(null);

export function ThemeProvider(props: PropsWithChildren) {
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState(systemTheme ?? 'light');
    const [textColor, setTextColor] = useState(colors[theme ?? "light"].text);

    useEffect(() => setTextColor(colors[theme ?? "light"].text), [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                textColor
            }}
        >
            {props.children}
        </ThemeContext.Provider>
    );
}