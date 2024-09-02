export function initColorModeSwitch() {
    const colorModeSwitch = document.getElementById("colorModeSwitch");
    colorModeSwitch.addEventListener("change", toggleColorMode);

    // Set initial color mode based on user preference
    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        colorModeSwitch.checked = true;
        setDarkMode();
    } else {
        setLightMode();
    }
}

function toggleColorMode() {
    const colorModeSwitch = document.getElementById("colorModeSwitch");
    if (colorModeSwitch.checked) {
        setDarkMode();
    } else {
        setLightMode();
    }
}

function setLightMode() {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
}

function setDarkMode() {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
}
