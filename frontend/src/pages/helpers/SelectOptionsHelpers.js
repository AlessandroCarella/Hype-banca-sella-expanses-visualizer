import axios from "axios";

export const updateAvailableOptions = (data, namesData) => {
    const allSelectedNames = getAllSelectedNames(data);
    return namesData.filter(
        (name) => !allSelectedNames.includes(name)
    );
};

export const getAllSelectedNames = (data) => {
    const selectedNames = [];
    const traverse = (obj) => {
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                selectedNames.push(...obj[key]);
            } else if (typeof obj[key] === "object") {
                traverse(obj[key]);
            }
        }
    };
    traverse(data);
    return selectedNames;
};

export const fetchInitialData = async () => {
    try {
        const [
            expenseResponse,
            namesResponse,
            preSelectedOptionsResponse,
        ] = await Promise.all([
            fetch("/api/getUserExpenseDictionary"),
            fetch("/api/getExpansesNamesList"),
            fetch("/api/getUserPreSelectedOptions"),
        ]);

        const expenseData = await expenseResponse.json();
        let namesData = await namesResponse.json();
        const preSelectedOptionsData = await preSelectedOptionsResponse.json();

        namesData = namesData.sort();
        
        // Remove pre-selected options from namesData
        namesData = namesData.filter(
            (name) => !preSelectedOptionsData.includes(name)
        );

        return { expenseData, namesData, preSelectedOptionsData };
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const initializeUserExpenseData = (expenseData, preSelectedOptions) => {
    const initialUserExpenseData = { ...expenseData };
    Object.keys(initialUserExpenseData).forEach((key) => {
        if (Array.isArray(initialUserExpenseData[key])) {
            initialUserExpenseData[key] = preSelectedOptions;
        }
    });
    return initialUserExpenseData;
};

export const saveDataToFile = async (data) => {
    try {
        await axios.post("/api/saveUserCategories", {
            data: JSON.stringify(data, null, 4),
        });
    } catch (error) {
        console.error("Error saving data:", error);
        throw error;
    }
};