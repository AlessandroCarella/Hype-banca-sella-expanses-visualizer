import React from "react";
import ReactDOM from "react-dom";
import UploadCsv from "./modules/UploadCsv";
import { ColorModeSwitch } from "./modules/colorModeSwitch";

import "./styles/main.css";
import "./styles/colorModeSwitch.css";

import "./styles/dark mode/main.css";
import "./styles/dark mode/buttons.css";

import "./styles/light mode/main.css";
import "./styles/light mode/buttons.css";

ReactDOM.render(
    <React.StrictMode>
        <ColorModeSwitch />
        <UploadCsv />
    </React.StrictMode>,
    document.getElementById("root")
);
