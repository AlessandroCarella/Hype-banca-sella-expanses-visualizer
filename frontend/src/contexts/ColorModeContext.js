import React, { createContext, useState, useEffect, useContext } from "react";
import {
    setDarkMode,
    setLightMode,
} from "../components/helpers/colorModeSwitchHelpers";

const ColorModeContext = createContext();

export const ColorModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
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
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            if (newMode) {
                setDarkMode();
            } else {
                setLightMode();
            }
            return newMode;
        });
    };

    return (
        <ColorModeContext.Provider value={{ isDarkMode, toggleColorMode }}>
            {children}
        </ColorModeContext.Provider>
    );
};

export const useColorMode = () => useContext(ColorModeContext);
