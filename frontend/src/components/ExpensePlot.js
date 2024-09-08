import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

const ExpensePlot = ({ selectedDate, isMonthView, onViewChange }) => {
    const svgRef = useRef();
    const [data, setData] = useState(null);

    useEffect(() => {
        console.log("Selected date:", selectedDate);
        console.log("Is month view:", isMonthView);

        // Mock data with colors
        const mockData = isMonthView
        ? [
            { category: 'Food', amount: 300, color: '#FF6384' },
            { category: 'Transport', amount: 150, color: '#36A2EB' },
            { category: 'Entertainment', amount: 200, color: '#FFCE56' },
            { category: 'Utilities', amount: 100, color: '#4BC0C0' },
            { category: 'Shopping', amount: 250, color: '#9966FF' },
            { category: 'Healthcare', amount: 80, color: '#FF9F40' },
            { category: 'Education', amount: 120, color: '#4D5360' },
          ]
        : {
            Jan: [
              { category: 'Food', amount: 300, color: '#FF6384' },
              { category: 'Transport', amount: 150, color: '#36A2EB' },
              { category: 'Entertainment', amount: 200, color: '#FFCE56' },
              { category: 'Utilities', amount: 100, color: '#4BC0C0' },
              { category: 'Shopping', amount: 250, color: '#9966FF' },
              { category: 'Healthcare', amount: 80, color: '#FF9F40' },
              { category: 'Education', amount: 120, color: '#4D5360' },
            ],
            Feb: [
              { category: 'Food', amount: 280, color: '#FF6384' },
              { category: 'Transport', amount: 160, color: '#36A2EB' },
              { category: 'Entertainment', amount: 180, color: '#FFCE56' },
              { category: 'Utilities', amount: 110, color: '#4BC0C0' },
              { category: 'Shopping', amount: 200, color: '#9966FF' },
              { category: 'Healthcare', amount: 90, color: '#FF9F40' },
              { category: 'Education', amount: 130, color: '#4D5360' },
            ],
            Mar: [
              { category: 'Food', amount: 320, color: '#FF6384' },
              { category: 'Transport', amount: 140, color: '#36A2EB' },
              { category: 'Entertainment', amount: 220, color: '#FFCE56' },
              { category: 'Utilities', amount: 95, color: '#4BC0C0' },
              { category: 'Shopping', amount: 280, color: '#9966FF' },
              { category: 'Healthcare', amount: 70, color: '#FF9F40' },
              { category: 'Education', amount: 110, color: '#4D5360' },
            ],
            Apr: [
              { category: 'Food', amount: 290, color: '#FF6384' },
              { category: 'Transport', amount: 170, color: '#36A2EB' },
              { category: 'Entertainment', amount: 190, color: '#FFCE56' },
              { category: 'Utilities', amount: 105, color: '#4BC0C0' },
              { category: 'Shopping', amount: 230, color: '#9966FF' },
              { category: 'Healthcare', amount: 85, color: '#FF9F40' },
              { category: 'Education', amount: 125, color: '#4D5360' },
            ],
            May: [
              { category: 'Food', amount: 310, color: '#FF6384' },
              { category: 'Transport', amount: 155, color: '#36A2EB' },
              { category: 'Entertainment', amount: 210, color: '#FFCE56' },
              { category: 'Utilities', amount: 98, color: '#4BC0C0' },
              { category: 'Shopping', amount: 260, color: '#9966FF' },
              { category: 'Healthcare', amount: 75, color: '#FF9F40' },
              { category: 'Education', amount: 115, color: '#4D5360' },
            ],
            Jun: [
              { category: 'Food', amount: 305, color: '#FF6384' },
              { category: 'Transport', amount: 165, color: '#36A2EB' },
              { category: 'Entertainment', amount: 195, color: '#FFCE56' },
              { category: 'Utilities', amount: 102, color: '#4BC0C0' },
              { category: 'Shopping', amount: 240, color: '#9966FF' },
              { category: 'Healthcare', amount: 88, color: '#FF9F40' },
              { category: 'Education', amount: 118, color: '#4D5360' },
            ],
          };
        setData(mockData);
    }, [selectedDate, isMonthView]);

    const renderMonthView = (chart, data, width, height) => {
        // Ensure data is an array
        const chartData = Array.isArray(data) ? data : data[Object.keys(data)[0]];

        const x = d3.scaleBand()
            .range([0, width])
            .domain(chartData.map((d) => d.category))
            .padding(0.1);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(chartData, (d) => d.amount)]);

        chart.selectAll(".bar")
            .data(chartData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.category))
            .attr("width", x.bandwidth())
            .attr("y", (d) => y(d.amount) || 0)
            .attr("height", (d) => height - y(d.amount) || 0)
            .attr("fill", (d) => d.color);

        chart.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        chart.append("g").call(d3.axisLeft(y));
    };

    const renderYearView = (chart, data, width, height) => {
        const months = Object.keys(data);
        const categories = data[months[0]].map(item => item.category);
        
        const stack = d3.stack()
            .keys(categories)
            .value((d, key) => d.find(item => item.category === key)?.amount || 0);

        const stackedData = stack(Object.values(data));

        const x = d3.scaleBand()
            .range([0, width])
            .domain(months)
            .padding(0.1);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(stackedData[stackedData.length - 1], (d) => d[1])]);

        const color = d3.scaleOrdinal()
            .domain(categories)
            .range(data[months[0]].map(item => item.color));

        chart.selectAll("g")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("fill", (d) => color(d.key))
            .selectAll("rect")
            .data((d) => d)
            .enter()
            .append("rect")
            .attr("x", (d, i) => x(months[i]))
            .attr("y", (d) => y(d[1]))
            .attr("height", (d) => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .on("click", (event, d) => {
                const clickedMonth = months[d.index];
                const monthYear = `${clickedMonth} ${selectedDate}`;
                onViewChange(true, selectedDate, monthYear);
            });

        chart.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        chart.append("g").call(d3.axisLeft(y));
    };

    useEffect(() => {
        if (!data) return;

        console.log("Rendering chart with data:", data);

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
