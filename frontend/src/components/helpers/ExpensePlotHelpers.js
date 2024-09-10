import * as d3 from "d3";

export const generateShade = (baseColor, index, total) => {
    if (!baseColor) {
        console.warn(`Missing color for supercategory. Using default.`);
        return "#FF0000"; // Return a default color
    }
    const color = d3.color(baseColor);
    if (!color) {
        console.warn(`Invalid color: ${baseColor}. Using default.`);
        return "#FF0000"; // Return a default color
    }
    const lightenFactor = 0.1 + (index / total) * 1;
    return color.brighter(lightenFactor);
};

export const loadSupercategoryColors = async () => {
    const response = await fetch("/api/get-supercategory-colors");
    const data = await response.json();
    return data;
};

// Add renderMonthView and renderYearView functions here
export const renderMonthView = (
    chart,
    data,
    width,
    height,
    scalesRef,
    supercategoryColors,
    setHoveredItem
) => {
    const chartData = [...data].sort((a, b) => b.amount - a.amount);

    const x = d3.scaleBand()
        .range([0, width])
        .domain(chartData.map((d) => d.category))
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(chartData, (d) => d.amount)]);

    scalesRef.current = { x, y };

    chart.selectAll(".bar")
        .data(chartData)
        .join(
            (enter) => enter.append("rect")
                .attr("class", "bar")
                .attr("x", (d) => x(d.category))
                .attr("width", x.bandwidth())
                .attr("y", height)
                .attr("height", 0)
                .on("mouseover", (event, item) => {
                    setHoveredItem(item);
                })
                .on("mouseout", (event) => {
                    setHoveredItem(null);
                })
                .attr("fill", (item) => {
                    const supercategoryColor = supercategoryColors[item.supercategory];
                    const supercategoryItems = chartData.filter(
                        (d) => d.supercategory === item.supercategory
                    );
                    const index = supercategoryItems.findIndex(
                        (d) => d.category === item.category
                    );
                    return generateShade(
                        supercategoryColor,
                        index,
                        supercategoryItems.length
                    );
                }),
            (update) => update,
            (exit) => exit.remove()
        )
        .transition()
        .duration(1000)
        .attr("y", (d) => y(d.amount) || 0)
        .attr("height", (d) => height - y(d.amount) || 0);

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

    const sortedCategories = data[months[0]]
        .sort((a, b) => a.supercategory.localeCompare(b.supercategory) || a.category.localeCompare(b.category))
        .map((item) => item.category);

    const stack = d3.stack()
        .keys(sortedCategories)
        .value((d, key) => d.find((item) => item.category === key)?.amount || 0);

    const sortedData = Object.fromEntries(
        Object.entries(data).map(([month, monthData]) => [
            month,
            monthData.sort((a, b) => a.supercategory.localeCompare(b.supercategory) || a.category.localeCompare(b.category))
        ])
    );

    const stackedData = stack(Object.values(sortedData));

    const x = d3.scaleBand().range([0, width]).domain(months).padding(0.1);
    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(stackedData[stackedData.length - 1], (d) => d[1])]);

    scalesRef.current = { x, y };

    const color = d3.scaleOrdinal()
        .domain(sortedCategories)
        .range(sortedData[months[0]].map((item) => {
            const supercategoryItems = sortedData[months[0]].filter(
                (d) => d.supercategory === item.supercategory
            );
            const index = supercategoryItems.findIndex(
                (d) => d.category === item.category
            );
            return generateShade(
                supercategoryColors[item.supercategory],
                index,
                supercategoryItems.length
            );
        }));

    let isTransitioning = false;

    chart.selectAll("g.category")
        .data(stackedData)
        .join(
            (enter) => enter.append("g")
                .attr("class", "category")
                .attr("fill", (d) => color(d.key))
                .selectAll("rect")
                .data((d) => d.map((v, i) => ({
                    ...v,
                    month: months[i],
                    category: d.key,
                    supercategory: sortedData[months[i]].find(item => item.category === d.key)?.supercategory,
                    amount: sortedData[months[i]].find(item => item.category === d.key)?.amount
                })))
                .join("rect")
                .attr("x", (d) => x(d.month))
                .attr("y", height)
                .attr("height", 0)
                .attr("width", x.bandwidth())
                .attr("data-month", (d) => d.month)
                .attr("data-category", (d) => d.category)
                .attr("data-supercategory", (d) => d.supercategory)
                .on("mouseover", (event, item) => {
                    setHoveredItem(item);
                })
                .on("mouseout", (event) => {
                    setHoveredItem(null);
                })
                .on("click", (event, d) => {
                    if (isTransitioning) return;
                    isTransitioning = true;

                    chart.selectAll("rect")
                        .transition()
                        .duration(500)
                        .attr("y", height)
                        .attr("height", 0)
                        .on("end", (x, i, nodes) => {
                            if (i === nodes.length - 1) {
                                onViewChange(d.month, "month");
                                isTransitioning = false;
                            }
                        });
                }),
            (update) => update,
            (exit) => exit.remove()
        )
        .transition()
        .duration(1000)
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => y(d[0]) - y(d[1]));

    chart
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    chart.append("g").call(d3.axisLeft(y));
};
