import * as d3 from "d3";
import { generateShade } from "./ExpensePlotHelpers";

const createScales = (chartData, width, height) => {
    const x = d3
        .scaleBand()
        .range([0, width])
        .domain(chartData.map((d) => d.category))
        .padding(0.1);

    const y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(chartData, (d) => d.amount)]);

    return { x, y };
};

const renderBars = (
    chart,
    chartData,
    x,
    y,
    height,
    supercategoryColors,
    setHoveredItem,
    setContextMenu // New parameter for context menu state
) => {
    const minBarHeight = 10; // Define the minimum bar height

    chart
        .selectAll(".bar")
        .data(chartData)
        .join(
            (enter) =>
                enter
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", (d) => x(d.category))
                    .attr("width", x.bandwidth())
                    .attr("y", height)
                    .attr("height", 0)
                    .on("mouseover", (event, item) => setHoveredItem(item))
                    .on("mouseout", () => setHoveredItem(null))
                    .on("contextmenu", (event, item) => {
                        event.preventDefault(); // Prevent default context menu
                        setHoveredItem(null); // Hide tooltip
                        console.log(item); // Log the item to the console
                        setContextMenu({ visible: true, x: event.pageX, y: event.pageY, item });
                    })
                    .attr("fill", (item) =>
                        calculateBarColor(item, chartData, supercategoryColors)
                    ),
            (update) => update,
            (exit) => exit.remove()
        )
        .transition()
        .duration(1000)
        .attr("y", (d) => {
            const barHeight = height - y(d.amount);
            if (isNaN(barHeight)) {
                //console.error("Invalid bar height for amount:", d.amount);
                return height; // Fallback to default position
            }
            return barHeight < minBarHeight ? height - minBarHeight : y(d.amount);
        })
        .attr("height", (d) => {
            const barHeight = height - y(d.amount);
            if (isNaN(barHeight)) {
                //console.error("Invalid bar height for amount:", d.amount);
                return minBarHeight; // Fallback to minimum height
            }
            return barHeight < minBarHeight ? minBarHeight : barHeight;
        });
};

const calculateBarColor = (item, chartData, supercategoryColors) => {
    const supercategoryColor = supercategoryColors[item.supercategory];
    const supercategoryItems = chartData.filter(
        (d) => d.supercategory === item.supercategory
    );
    const index = supercategoryItems.findIndex(
        (d) => d.category === item.category
    );
    return generateShade(supercategoryColor, index, supercategoryItems.length);
};

const renderAxes = (chart, x, y, height) => {
    chart
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    chart.append("g").call(d3.axisLeft(y));
};

export const renderMonthView = (
    chart,
    data,
    width,
    height,
    scalesRef,
    supercategoryColors,
    setHoveredItem,
    setContextMenu
) => {
    // Aggregate data by category and supercategory
    const aggregatedData = data.reduce((acc, curr) => {
        const key = `${curr.category}-${curr.supercategory}`;
        if (!acc[key]) {
            acc[key] = { ...curr };
        } else {
            acc[key].amount += curr.amount; // Sum amounts for the same category and supercategory
        }
        return acc;
    }, {});

    const chartData = Object.values(aggregatedData).sort((a, b) => b.amount - a.amount);
    const { x, y } = createScales(chartData, width, height);
    scalesRef.current = { x, y };

    renderBars(
        chart,
        chartData,
        x,
        y,
        height,
        supercategoryColors,
        setHoveredItem,
        setContextMenu // New parameter for context menu state
    );
    renderAxes(chart, x, y, height);
};
