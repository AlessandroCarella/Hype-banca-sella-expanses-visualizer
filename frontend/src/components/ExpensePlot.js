import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { generateShade, renderMonthView, renderYearView, loadSupercategoryColors } from "./helpers/ExpensePlotHelpers";
import { getData } from "./helpers/getDataExpensePlot";

const ExpensePlot = ({ year, month, onViewChange, isMonthView, includeRisparmi }) => {
    const svgRef = useRef();
    const containerRef = useRef();
    const [data, setData] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const scalesRef = useRef({ x: null, y: null });
    const minWidth = 600; // Set your desired minimum width here
    const [dataType, setDataType] = useState("Expenditure"); // New state for data type
    const [supercategoryColors, setSupercategoryColors] = useState({});
    const [hoveredItem, setHoveredItem] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    
    useEffect(() => {
        const fetchColors = async () => {
            const colors = await loadSupercategoryColors();
            setSupercategoryColors(colors);
        };
        fetchColors();
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    const handleInteraction = useCallback((event) => {
        const { clientX, clientY } = event.touches ? event.touches[0] : event;
        const tooltipWidth = 300; // Adjust based on your tooltip width
        const tooltipHeight = 200; // Adjust based on your tooltip height
    
        // Calculate new positions to keep the tooltip within the viewport
        const x = Math.min(clientX + 10, window.innerWidth - tooltipWidth);
        const y = Math.min(clientY + 10, window.innerHeight - tooltipHeight);
    
        setTooltipPosition({ x, y });
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
            const processedData = await getData(isMonthView, year, month, dataType, supercategoryColors, includeRisparmi);
            setData(processedData);
        };
        fetchData();
    }, [year, month, isMonthView, dataType, includeRisparmi]); // Add includeRisparmi to dependencies

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
            renderMonthView(chart, monthData, width, height, scalesRef, supercategoryColors, setHoveredItem, setTooltipPosition);
        } else {
            // Ensure data is in the correct format for year view
            const yearData = Array.isArray(data) ? { [year]: data } : data;
            renderYearView(chart, yearData, width, height, scalesRef, onViewChange, supercategoryColors, setHoveredItem, setTooltipPosition);
        }

        const interactionHandler = (event) => {
            handleInteraction(event);
            // Add logic here to update hoveredItem based on the interaction
            // This will depend on how you're currently setting hoveredItem in your chart
        };

        if (isTouchDevice) {
            svg.on('touchstart', interactionHandler);
            svg.on('touchmove', interactionHandler);
        } else {
            svg.on('mousemove', interactionHandler);
        }

        return () => {
            svg.on('touchstart', null);
            svg.on('touchmove', null);
            svg.on('mousemove', null);
        };
    }, [data, isMonthView, year, month, onViewChange, dimensions, isTouchDevice, handleInteraction]);

    const handleMouseMove = (event) => {
        setTooltipPosition({ x: event.clientX, y: event.clientY });
    };

    return (
        <div 
            className="bar-plot-container-div" 
            style={{ position: 'relative' }}
            onMouseMove={!isTouchDevice ? handleInteraction : undefined}
            onTouchStart={isTouchDevice ? handleInteraction : undefined}
            onTouchMove={isTouchDevice ? handleInteraction : undefined}
        >
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
            {hoveredItem && (
                <div 
                    className="tooltip-bar-plot" 
                    style={{ 
                        left: `${tooltipPosition.x + 10}px`, 
                        top: `${tooltipPosition.y + 10}px`, 
                        display: hoveredItem ? 'block' : 'none'
                    }}
                >
                    <p><strong>Category:</strong> {hoveredItem.category}</p>
                    <p><strong>Supercategory:</strong> {hoveredItem.supercategory}</p>
                    <p><strong>Category amount:</strong> €{hoveredItem.amount.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default ExpensePlot;
