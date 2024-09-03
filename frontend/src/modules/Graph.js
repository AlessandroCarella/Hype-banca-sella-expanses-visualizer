import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as d3 from 'd3';
import DatesCarousel from '../components/DatesCarousel'; // Import the DatesCarousel component

function Graphs() {
    const mockDates = [
        '2023-01-15',
        '2023-02-28',
        '2023-03-10',
        '2023-04-22',
        '2023-05-05',
        '2023-06-18',
        '2023-07-30'
    ];

    const location = useLocation();
    const processedData = location.state?.processedData;

    // Extract dates from processedData
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (processedData) {
            // Assuming processedData is an array of objects with a 'date' property
            // const extractedDates = processedData.map(item => item.date);
            // setDates(extractedDates);
            setDates(mockDates);
        }
    }, [processedData]);

    useEffect(() => {
        if (dates.length > 0) {
            setSelectedDate(dates[dates.length - 1]);
        }
    }, [dates]);

    useEffect(() => {
        if (selectedDate) {
            console.log("Selected date:", selectedDate);
        }
    }, [selectedDate]);

    return (
        <div>
            <DatesCarousel 
                dates={dates} 
                onDateSelect={setSelectedDate} 
                selectedDate={selectedDate} 
            />
            {/* Add your graph components here */}
            <pre>{JSON.stringify(processedData, null, 2)}</pre>
        </div>
    );
}

export default Graphs;