"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Moon, Sun } from "lucide-react";

const ThemeContext = createContext<(() => void) | null>(null);
const themeChangeEvent = "nongki-theme-change";

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function subscribeToTheme(onChange: () => void) {
  window.addEventListener(themeChangeEvent, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(themeChangeEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";

  try {
    window.localStorage.setItem("nongki-theme", isDark ? "dark" : "light");
  } catch (error) {
    console.error("Unable to save the theme preference.", error);
  }

  window.dispatchEvent(new Event(themeChangeEvent));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={toggleTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const toggle = useContext(ThemeContext);
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => false,
  );

  if (!toggle) {
    throw new Error("ThemeToggle must be rendered inside ThemeProvider.");
  }

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggle}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-[#5C7057] bg-white dark:bg-[#3b4a38] text-slate-700 dark:text-[#D1EDD3] transition-all hover:bg-slate-100 dark:hover:bg-[#5C7057]/50 active:scale-[0.98]"
    >
      {isDark ? (
        <Sun aria-hidden="true" size={16} />
      ) : (
        <Moon aria-hidden="true" size={16} />
      )}
    </button>
  );
}
