import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import {
    generateShade,
    renderMonthView,
    renderYearView,
    loadSupercategoryColors,
} from "./helpers/ExpensePlotHelpers";
import { getData } from "./helpers/getDataExpensePlot";

const ExpensePlot = ({
    year,
    month,
    onViewChange,
    isMonthView,
    includeRisparmi,
}) => {
    const svgRef = useRef();
    const containerRef = useRef();
    const [data, setData] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const scalesRef = useRef({ x: null, y: null });
    const minWidth = 600; // Set your desired minimum width here
    const maxWidth = 1500;
    const maxHeight = 700;
    const [dataType, setDataType] = useState("Expenditure"); // New state for data type
    const [supercategoryColors, setSupercategoryColors] = useState({});
    const [hoveredItem, setHoveredItem] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        item: null,
    });
    const [selectedExpenses, setSelectedExpenses] = useState([]); // New state for selected expenses
    const [expandedExpenses, setExpandedExpenses] = useState([]); // New state for expanded expenses

    useEffect(() => {
        const fetchColors = async () => {
            const colors = await loadSupercategoryColors();
            setSupercategoryColors(colors);
        };
        fetchColors();
        setIsTouchDevice(
            "ontouchstart" in window || navigator.maxTouchPoints > 0
        );
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
        const minWidth = 700;
        const maxWidth = 1700;

        if (width <= minWidth) return maxAspectRatio;
        if (width >= maxWidth) return minAspectRatio;

        // Linear interpolation between min and max aspect ratios
        const ratio = (width - minWidth) / (maxWidth - minWidth);
        return maxAspectRatio - ratio * (maxAspectRatio - minAspectRatio);
    };

    useEffect(() => {
        const fetchData = async () => {
            const processedData = await getData(
                isMonthView,
                year,
                month,
                dataType,
                supercategoryColors,
                includeRisparmi
            );
            setData(processedData);
        };
        fetchData();
    }, [year, month, isMonthView, dataType, includeRisparmi]); // Add includeRisparmi to dependencies

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            if (!entries || !entries.length) return;
            let { width } = entries[0].contentRect;
            width = Math.max(width, minWidth);
            width = Math.min(width, maxWidth);
            const aspectRatio = getAspectRatio(width);
            let height = width * aspectRatio;
            height = Math.min(height, maxHeight);
            setDimensions({ width: width, height });
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
            left: 60, // Slightly increase left margin for y-axis labels
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
            renderMonthView(
                chart,
                monthData,
                width,
                height,
                scalesRef,
                supercategoryColors,
                setHoveredItem,
                setContextMenu,
                handleBarClick
            );
        } else {
            // Ensure data is in the correct format for year view
            const yearData = Array.isArray(data) ? { [year]: data } : data;
            renderYearView(
                chart,
                yearData,
                width,
                height,
                scalesRef,
                onViewChange,
                supercategoryColors,
                setHoveredItem,
                setTooltipPosition
            );
        }

        const interactionHandler = (event) => {
            handleInteraction(event);
            // Add logic here to update hoveredItem based on the interaction
            // This will depend on how you're currently setting hoveredItem in your chart
        };

        if (isTouchDevice) {
            svg.on("touchstart", interactionHandler);
            svg.on("touchmove", interactionHandler);
        } else {
            svg.on("mousemove", interactionHandler);
        }

        return () => {
            svg.on("touchstart", null);
            svg.on("touchmove", null);
            svg.on("mousemove", null);
        };
    }, [
        data,
        isMonthView,
        year,
        month,
        onViewChange,
        dimensions,
        isTouchDevice,
        handleInteraction,
    ]);

    const handleMouseMove = (event) => {
        setTooltipPosition({ x: event.clientX, y: event.clientY });
    };

    useEffect(() => {
        const handleClickOutside = () => {
            setContextMenu({ ...contextMenu, visible: false });
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [contextMenu]);

    const fetchExpandedExpenses = async (category) => {
        const response = await fetch(
            `/api/getExpansesListForMonthYearAndCategory?year=${year}&month=${month}&category=${category}&expenditure-or-revenue=${dataType}&include-risparmi=${includeRisparmi}`
        );
        const data = await response.json();
        setExpandedExpenses(data);
    };

    const handleBarClick = (expenses) => {
        setSelectedExpenses(expenses); // Set the selected expenses when a bar is clicked
        if (expenses.length > 0) {
            fetchExpandedExpenses(expenses[0].category); // Fetch expenses for the first selected category
        }
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <div
                    className="bar-plot-container-div"
                    style={{
                        position: "relative",
                        maxWidth: `${maxWidth}px`,
                        width: "100%",
                    }}
                    onMouseMove={!isTouchDevice ? handleInteraction : undefined}
                    onTouchStart={isTouchDevice ? handleInteraction : undefined}
                    onTouchMove={isTouchDevice ? handleInteraction : undefined}
                >
                    <div
                        ref={containerRef}
                        style={{ width: "100%", minWidth: `${minWidth}px` }}
                    >
                        <svg
                            ref={svgRef}
                            width={dimensions.width}
                            height={dimensions.height}
                        ></svg>
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
                                display: hoveredItem ? "block" : "none",
                            }}
                        >
                            <p>
                                <strong>Category:</strong>{" "}
                                {hoveredItem.category}
                            </p>
                            <p>
                                <strong>Supercategory:</strong>{" "}
                                {hoveredItem.supercategory}
                            </p>
                            <p>
                                <strong>Category amount:</strong> €
                                {hoveredItem.amount.toFixed(2)}
                            </p>
                        </div>
                    )}
                    {contextMenu.visible && (
                        <div
                            className="context-menu"
                            style={{
                                position: "absolute",
                                left: contextMenu.x,
                                top: contextMenu.y,
                            }}
                        >
                            <p>ciao</p>
                        </div>
                    )}
                </div>
            </div>
            {isMonthView && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <div
                        className="selected-expenses-print"
                        style={{ width: `${dimensions.width *80/100}px` }} // Match width to bar plot container
                    >
                        <h4>Expanses in the select bar:</h4>
                        <ul>
                            {expandedExpenses.map((exp, idx) => (
                                <li key={idx}>
                                    {exp.nome}: €
                                    {Math.abs(
                                        parseFloat(exp.importo)
                                    ).toString()}{" "}
                                    - Descrizione: {exp.descrizione}{" "}
                                    {exp.tipologia !== "Pagamento" && (
                                        <> ({exp.tipologia}), </>
                                    )}
                                    effettuata il giorno {exp.dataOperazione}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpensePlot;
