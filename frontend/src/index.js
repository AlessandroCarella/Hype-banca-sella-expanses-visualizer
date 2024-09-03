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
import SelectWithHoverDictValToHoveValAsInput from "./components/SelectWithHoverDictValToHoveValAsInput";

//Styles
import "./styles/main.css";
import "./styles/buttons.css";
import "./styles/colorModeSwitch.css";
import "./styles/components/FoldableList.css";
import "./styles/components/SelectValue.css";
import "./styles/components/DatesCarousel.css";
import "./styles/pages/SelectOptions.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const namesDescriptionsDict = {
    1: "10",
    2: "20",
    3: "30",
    4: "40",
    5: "50",
    6: "60",
    7: "70",
    8: "80",
    9: "90",
    10: "100",
};
const handleSelectChange = (selectedValue) => {
    console.log("Selected:", selectedValue);
};

root.render(
    <React.StrictMode>
        <Router>
            <ColorModeSwitch />
            {/* <SelectOptions /> */}
            <Routes>
                <Route path="/" element={<UploadCsv />} />
                <Route path="/graphs" element={<Graphs />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
