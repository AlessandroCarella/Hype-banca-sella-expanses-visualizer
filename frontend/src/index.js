//React
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Pages
import UploadCsv from "./pages/UploadCsv";
import Graphs from "./pages/Graph";
import SelectOptions, { useSelectedOptions } from './pages/SelectOptions';
import {SelectedOptionsProvider} from './pages/SelectOptions'
//Components
import { ColorModeSwitch } from "./components/colorModeSwitch";

//Styles
import "./styles/main.css";
import "./styles/buttons.css";
import "./styles/colorModeSwitch.css";
import "./styles/components/FoldableList.css";
import "./styles/components/DatesCarousel.css";
import "./styles/pages/SelectOptions.css";
import "./styles/components/CustomSelect.css";
import "./styles/components/BulletListLookalikeFoldableList.css";
import "./styles/components/ConfirmChoice.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <SelectedOptionsProvider>
            <Router>
                <ColorModeSwitch />
                <Routes>
                    <Route path="/upload-csv" element={<UploadCsv />} />
                    <Route path="/select-options" element={<SelectOptions />} />
                    <Route path="/graphs" element={<Graphs />} />
                </Routes>
            </Router>
        </SelectedOptionsProvider>
    </React.StrictMode>
);
