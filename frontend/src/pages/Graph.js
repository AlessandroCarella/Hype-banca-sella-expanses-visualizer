import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as d3 from "d3";
import DatesCarousel from "../components/DatesCarousel";
import { useFetchDates, fetchMonths } from "./helpers/GraphHelpers";
import { ColorModeSwitch } from "../components/colorModeSwitch";
import ExpensePlot from "../components/ExpensePlot";

function Graphs() {
    const [dates, setDates] = useFetchDates();
    const [selectedDate, setSelectedDate] = useState(null);
    const [isMonthView, setIsMonthView] = useState(false);

    useEffect(() => {
        if (dates.length > 0) {
            setSelectedDate(dates[dates.length - 1]);
        }
    }, [dates]);

    const handleViewChange = async (newIsMonthView, year, month = null) => {
        setIsMonthView(newIsMonthView);
        if (newIsMonthView) {
            const months = await fetchMonths(year);
            setDates(months);
            setSelectedDate(month ? `${month} ${year}` : months[0]);
        } else {
            // Fetch years again
            const years = await fetchMonths(); // This will fetch years as it has no parameter
            setDates(years);
            setSelectedDate(years[years.length - 1]);
        }
    };

    return (
        <div>
            <ColorModeSwitch />

            <DatesCarousel
                dates={dates}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
            />

            <ExpensePlot
                selectedDate={selectedDate}
                isMonthView={isMonthView}
                onViewChange={handleViewChange}
            />
        </div>
    );
}

export default Graphs;
