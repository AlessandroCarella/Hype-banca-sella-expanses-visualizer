//React
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Pages
import UploadCsv from "./pages/UploadCsv";
import Graph from "./pages/Graph";
import SelectOptions from './pages/SelectOptions';
import {SelectedOptionsProvider} from './pages/SelectOptions'
import RedirectPage from "./pages/RedirectPage";

//Context
import { ColorModeProvider } from './contexts/ColorModeContext';

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
import "./styles/pages/loadingPage.css";
import "./styles/topScreenDiv.css";
import "./styles/components/ExpensePlot.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <ColorModeProvider>
            <SelectedOptionsProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<RedirectPage />} />
                        <Route path="/upload-csv" element={<UploadCsv />} />
                        <Route path="/select-options" element={<SelectOptions />} />
                        <Route path="/graphs" element={<Graph />} />
                    </Routes>
                </Router>
            </SelectedOptionsProvider>
        </ColorModeProvider>
    </React.StrictMode>
);
