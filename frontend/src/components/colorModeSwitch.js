import React, { useEffect, useState } from "react";
import { setDarkMode, setLightMode } from "./helpers/colorModeSwitchHelpers";

export function ColorModeSwitch() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Set initial state based on user preference or system setting
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            setIsDarkMode(true);
            setDarkMode();
        } else {
            setLightMode();
        }
    }, []);

    const toggleColorMode = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            setDarkMode();
        } else {
            setLightMode();
        }
    };

    return (
        <div className="color-mode-switch position-absolute top-0 end-0 p-3">
            <input
                type="checkbox"
                id="colorModeSwitch"
                className="color-mode-switch__checkbox"
                checked={isDarkMode}
                onChange={toggleColorMode}
            />
            <label
                htmlFor="colorModeSwitch"
                className="color-mode-switch__label"
            >
                <span className="color-mode-switch__icon"></span>
            </label>
        </div>
    );
}
