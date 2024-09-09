import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { generateShade, supercategoryColors, renderMonthView, renderYearView } from "./helpers/ExpensePlotHelpers";
import { generateMockData } from "./helpers/plotMockData";

const ExpensePlot = ({ selectedDate, onViewChange, isMonthView }) => {
    const svgRef = useRef();
    const [data, setData] = useState(null);
    const scalesRef = useRef({ x: null, y: null });

    useEffect(() => {
        const processedData = generateMockData(isMonthView);
        setData(processedData);
    }, [selectedDate, isMonthView]);

    useEffect(() => {
        if (!data) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        const chart = svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        chart.attr("key", isMonthView ? "month" : "year");

        if (isMonthView) {
            renderMonthView(chart, data, width, height, scalesRef);
        } else {
            renderYearView(chart, data, width, height, scalesRef, onViewChange);
        }
    }, [data, isMonthView, selectedDate, onViewChange]);

    return <svg ref={svgRef}></svg>;
};

export default ExpensePlot;
