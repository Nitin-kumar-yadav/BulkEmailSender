export const toggleTheme = () => {
    const html = document.documentElement;
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "dark") {
        html.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        html.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
};
export const applySavedTheme = () => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
};