import { create } from "zustand";

interface UIState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Initialize state from localStorage or system preference
const getInitialDarkMode = (): boolean => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme !== null) {
    return savedTheme === "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const initialDarkMode = getInitialDarkMode();

// Ensure initial class is set on load
if (initialDarkMode) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

export const useUIStore = create<UIState>((set) => ({
  darkMode: initialDarkMode,
  toggleDarkMode: () =>
    set((state) => {
      const nextDarkMode = !state.darkMode;
      
      if (nextDarkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      return { darkMode: nextDarkMode };
    }),
}));