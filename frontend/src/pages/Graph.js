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
    const [currentYear, setCurrentYear] = useState(null);

    useEffect(() => {
        if (dates.length > 0) {
            setSelectedDate(dates[dates.length - 1]);
            setCurrentYear(dates[dates.length - 1]);
        }
    }, [dates]);

    const handleViewChange = async (newIsMonthView, year, month = null) => {
        setIsMonthView(newIsMonthView);
        if (newIsMonthView) {
            const months = await fetchMonths(year);
            setDates(months);
            // Update selectedDate here
            setSelectedDate(month || months[0]);
            setCurrentYear(year);
        } else {
            const years = await fetchMonths();
            setDates(years);
            setSelectedDate(years[years.length - 1]);
            setCurrentYear(years[years.length - 1]);
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        if (isMonthView) {
            // If it's month view, we need to extract the year from the selected date
            const year = date.split(" ")[1];
            setCurrentYear(year);
        } else {
            setCurrentYear(date);
        }
    };

    return (
        <div>
            <ColorModeSwitch />

            <DatesCarousel
                dates={dates}
                onDateSelect={handleDateSelect}
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
