export const getInitialSelectedDate = (dates) => {
    return dates.length > 0 ? dates[dates.length - 1] : null;
};

// Mock dates for testing purposes
export const mockDates = [
    "2023-01-15",
    "2023-02-28",
    "2023-03-10",
    "2023-04-22",
    "2023-05-05",
    "2023-06-18",
    "2023-07-30",
];
