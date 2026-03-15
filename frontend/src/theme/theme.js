// Always dark — theme toggling removed.
// Call applySavedTheme() once in App.jsx useEffect.

export const applySavedTheme = () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
};

// Kept as a no-op so any leftover import doesn't break.
export const toggleTheme = () => { };