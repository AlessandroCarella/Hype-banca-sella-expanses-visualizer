import { monthData, yearData } from "./mockData";

const addColorToData = (data, supercategoryColors, isMonthView) => {
    if (isMonthView) {
        return data.map(item => ({ ...item, color: supercategoryColors[item.supercategory] }));
    }
    return Object.fromEntries(
        Object.entries(data).map(([month, items]) => [
            month,
            items.map(item => ({ ...item, color: supercategoryColors[item.supercategory] }))
        ])
    );
};

const fetchData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getData = async (isMonthView, year, month, dataType, supercategoryColors) => {
    try {
        const url = isMonthView
            ? `/api/get-month-data?month=${month}&year=${year}&expenditure-or-revenue=${dataType}`
            : `/api/get-year-data?year=${year}&expenditure-or-revenue=${dataType}`;

        const data = await fetchData(url);
        return addColorToData(data, supercategoryColors, isMonthView);
    } catch (error) {
        console.error("Error fetching data:", error);
        return getMockData(isMonthView, year, month, dataType, supercategoryColors);
    }
};

export const getMockData = (isMonthView, year, month, dataType, supercategoryColors) => {
    const mockData = isMonthView ? monthData : yearData;
    return addColorToData(mockData, supercategoryColors, isMonthView);
};
