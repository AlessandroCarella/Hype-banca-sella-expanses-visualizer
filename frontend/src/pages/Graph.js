import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as d3 from "d3";
import DatesCarousel from "../components/DatesCarousel";
import { useFetchDates } from "./helpers/GraphHelpers";
import { ColorModeSwitch } from "../components/colorModeSwitch";
import ExpensePlot from "../components/ExpensePlot";

function Graphs() {
    const dates = useFetchDates();
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        setSelectedDate(dates[dates.length - 1]);
    }, [dates]);

    return (
        <div>
            <ColorModeSwitch />

            <DatesCarousel
                dates={dates}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
            />

            <ExpensePlot />
        </div>
    );
}

export default Graphs;
