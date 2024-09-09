import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { generateShade, supercategoryColors, renderMonthView, renderYearView } from "./helpers/ExpensePlotHelpers";
import { generateMockData } from "./helpers/plotMockData";

const ExpensePlot = ({ selectedDate, onViewChange, isMonthView }) => {
    const svgRef = useRef();
    const containerRef = useRef();
    const [data, setData] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const scalesRef = useRef({ x: null, y: null });
    const minWidth = 600; // Set your desired minimum width here

    useEffect(() => {
        const processedData = generateMockData(isMonthView);
        setData(processedData);
    }, [selectedDate, isMonthView]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || !entries.length) return;
            const { width, height } = entries[0].contentRect;
            setDimensions({ width: Math.max(width, minWidth), height });
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!data || !dimensions.width || !dimensions.height) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

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
    }, [data, isMonthView, selectedDate, onViewChange, dimensions]);

    return (
        <div style={{ width: '100%', height: '500px', overflowX: 'auto' }}>
            <div ref={containerRef} style={{ width: '100%', minWidth: `${minWidth}px`, height: '100%' }}>
                <svg ref={svgRef}></svg>
            </div>
        </div>
    );
};

export default ExpensePlot;
