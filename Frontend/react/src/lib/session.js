const USER_KEY = "user";
const LOGGED_IN_KEY = "isLoggedIn";
const THEME_KEY = "theme";

export function initializeSessionStorage() {
  const legacyTheme = localStorage.getItem(THEME_KEY);

  if (!sessionStorage.getItem(THEME_KEY) && legacyTheme) {
    sessionStorage.setItem(THEME_KEY, legacyTheme);
  }

  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LOGGED_IN_KEY);
  localStorage.removeItem(THEME_KEY);
}

export function getSessionUser() {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY) || "null");
  } catch {
    clearSessionUser();
    return null;
  }
}

export function setSessionUser(user) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  sessionStorage.setItem(LOGGED_IN_KEY, "true");
}

export function clearSessionUser() {
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(LOGGED_IN_KEY);
}

export function isSessionLoggedIn() {
  return sessionStorage.getItem(LOGGED_IN_KEY) === "true";
}

export function getStoredTheme() {
  return sessionStorage.getItem(THEME_KEY) || "light";
}

export function setStoredTheme(theme) {
  sessionStorage.setItem(THEME_KEY, theme);
}
