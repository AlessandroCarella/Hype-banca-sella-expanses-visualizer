import React, { useState, useEffect } from "react";
import DatesCarousel from "../components/DatesCarousel";
import ExpensePlot from "../components/ExpensePlot";
import { fetchMonths, useFetchYears } from "./helpers/GraphHelpers";
import { ColorModeSwitch } from "../components/colorModeSwitch";

const Graph = () => {
    const [dates, setDates] = useFetchYears();
    const [selectedDate, setSelectedDate] = useState("");
    const [isMonthView, setIsMonthView] = useState(false);

    useEffect(() => {
        if (!selectedDate) {
            setSelectedDate(dates[dates.length - 1]);
        }
    }, [dates]);

    const handleDateSelect = async (date) => {
        console.log("handleDateSelect", date);
        if (!isMonthView) {
            const months = await fetchMonths(date);
            setDates(months);
            setIsMonthView(true);
        }
        setSelectedDate(date);
    };

    const handleViewChange = async (toMonthView, date) => {
        console.log("handleViewChange, toMonthView", toMonthView, "date", date);
        if (toMonthView) {
            const year = date.split(' ')[1];
            const months = await fetchMonths(year);
            setDates(months);
            setSelectedDate(date);
            setIsMonthView(true);
        } else {
            const years = await fetchMonths(); // This will fetch years as per your API
            setDates(years);
            setSelectedDate(years[0]);
            setIsMonthView(false);
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
                onViewChange={handleViewChange}
                isMonthView={isMonthView}
            />
        </div>
    );
};

export default Graph;
