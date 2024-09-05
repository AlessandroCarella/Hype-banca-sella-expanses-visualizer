import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as d3 from "d3";
import DatesCarousel from "../components/DatesCarousel";
import { getInitialSelectedDate, mockDates } from "./helpers/GraphHelpers";
import { ColorModeSwitch } from "../components/colorModeSwitch";

function Graphs() {
    const [dates, setDates] = useState(mockDates);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        setSelectedDate(getInitialSelectedDate(dates));
    }, [dates]);

    return (
        <div>
            <ColorModeSwitch />

            <DatesCarousel
                dates={dates}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
            />
            {/* Add your graph components here */}
        </div>
    );
}

export default Graphs;
