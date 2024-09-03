//React
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Pages
import UploadCsv from "./pages/UploadCsv";
import Graphs from "./pages/Graph";
import SelectOptions from "./pages/SelectOptions";

//Components
import { ColorModeSwitch } from "./components/colorModeSwitch";

//Styles
import "./styles/main.css";
import "./styles/buttons.css";
import "./styles/colorModeSwitch.css";
import "./styles/components/FoldableList.css";
import "./styles/components/SelectValue.css";
import "./styles/components/DatesCarousel.css";
import "./styles/pages/SelectOptions.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <Router>
            <ColorModeSwitch />
            <SelectOptions />
            {/* <Routes>
                <Route path="/" element={<UploadCsv />} />
                <Route path="/graphs" element={<Graphs />} />
            </Routes> */}
        </Router>
    </React.StrictMode>
);
