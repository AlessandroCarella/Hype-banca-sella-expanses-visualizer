import React, { createContext, useContext, useState, useEffect } from "react";
import FoldableList from "../components/FoldableList";
import {
    updateAvailableOptions,
    getAllSelectedNames,
    fetchInitialData,
    initializeUserExpenseData,
    saveDataToFile,
} from "./helpers/SelectOptionsHelpers";
import BulletListLookalikeFoldableList from "../components/BulletListLookalikeFoldableList";

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
        const loadData = async () => {
            try {
                const { expenseData, namesData, preSelectedOptionsData } = await fetchInitialData();
                setExpenseData(expenseData);
                setNamesData(namesData);
                setPreSelectedOptions(preSelectedOptionsData);

                const initialUserExpenseData = initializeUserExpenseData(expenseData, preSelectedOptionsData);
                setUserExpenseData(initialUserExpenseData);

                setIsDataLoaded(true);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        if (isDataLoaded) {
            updateAvailableOptions(userExpenseData, [
                ...namesData,
                ...preSelectedOptions,
            ]);
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
        updateAvailableOptions(updatedData, [
            ...namesData,
            ...preSelectedOptions,
        ]);
        saveDataToFile(updatedData);
    };

    return (
        <div className="foldable-list-container">
            <BulletListLookalikeFoldableList items={namesData} />
            <h2>Categories</h2>
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
