function setLightMode() {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
}

function setDarkMode() {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
}

export { setLightMode, setDarkMode };
