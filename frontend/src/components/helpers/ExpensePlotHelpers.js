import * as d3 from "d3";

export const generateShade = (baseColor, index, total) => {
    const color = d3.color(baseColor);
    const lightenFactor = 0.1 + (index / total) * 1;
    return color.brighter(lightenFactor);
};

export const supercategoryColors = {
    "Living Expenses": "#FF6384",
    Transportation: "#36A2EB",
    Personal: "#FFCE56",
    "Health & Education": "#A020F0",
};

// Add renderMonthView and renderYearView functions here
export const renderMonthView = (chart, data, width, height, scalesRef) => {
    // Ensure data is an array
    const chartData = Array.isArray(data) ? data : data[Object.keys(data)[0]];

    // Sort the chartData from highest to lowest amount
    chartData.sort((a, b) => b.amount - a.amount);

    const x = d3
        .scaleBand()
        .range([0, width])
        .domain(chartData.map((d) => d.category))
        .padding(0.1);

    const y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(chartData, (d) => d.amount)]);

    scalesRef.current = { x, y };

    const supercategories = [...new Set(chartData.map((d) => d.supercategory))];
    const colorScale = d3
        .scaleOrdinal()
        .domain(supercategories)
        .range(
            supercategories.map(
                (sc) => chartData.find((d) => d.supercategory === sc).color
            )
        );

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
                    .attr("fill", (d, i) => {
                        const supercategoryItems = chartData.filter(
                            (item) => item.supercategory === d.supercategory
                        );
                        const index = supercategoryItems.findIndex(
                            (item) => item.category === d.category
                        );
                        return generateShade(
                            d.color,
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

export const renderYearView = (chart, data, width, height, scalesRef, onViewChange) => {
    const months = Object.keys(data);
    const categories = data[months[0]].map((item) => item.category);

    const stack = d3
        .stack()
        .keys(categories)
        .value(
            (d, key) => d.find((item) => item.category === key)?.amount || 0
        );

    const stackedData = stack(Object.values(data));

    const x = d3.scaleBand().range([0, width]).domain(months).padding(0.1);

    const y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(stackedData[stackedData.length - 1], (d) => d[1])]);

    scalesRef.current = { x, y };

    const color = d3
        .scaleOrdinal()
        .domain(categories)
        .range(
            data[months[0]].map((item) => {
                const supercategoryItems = data[months[0]].filter(
                    (d) => d.supercategory === item.supercategory
                );
                const index = supercategoryItems.findIndex(
                    (d) => d.category === item.category
                );
                return generateShade(
                    item.color,
                    index,
                    supercategoryItems.length
                );
            })
        );

    let isTransitioning = false;

    chart
        .selectAll("g.category")
        .data(stackedData)
        .join(
            (enter) =>
                enter
                    .append("g")
                    .attr("class", "category")
                    .attr("fill", (d) => color(d.key))
                    .selectAll("rect")
                    .data((d) => d.map((v, i) => ({ ...v, month: months[i], category: d.key })))
                    .join("rect")
                    .attr("x", (d) => x(d.month))
                    .attr("y", height)
                    .attr("height", 0)
                    .attr("width", x.bandwidth())
                    .attr("data-month", (d) => d.month)
                    .attr("data-category", (d) => d.category)
                    .on("click", (event, d) => {
                        if (isTransitioning) return;
                        isTransitioning = true;

                        console.log("Clicked month:", d.month);
                        console.log("Clicked category:", d.category);

                        // Add exit animation for all bars
                        chart
                            .selectAll("rect")
                            .transition()
                            .duration(500)
                            .attr("y", height)
                            .attr("height", 0)
                            .on("end", (d, i, nodes) => {
                                if (i === nodes.length - 1) {
                                    onViewChange(true, d.month);
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
