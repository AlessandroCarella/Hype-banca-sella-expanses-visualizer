import { useState, useEffect, useCallback } from "react"; // Import useCallback
import axios from "axios";

export const useFetchYears = () => {
    const [years, setYears] = useState([]);

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await axios.get("/api/get-years");
                setYears(response.data);
            } catch (error) {
                console.error("Error fetching years:", error);
            }
        };

        fetchYears();
    }, []);

    return [years, setYears];
};

export const useFetchMonths = (year) => {
    const [months, setMonths] = useState([]);

    const fetchMonths = useCallback(async () => {
        try {
            const response = await axios.get("/api/get-months", { params: { year } });
            setMonths(response.data);
        } catch (error) {
            console.error("Error fetching months:", error);
            // Consider handling error differently, e.g., retain previous months
            // setMonths([]); // This might clear previous months
        }
    }, [year]);

    useEffect(() => {
        if (year) {
            fetchMonths();
        }
    }, [year, fetchMonths]);

    return months;
};
