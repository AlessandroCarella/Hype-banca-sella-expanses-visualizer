import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchDates = () => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await axios.get('/api/getMonthYearDates');
        setDates(response.data);
      } catch (error) {
        console.error("Error fetching dates:", error);
        // Optionally, set some default dates or show an error message
      }
    };

    fetchDates();
  }, []);

  return dates;
};

// ... existing code (if any) ...
