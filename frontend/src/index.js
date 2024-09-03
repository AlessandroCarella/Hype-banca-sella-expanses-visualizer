import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadCsv from "./pages/UploadCsv";
import Graphs from "./pages/Graph";
import { ColorModeSwitch } from "./components/colorModeSwitch";

import "./styles/main.css";
import "./styles/colorModeSwitch.css";

import "./styles/dark mode/main.css";
import "./styles/dark mode/buttons.css";

import "./styles/light mode/main.css";
import "./styles/light mode/buttons.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <Router>
            <ColorModeSwitch />
            <Routes>
                <Route path="/" element={<UploadCsv />} />
                <Route path="/graphs" element={<Graphs />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
