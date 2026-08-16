import { useEffect, useState } from "react";

export type Theme = "light" | "dark";
const STORAGE_KEY = "portfolio-theme";

function getInitial(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Ignore localStorage read errors (e.g. disabled or SSR)
  }
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const initial = getInitial();
    setThemeState(initial);
    apply(initial);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    apply(t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // Ignore localStorage write errors
    }
  };

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return { theme, setTheme, toggle };
}
