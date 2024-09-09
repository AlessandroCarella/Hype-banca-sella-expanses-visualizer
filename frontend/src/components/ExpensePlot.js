import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { generateShade, renderMonthView, renderYearView, loadSupercategoryColors } from "./helpers/ExpensePlotHelpers";
import { getData } from "./helpers/getData";

const ExpensePlot = ({ year, month, onViewChange, isMonthView }) => {
    const svgRef = useRef();
    const containerRef = useRef();
    const [data, setData] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const scalesRef = useRef({ x: null, y: null });
    const minWidth = 600; // Set your desired minimum width here
    const [dataType, setDataType] = useState("Expenditure"); // New state for data type
    const [supercategoryColors, setSupercategoryColors] = useState({});

    useEffect(() => {
        const fetchColors = async () => {
            const colors = await loadSupercategoryColors();
            setSupercategoryColors(colors);
        };
        fetchColors();
    }, []);

    const getAspectRatio = (width) => {
        // Formula to approximate the desired aspect ratio
        const minAspectRatio = 0.45;
        const maxAspectRatio = 0.55;
        const minWidth = 800;
        const maxWidth = 2000;
        
        if (width <= minWidth) return maxAspectRatio;
        if (width >= maxWidth) return minAspectRatio;
        
        // Linear interpolation between min and max aspect ratios
        const ratio = (width - minWidth) / (maxWidth - minWidth);
        return maxAspectRatio - ratio * (maxAspectRatio - minAspectRatio);
    };

    useEffect(() => {
        const fetchData = async () => {
            const processedData = await getData(isMonthView, year, month, dataType, supercategoryColors);
            setData(processedData);
        };
        fetchData();
    }, [year, month, isMonthView, dataType]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || !entries.length) return;
            const { width } = entries[0].contentRect;
            const adjustedWidth = Math.max(width, minWidth);
            const aspectRatio = getAspectRatio(adjustedWidth);
            const height = adjustedWidth * aspectRatio;
            setDimensions({ width: adjustedWidth, height });
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

        const margin = {
            top: 20,
            right: 30,
            bottom: isMonthView ? 80 : 40, // Increase bottom margin for month view
            left: 60 // Slightly increase left margin for y-axis labels
        };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        const chart = svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        chart.attr("key", isMonthView ? "month" : "year");

        if (isMonthView) {
            // Ensure data is in the correct format for month view
            const monthData = Array.isArray(data) ? data : [data];
            renderMonthView(chart, monthData, width, height, scalesRef, supercategoryColors);
        } else {
            // Ensure data is in the correct format for year view
            const yearData = Array.isArray(data) ? { [year]: data } : data;
            renderYearView(chart, yearData, width, height, scalesRef, onViewChange, supercategoryColors);
        }

        // Add hover effect
        chart.selectAll(".bar, rect")
            .on("mouseover", function() {
                d3.select(this).raise().classed("hovered", true);
            })
            .on("mouseout", function() {
                d3.select(this).classed("hovered", false);
            });

    }, [data, isMonthView, year, month, onViewChange, dimensions]);

    return (
        <div className="bar-plot-container-div" style={{ position: 'relative' }}>
            <div ref={containerRef} style={{ width: '100%', minWidth: `${minWidth}px` }}>
                <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
            </div>
            <div className="select-type-money">
                <select
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value)}
                >
                    <option value="Expenditure">Expenditure</option>
                    <option value="Revenue">Revenue</option>
                </select>
            </div>
        </div>
    );
};

export default ExpensePlot;
