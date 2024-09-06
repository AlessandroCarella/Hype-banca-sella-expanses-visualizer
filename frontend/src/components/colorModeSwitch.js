import React from "react";
import { useColorMode } from "../contexts/ColorModeContext";

export function ColorModeSwitch() {
    const { isDarkMode, toggleColorMode } = useColorMode();

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
