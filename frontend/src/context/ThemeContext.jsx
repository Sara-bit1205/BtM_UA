import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

    /*useState --> guarda información del estado. Se usa para que recuerde cosas*/

    /*Para establecer el estilo --> claro, default(oscuro) o contraste*/
    const[theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "default";
    });

    /*Para establecer el tamaño del texto, con un valor por defecto del 100%*/
    const [fontSize, setFontSize] = useState(() => {
        return localStorage.getItem("fontSize") || "100";
    });

    /*Para activar o desactivar la fuente accesible (dislexia)*/
    const [accessibleFont, setAccessibleFont] = useState(() => {
        return localStorage.getItem("accessibleFont") === "true";
    });

    /*useEffect --> hace cosas cuando pasa algo. En este caso, 
    cada vez que cambie el tema, se aplicará el nuevo tema al documento y se guardará en localStorage*/
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