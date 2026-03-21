//FIXME: Always dark — theme toggling removed.

export const applySavedTheme = () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
};

export const toggleTheme = () => { };