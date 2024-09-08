import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const ExpensePlot = ({ selectedDate, isMonthView, onViewChange }) => {
  const svgRef = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data based on selectedDate
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get('/api/get-expense-data', {
    //       params: { date: selectedDate, isMonthView }
    //     });
    //     setData(response.data);
    //   } catch (error) {
    //     console.error("Error fetching expense data:", error);
    //   }
    // };
    // fetchData();

    // Mock data for now
    const mockData = isMonthView
      ? [
          { category: 'Food', amount: 300 },
          { category: 'Transport', amount: 150 },
          { category: 'Entertainment', amount: 200 },
          { category: 'Utilities', amount: 100 },
        ]
      : [
          { month: 'Jan', Food: 300, Transport: 150, Entertainment: 200, Utilities: 100 },
          { month: 'Feb', Food: 280, Transport: 160, Entertainment: 180, Utilities: 110 },
          { month: 'Mar', Food: 320, Transport: 140, Entertainment: 220, Utilities: 90 },
          // ... more months
        ];
    setData(mockData);
  }, [selectedDate, isMonthView]);

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const chart = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    if (isMonthView) {
      // Bar plot for month view
      const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.category))
        .padding(0.1);

      const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, d => d.amount)]);

      chart.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.category))
        .attr('width', x.bandwidth())
        .attr('y', d => y(d.amount))
        .attr('height', d => height - y(d.amount))
        .attr('fill', 'steelblue');

      chart.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      chart.append('g')
        .call(d3.axisLeft(y));

    } else {
      // Stacked bar plot for year view
      const categories = Object.keys(data[0]).filter(key => key !== 'month');
      const stack = d3.stack().keys(categories);
      const stackedData = stack(data);

      const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.month))
        .padding(0.1);

      const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]);

      const color = d3.scaleOrdinal()
        .domain(categories)
        .range(d3.schemeCategory10);

      chart.selectAll('g')
        .data(stackedData)
        .enter().append('g')
          .attr('fill', d => color(d.key))
        .selectAll('rect')
        .data(d => d)
        .enter().append('rect')
          .attr('x', d => x(d.data.month))
          .attr('y', d => y(d[1]))
          .attr('height', d => y(d[0]) - y(d[1]))
          .attr('width', x.bandwidth())
          .on('click', (event, d) => {
            const clickedMonth = d.data.month;
            const clickedYear = selectedDate;
            onViewChange(true, clickedYear, clickedMonth);
          });

      chart.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      chart.append('g')
        .call(d3.axisLeft(y));
    }
  }, [data, isMonthView, selectedDate, onViewChange]);

  return <svg ref={svgRef}></svg>;
};

export default ExpensePlot;