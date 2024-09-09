import { useState, useEffect } from "react";
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

    useEffect(() => {
        const fetchMonths = async () => {
            try {
                const response = await axios.get("/api/get-months", { params: { year } });
                setMonths(response.data);
            } catch (error) {
                console.error("Error fetching months:", error);
                setMonths([]);
            }
        };

        if (year) {
            fetchMonths();
        }
    }, [year]);

    return months;
};
