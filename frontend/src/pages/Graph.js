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
    const [includeRisparmi, setIncludeRisparmi] = useState(false); // New state for includeRisparmi

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

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <ColorModeSwitch />
                <div className="select-top-left-risparmi">                    <select
                        value={includeRisparmi ? "true" : "false"}
                        onChange={(e) => setIncludeRisparmi(e.target.value === "true")}
                    >
                        <option value="false">Exclude Risparmi</option>
                        <option value="true">Include Risparmi</option>
                    </select>
                </div>
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
                includeRisparmi={includeRisparmi} // Pass the state to ExpensePlot
            />
        </div>
    );
};

export default Graph;
