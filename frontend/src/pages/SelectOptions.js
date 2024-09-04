import React, { createContext, useContext, useState, useEffect } from "react";
import FoldableList from "../components/FoldableList";
import {
    updateAvailableOptions,
    getAllSelectedNames,
} from "./helpers/SelectOptionsHelpers";

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

const SelectOptions = () => {
    const {
        expenseData,
        setExpenseData,
        namesData,
        setNamesData,
        userExpenseData,
        setUserExpenseData,
    } = useSelectedOptions();

    const [availableOptions, setAvailableOptions] = useState([]);
    const [preSelectedOptions, setPreSelectedOptions] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expenseResponse, namesResponse, preSelectedOptionsResponse] = await Promise.all([
                    fetch("/api/getUserExpenseDictionary"),
                    fetch("/api/getExpansesNamesList"),
                    fetch("/api/getUserPreSelectedOptions"),
                ]);

                const expenseData = await expenseResponse.json();
                let namesData = await namesResponse.json();
                const preSelectedOptionsData = await preSelectedOptionsResponse.json();

                setPreSelectedOptions(preSelectedOptionsData);

                // Remove pre-selected options from namesData
                namesData = namesData.filter(name => !preSelectedOptionsData.includes(name));

                setExpenseData(expenseData);
                setNamesData(namesData);

                // Initialize userExpenseData with pre-selected options
                const initialUserExpenseData = { ...expenseData };
                Object.keys(initialUserExpenseData).forEach(key => {
                    if (Array.isArray(initialUserExpenseData[key])) {
                        initialUserExpenseData[key] = preSelectedOptionsData;
                    }
                });
                setUserExpenseData(initialUserExpenseData);

                setIsDataLoaded(true);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (isDataLoaded) {
            updateAvailableOptions(userExpenseData, [...namesData, ...preSelectedOptions]);
        }
    }, [isDataLoaded, userExpenseData, namesData, preSelectedOptions]);

    const updateAvailableOptions = (data, names) => {
        const allSelectedNames = getAllSelectedNames(data);
        const newAvailableOptions = names.filter(
            (name) => !allSelectedNames.includes(name)
        );
        setAvailableOptions(newAvailableOptions);
    };

    const handleDataUpdate = (updatedData) => {
        setUserExpenseData(updatedData);
        updateAvailableOptions(updatedData, [...namesData, ...preSelectedOptions]);

        console.log(
            "Updated userExpenseData:",
            JSON.stringify(updatedData, null, 2)
        );
    };

    if (!isDataLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="foldable-list-container">
            <FoldableList
                data={expenseData}
                availableOptions={availableOptions}
                onDataUpdate={handleDataUpdate}
                userExpenseData={userExpenseData}
            />
        </div>
    );
};

export default SelectOptions;
