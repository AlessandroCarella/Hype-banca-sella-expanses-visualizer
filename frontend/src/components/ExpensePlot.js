import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

const ExpensePlot = ({ selectedDate, onViewChange, isMonthView }) => {
    const svgRef = useRef();
    const [data, setData] = useState(null);

    const generateShade = (baseColor, index, total) => {
        const color = d3.color(baseColor);
        const lightenFactor = 0.1 + (index / total) * 1;
        return color.brighter(lightenFactor);
    };

    // Assign colors to supercategories
    const supercategoryColors = {
        "Living Expenses": "#FF6384",
        Transportation: "#36A2EB",
        Personal: "#FFCE56",
        "Health & Education": "#A020F0",
    };

    useEffect(() => {
        const mockData = isMonthView        
        ? [
          { supercategory: 'Living Expenses', category: 'Food', amount: 300 },
          { supercategory: 'Living Expenses', category: 'Utilities', amount: 100 },
          { supercategory: 'Transportation', category: 'Public Transit', amount: 80 },
          { supercategory: 'Transportation', category: 'Car Expenses', amount: 70 },
          { supercategory: 'Personal', category: 'Entertainment', amount: 200 },
          { supercategory: 'Personal', category: 'Shopping', amount: 250 },
          { supercategory: 'Health & Education', category: 'Healthcare', amount: 80 },
          { supercategory: 'Health & Education', category: 'Education', amount: 120 },
        ]
      : {
          Jan: [
            { supercategory: 'Living Expenses', category: 'Food', amount: 300 },
            { supercategory: 'Living Expenses', category: 'Utilities', amount: 100 },
            { supercategory: 'Transportation', category: 'Public Transit', amount: 80 },
            { supercategory: 'Transportation', category: 'Car Expenses', amount: 70 },
            { supercategory: 'Personal', category: 'Entertainment', amount: 200 },
            { supercategory: 'Personal', category: 'Shopping', amount: 250 },
            { supercategory: 'Health & Education', category: 'Healthcare', amount: 80 },
            { supercategory: 'Health & Education', category: 'Education', amount: 120 },
          ],
          Feb: [
            { supercategory: 'Living Expenses', category: 'Food', amount: 280 },
            { supercategory: 'Living Expenses', category: 'Utilities', amount: 110 },
            { supercategory: 'Transportation', category: 'Public Transit', amount: 90 },
            { supercategory: 'Transportation', category: 'Car Expenses', amount: 60 },
            { supercategory: 'Personal', category: 'Entertainment', amount: 180 },
            { supercategory: 'Personal', category: 'Shopping', amount: 200 },
            { supercategory: 'Health & Education', category: 'Healthcare', amount: 90 },
            { supercategory: 'Health & Education', category: 'Education', amount: 130 },
          ],
          Mar: [
            { supercategory: 'Living Expenses', category: 'Food', amount: 320 },
            { supercategory: 'Living Expenses', category: 'Utilities', amount: 95 },
            { supercategory: 'Transportation', category: 'Public Transit', amount: 70 },
            { supercategory: 'Transportation', category: 'Car Expenses', amount: 80 },
            { supercategory: 'Personal', category: 'Entertainment', amount: 220 },
            { supercategory: 'Personal', category: 'Shopping', amount: 280 },
            { supercategory: 'Health & Education', category: 'Healthcare', amount: 70 },
            { supercategory: 'Health & Education', category: 'Education', amount: 110 },
          ],
          Apr: [
            { supercategory: 'Living Expenses', category: 'Food', amount: 290 },
            { supercategory: 'Living Expenses', category: 'Utilities', amount: 105 },
            { supercategory: 'Transportation', category: 'Public Transit', amount: 85 },
            { supercategory: 'Transportation', category: 'Car Expenses', amount: 75 },
            { supercategory: 'Personal', category: 'Entertainment', amount: 190 },
            { supercategory: 'Personal', category: 'Shopping', amount: 230 },
            { supercategory: 'Health & Education', category: 'Healthcare', amount: 85 },
            { supercategory: 'Health & Education', category: 'Education', amount: 125 },
          ],
          May: [
            { supercategory: 'Living Expenses', category: 'Food', amount: 310 },
            { supercategory: 'Living Expenses', category: 'Utilities', amount: 98 },
            { supercategory: 'Transportation', category: 'Public Transit', amount: 75 },
            { supercategory: 'Transportation', category: 'Car Expenses', amount: 85 },
            { supercategory: 'Personal', category: 'Entertainment', amount: 210 },
            { supercategory: 'Personal', category: 'Shopping', amount: 260 },
            { supercategory: 'Health & Education', category: 'Healthcare', amount: 75 },
            { supercategory: 'Health & Education', category: 'Education', amount: 115 },
          ],
          Jun: [
            { supercategory: 'Living Expenses', category: 'Food', amount: 305 },
            { supercategory: 'Living Expenses', category: 'Utilities', amount: 102 },
            { supercategory: 'Transportation', category: 'Public Transit', amount: 88 },
            { supercategory: 'Transportation', category: 'Car Expenses', amount: 78 },
            { supercategory: 'Personal', category: 'Entertainment', amount: 195 },
            { supercategory: 'Personal', category: 'Shopping', amount: 240 },
            { supercategory: 'Health & Education', category: 'Healthcare', amount: 88 },
            { supercategory: 'Health & Education', category: 'Education', amount: 118 },
          ],
        };

        // Add color information to the data
        const processedData = isMonthView
            ? mockData.map((item) => ({
                  ...item,
                  color: supercategoryColors[item.supercategory],
              }))
            : Object.fromEntries(
                  Object.entries(mockData).map(([month, items]) => [
                      month,
                      items.map((item) => ({
                          ...item,
                          color: supercategoryColors[item.supercategory],
                      })),
                  ])
              );

        setData(processedData);
    }, [selectedDate, isMonthView]);

    const renderMonthView = (chart, data, width, height) => {
        // Ensure data is an array
        const chartData = Array.isArray(data)
            ? data
            : data[Object.keys(data)[0]];

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

        const supercategories = [
            ...new Set(chartData.map((d) => d.supercategory)),
        ];
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
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.category))
            .attr("width", x.bandwidth())
            .attr("y", (d) => y(d.amount) || 0)
            .attr("height", (d) => height - y(d.amount) || 0)
            .attr("fill", (d, i) => {
                const supercategoryItems = chartData.filter(
                    (item) => item.supercategory === d.supercategory
                );
                const index = supercategoryItems.findIndex(
                    (item) => item.category === d.category
                );
                return generateShade(d.color, index, supercategoryItems.length);
            });

        chart
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        chart.append("g").call(d3.axisLeft(y));
    };

    const renderYearView = (chart, data, width, height) => {
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
            .domain([
                0,
                d3.max(stackedData[stackedData.length - 1], (d) => d[1]),
            ]);

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

        chart
            .selectAll("g")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("fill", (d) => color(d.key))
            .selectAll("rect")
            .data((d) => d.map((v, i) => ({...v, month: months[i]}))) // Add month to each data point
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.month))
            .attr("y", (d) => y(d[1]))
            .attr("height", (d) => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .attr("data-month", (d) => d.month) // Store month as a data attribute
            .on("click", (event, d) => {
                console.log("Clicked month:", d.month);
                const monthYear = d.month;
                console.log("Selected date from graph:", monthYear);
                onViewChange(true, monthYear);
            });

        chart
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        chart.append("g").call(d3.axisLeft(y));
    };

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

        if (isMonthView) {
            renderMonthView(chart, data, width, height);
        } else {
            renderYearView(chart, data, width, height);
        }
    }, [data, isMonthView, selectedDate, onViewChange]);

    return <svg ref={svgRef}></svg>;
};

export default ExpensePlot;
