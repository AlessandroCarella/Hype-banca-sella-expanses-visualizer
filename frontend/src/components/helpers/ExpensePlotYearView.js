import * as d3 from "d3";
import { generateShade } from './ExpensePlotHelpers';

export const renderYearView = (
    chart,
    data,
    width,
    height,
    scalesRef,
    onViewChange,
    supercategoryColors,
    setHoveredItem
) => {
    const months = Object.keys(data);
    if (!months.length || !Array.isArray(data[months[0]])) {
        return;
    }

    const supercategoryTotals = calculateSupercategoryTotals(data, months);
    const categories = sortCategories(data, months, supercategoryTotals);
    const stackData = prepareStackData(data, months, categories);
    const stackedData = createStack(categories, stackData);
    const { x, y } = createScales(months, stackedData, width, height);
    scalesRef.current = { x, y };

    renderBars(chart, stackedData, data, x, y, height, categories, supercategoryColors, setHoveredItem, onViewChange);
    renderAxes(chart, x, y, height);
};

function calculateSupercategoryTotals(data, months) {
    return months.reduce((acc, month) => {
        acc[month] = data[month].reduce((totals, item) => {
            if (!totals[item.supercategory]) totals[item.supercategory] = 0;
            totals[item.supercategory] += item.amount;
            return totals;
        }, {});
        return acc;
    }, {});
}

function sortCategories(data, months, supercategoryTotals) {
    return [...new Set(months.flatMap(month => data[month].map(item => item.category)))]
        .sort((a, b) => {
            const monthData = data[months[0]];
            const itemA = monthData.find(item => item.category === a);
            const itemB = monthData.find(item => item.category === b);
            if (!itemA || !itemB || !itemA.supercategory || !itemB.supercategory) {
                return a.localeCompare(b);
            }
            if (itemA.supercategory === itemB.supercategory) {
                return a.localeCompare(b);
            }
            return supercategoryTotals[months[0]][itemB.supercategory] - supercategoryTotals[months[0]][itemA.supercategory];
        });
}

function prepareStackData(data, months, categories) {
    return months.map(month => {
        const monthData = { month };
        categories.forEach(category => {
            const item = data[month].find(d => d.category === category);
            monthData[category] = item ? item.amount : 0;
        });
        return monthData;
    });
}

function createStack(categories, stackData) {
    const stack = d3.stack().keys(categories);
    return stack(stackData);
}

function createScales(months, stackedData, width, height) {
    const x = d3.scaleBand().range([0, width]).domain(months).padding(0.1);
    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]);
    return { x, y };
}

function renderBars(chart, stackedData, data, x, y, height, categories, supercategoryColors, setHoveredItem, onViewChange) {
    let isTransitioning = false;

    chart.selectAll("g.category")
        .data(stackedData)
        .join(
            enter => enterBars(enter, data, x, y, height, categories, supercategoryColors, setHoveredItem, onViewChange, chart),
            update => update,
            exit => exit.remove()
        )
        .transition()
        .duration(1000)
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]));
}

function enterBars(enter, data, x, y, height, categories, supercategoryColors, setHoveredItem, onViewChange, chart) {
    let isTransitioning = false;
    return enter.append("g")
        .attr("class", "category")
        .selectAll("rect")
        .data(d => d.map(v => ({ ...v, category: d.key })))
        .join("rect")
        .attr("x", d => x(d.data.month))
        .attr("y", height)
        .attr("height", 0)
        .attr("width", x.bandwidth())
        .attr("fill", d => getBarColor(d, data, categories, supercategoryColors))
        .on("mouseover", (event, d) => handleBarMouseOver(d, data, setHoveredItem))
        .on("mouseout", () => setHoveredItem(null))
        .on("click", (event, d) => handleBarClick(d, chart, height, onViewChange, isTransitioning))
        .on("touchstart", (event, d) => {
            event.preventDefault();
            handleBarMouseOver(d, data, setHoveredItem);
        })
        .on("touchend", (event) => {
            event.preventDefault();
            setHoveredItem(null);
        });
}

function getBarColor(d, data, categories, supercategoryColors) {
    const item = data[d.data.month].find(item => item.category === d.category);
    if (!item || !item.supercategory) {
        //console.warn(`Missing supercategory for category: ${d.category}`);
        return "#FF0000"; // Default color for items without supercategory
    }
    const supercategoryColor = supercategoryColors[item.supercategory];
    const supercategoryItems = categories.filter(cat => {
        const catItem = data[d.data.month].find(i => i.category === cat);
        return catItem && catItem.supercategory === item.supercategory;
    });
    const index = supercategoryItems.indexOf(item.category);
    return generateShade(supercategoryColor, index, supercategoryItems.length);
}

function handleBarMouseOver(d, data, setHoveredItem) {
    const item = data[d.data.month].find(item => item.category === d.category);
    if (item) {
        setHoveredItem({ ...item, month: d.data.month });
    }
}

function handleBarClick(d, chart, height, onViewChange, isTransitioning) {
    if (isTransitioning) return;
    isTransitioning = true;
    chart.selectAll("rect")
        .transition()
        .duration(500)
        .attr("y", height)
        .attr("height", 0)
        .on("end", (x, i, nodes) => {
            if (i === nodes.length - 1) {
                onViewChange(d.data.month, "month");
                isTransitioning = false;
            }
        });
}

function renderAxes(chart, x, y, height) {
    chart
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    chart.append("g").call(d3.axisLeft(y));
}