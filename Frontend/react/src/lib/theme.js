import { getStoredTheme, setStoredTheme } from "./session";

export function applyTheme(theme) {
  const resolvedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.classList.toggle("theme-dark", resolvedTheme === "dark");
  document.documentElement.classList.toggle("theme-light", resolvedTheme !== "dark");
  document.body.dataset.theme = resolvedTheme;
  setStoredTheme(resolvedTheme);
}

export function initializeTheme() {
  applyTheme(getStoredTheme());
}
