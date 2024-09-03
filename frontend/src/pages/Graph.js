import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as d3 from "d3";
import DatesCarousel from "../components/DatesCarousel";
import { getInitialSelectedDate, mockDates } from "./helpers/GraphHelpers";

function Graphs() {
    const [dates, setDates] = useState(mockDates);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        setSelectedDate(getInitialSelectedDate(dates));
    }, [dates]);

    useEffect(() => {
        if (selectedDate) {
            console.log("Selected date:", selectedDate);
        }
    }, [selectedDate]);

    return (
        <div>
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
