import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ExpensePlot = () => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [data, setData] = useState(null);
  const [isMonthView, setIsMonthView] = useState(false);
  const svgRef = useRef();

  // Mock data
  const mockYearlyData = [
    { month: 'Jan', food: 300, transport: 150, entertainment: 100 },
    { month: 'Feb', food: 280, transport: 160, entertainment: 90 },
    // ... add more months
  ];

  const mockMonthlyData = [
    { category: 'Food', amount: 300 },
    { category: 'Transport', amount: 150 },
    { category: 'Entertainment', amount: 100 },
  ];

  useEffect(() => {
    if (input1 && input2) {
      // Commented API call
      /*
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/expenses?param1=${input1}&param2=${input2}`);
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
      */

      // Using mock data instead
      setData(mockYearlyData);
    }
  }, [input1, input2]);

  useEffect(() => {
    if (data) {
      createPlot();
    }
  }, [data, isMonthView]);

  const createPlot = () => {
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    if (isMonthView) {
      createBarPlot(chart, width, height, margin);
    } else {
      createStackedBarPlot(chart, width, height, margin);
    }
  };

  const createStackedBarPlot = (chart, width, height, margin) => {
    const stack = d3.stack().keys(['food', 'transport', 'entertainment']);
    const series = stack(data);

    const x = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width - margin.left - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
      .range([height - margin.top - margin.bottom, 0]);

    const color = d3.scaleOrdinal()
      .domain(['food', 'transport', 'entertainment'])
      .range(['#98abc5', '#8a89a6', '#7b6888']);

    chart.append('g')
      .selectAll('g')
      .data(series)
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
          setIsMonthView(true);
          setData(mockMonthlyData);
        });

    chart.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x));

    chart.append('g')
      .call(d3.axisLeft(y));
  };

  const createBarPlot = (chart, width, height, margin) => {
    const x = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, width - margin.left - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.amount)])
      .range([height - margin.top - margin.bottom, 0]);

    chart.selectAll('.bar')
      .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.category))
        .attr('y', d => y(d.amount))
        .attr('width', x.bandwidth())
        .attr('height', d => height - margin.top - margin.bottom - y(d.amount))
        .attr('fill', '#69b3a2');

    chart.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x));

    chart.append('g')
      .call(d3.axisLeft(y));
  };

  return (
    <div>
      <input
        type="number"
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        placeholder="Enter first number"
      />
      <input
        type="number"
        value={input2}
        onChange={(e) => setInput2(e.target.value)}
        placeholder="Enter second number"
      />
      <svg ref={svgRef}></svg>
      {isMonthView && (
        <button onClick={() => {
          setIsMonthView(false);
          setData(mockYearlyData);
        }}>
          Back to Year View
        </button>
      )}
    </div>
  );
};

export default ExpensePlot;