import { create } from "zustand";

const useThemeStore = create((set) => ({
// Default theme
  theme: "light",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",  // Toggle between light and dark
    })),
}));

export default useThemeStore;
