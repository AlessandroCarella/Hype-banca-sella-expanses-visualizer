import React, { useState, useEffect } from "react";
import DatesCarousel from "../components/DatesCarousel";
import ExpensePlot from "../components/ExpensePlot";
import { useFetchYears, useFetchMonths } from "./helpers/GraphHelpers";
import { ColorModeSwitch } from "../components/colorModeSwitch";

const Graph = () => {
    const [years, setYears] = useFetchYears();
    const [selectedYear, setSelectedYear] = useState("");
    const months = useFetchMonths(selectedYear);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [isMonthView, setIsMonthView] = useState(false);

    useEffect(() => {
        if (years.length > 0 && !selectedYear) {
            setSelectedYear(years[years.length - 1]);
        }
    }, [years]);

    const handleDateSelect = (yearOrMonth) => {
        if (isMonthView) {
            setSelectedMonth(yearOrMonth);
        } else {
            setSelectedYear(yearOrMonth);
            setSelectedMonth("");
        }
    };

    //print the selected year and month when they are updated
    useEffect(() => {
        console.log("selectedYear:", selectedYear);
        console.log("selectedMonth:", selectedMonth);
    }, [selectedYear, selectedMonth]);

    const handleViewChange = (toMonthView, yearOrMonth) => {
        setIsMonthView(toMonthView);
        if (toMonthView) {
            setSelectedMonth(yearOrMonth);
        } else {
            setSelectedYear(yearOrMonth);
            setSelectedMonth("");
        }
    };

    return (
        <div>
            <ColorModeSwitch />
            <DatesCarousel
                dates={isMonthView ? months : years}
                onDateSelect={handleDateSelect}
                selectedDate={isMonthView ? selectedMonth : selectedYear}
            />
            <ExpensePlot
                year={selectedYear}
                month={selectedMonth}
                onViewChange={handleViewChange}
                isMonthView={isMonthView}
            />
        </div>
    );
};

export default Graph;
