import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchYears = () => {
    const [dates, setDates] = useState([]);

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const response = await axios.get("/api/get-years");
                setDates(response.data);
            } catch (error) {
                console.error("Error fetching dates:", error);
            }
        };

        fetchDates();
    }, []);

    return [dates, setDates]; // Return both the state and the setter
};

export const fetchMonths = async (year) => {
    try {
        const endpoint = year ? "/api/get-months" : "/api/get-years";
        const params = year ? { year } : {};
        const response = await axios.get(endpoint, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching dates:", error);
        return [];
    }
};
