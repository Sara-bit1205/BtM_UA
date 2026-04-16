import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";

const ThemeContext = createContext();

const DEFAULT_THEME = "default";
const DEFAULT_FONT_SIZE = "100";
const DEFAULT_ACCESSIBLE_FONT = false;

export function ThemeProvider({ children }) {
  const { profile, isAuthenticated } = useAuth();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || DEFAULT_THEME;
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("fontSize") || DEFAULT_FONT_SIZE;
  });

  const [accessibleFont, setAccessibleFont] = useState(() => {
    return localStorage.getItem("accessibleFont") === "true" || DEFAULT_ACCESSIBLE_FONT;
  });

  const isApplyingProfileRef = useRef(false);
  const hasLoadedProfilePrefsRef = useRef(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-size-scale", `${fontSize}%`);
  }, [fontSize]);

  useEffect(() => {
    if (accessibleFont) {
      document.documentElement.setAttribute("data-font", "accessible");
    } else {
      document.documentElement.removeAttribute("data-font");
    }
  }, [accessibleFont]);

  useEffect(() => {
    if (isAuthenticated && profile) {
      isApplyingProfileRef.current = true;

      setTheme(profile.theme || DEFAULT_THEME);
      setFontSize(profile.font_size || DEFAULT_FONT_SIZE);
      setAccessibleFont(profile.accessible_font ?? DEFAULT_ACCESSIBLE_FONT);

      hasLoadedProfilePrefsRef.current = true;

      setTimeout(() => {
        isApplyingProfileRef.current = false;
      }, 0);
    } else {
      setTheme(DEFAULT_THEME);
      setFontSize(DEFAULT_FONT_SIZE);
      setAccessibleFont(DEFAULT_ACCESSIBLE_FONT);

      hasLoadedProfilePrefsRef.current = false;
    }
  }, [isAuthenticated, profile]);

  useEffect(() => {
    const savePreferences = async () => {
      if (!isAuthenticated || !profile?.id) return;
      if (!hasLoadedProfilePrefsRef.current) return;
      if (isApplyingProfileRef.current) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          theme,
          font_size: fontSize,
          accessible_font: accessibleFont,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) {
        console.error("Error guardando preferencias de tema:", error.message);
      }
    };

    savePreferences();
  }, [theme, fontSize, accessibleFont, isAuthenticated, profile?.id]);

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
    setFontSize(DEFAULT_FONT_SIZE);
    setAccessibleFont(DEFAULT_ACCESSIBLE_FONT);

    document.documentElement.setAttribute("data-theme", DEFAULT_THEME);
    document.documentElement.style.setProperty("--font-size-scale", `${DEFAULT_FONT_SIZE}%`);
    document.documentElement.removeAttribute("data-font");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        setFontSize,
        accessibleFont,
        setAccessibleFont,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}