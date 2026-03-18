import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const[theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "default";
    });

    const [fontSize, setFontSize] = useState(() => {
        return localStorage.getItem("fontSize") || "100";
    });

    const [accessibleFont, setAccessibleFont] = useState(() => {
        return localStorage.getItem("accessibleFont") === "true";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.style.setProperty("--font-size-scale", `${fontSize}%`);
        localStorage.setItem("fontSize", fontSize);
    }, [fontSize]);

    useEffect(() => {
        if (accessibleFont) {
        document.documentElement.setAttribute("data-font", "accessible");
        } else {
        document.documentElement.removeAttribute("data-font");
        }

        localStorage.setItem("accessibleFont", accessibleFont);
    }, [accessibleFont]);

    return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        setFontSize,
        accessibleFont,
        setAccessibleFont,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}