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

    const handleDateSelect = (yearOrMonth, carouselType) => {
        if (carouselType === 'month') {
            setSelectedMonth(yearOrMonth);
            setIsMonthView(true)
        } else {
            setSelectedYear(yearOrMonth);
            setSelectedMonth("")
            setIsMonthView(false)
        }
    };

    //print the selected year and month when they are updated
    useEffect(() => {
        console.log("selectedYear:", selectedYear);
        console.log("selectedMonth:", selectedMonth);
    }, [selectedYear, selectedMonth]);

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <ColorModeSwitch />
            </div>
            <DatesCarousel
                dates={years}
                onDateSelect={(date) => handleDateSelect(date, 'year')}
                selectedDate={selectedYear}
            />
            <DatesCarousel
                dates={months}
                onDateSelect={(date) => handleDateSelect(date, 'month')}
                selectedDate={selectedMonth}
            />
            <ExpensePlot
                year={selectedYear}
                month={selectedMonth}
                onViewChange={handleDateSelect}
                isMonthView={isMonthView}
            />
        </div>
    );
};

export default Graph;
