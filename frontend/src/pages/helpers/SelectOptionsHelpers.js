import React, { createContext, useContext, useState } from "react";

// Create the context
const SelectedOptionsContext = createContext();

// Create a custom hook for using the context
export const SelectedOptionsProvider = ({ children }) => {
    const [expenseData, setExpenseData] = useState({});
    const [namesData, setNamesData] = useState([]);
    const [userExpenseData, setUserExpenseData] = useState({});
    const [userMissingNamesData, setUserMissingNamesData] = useState([]);

    return (
        <SelectedOptionsContext.Provider
            value={{
                expenseData,
                setExpenseData,
                namesData,
                setNamesData,
                userExpenseData,
                setUserExpenseData,
                userMissingNamesData,
                setUserMissingNamesData,
            }}
        >
            {children}
        </SelectedOptionsContext.Provider>
    );
};

export const useSelectedOptions = () => {
    const context = useContext(SelectedOptionsContext);
    if (!context) {
        throw new Error(
            "useSelectedOptions must be used within a SelectedOptionsProvider"
        );
    }
    return context;
};

export const updateAvailableOptions = (data, names) => {
    const allSelectedNames = getAllSelectedNames(data);
    return names.filter((name) => !allSelectedNames.includes(name));
};

export const getAllSelectedNames = (data) => {
    return Object.values(data).flat();
};

export const fetchAllData = async () => {
    const [expenseResponse, namesResponse, preSelectedOptionsResponse] =
        await Promise.all([
            fetch("/api/getUserExpenseDictionary"),
            fetch("/api/getExpansesNamesList"),
            fetch("/api/getUserPreSelectedOptions"),
        ]);

    return [
        await expenseResponse.json(),
        await namesResponse.json(),
        await preSelectedOptionsResponse.json(),
    ];
};

export const processInitialData = (
    expenseData,
    namesData,
    preSelectedOptionsData,
    setExpenseData,
    setNamesData,
    setPreSelectedOptions,
    setUserExpenseData
) => {
    setPreSelectedOptions(preSelectedOptionsData);

    // Remove pre-selected options from namesData and sort
    const filteredNamesData = namesData
        .filter((name) => !preSelectedOptionsData.includes(name))
        .sort();

    setExpenseData(expenseData);
    setNamesData(filteredNamesData);

    const initialUserExpenseData = initializeUserExpenseData(
        expenseData,
        preSelectedOptionsData
    );
    setUserExpenseData(initialUserExpenseData);
};

const initializeUserExpenseData = (expenseData, preSelectedOptions) => {
    const initialData = { ...expenseData };
    Object.keys(initialData).forEach((key) => {
        if (Array.isArray(initialData[key])) {
            initialData[key] = preSelectedOptions;
        }
    });
    return initialData;
};
