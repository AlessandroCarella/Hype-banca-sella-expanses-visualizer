import React, { createContext, useContext, useState, useEffect } from "react";
import FoldableList from "../components/FoldableList";
import {
    updateAvailableOptions,
    getAllSelectedNames,
    fetchInitialData,
    saveDataToFile,
    saveDataButton,
} from "./helpers/SelectOptionsHelpers";
import BulletListLookalikeFoldableList from "../components/BulletListLookalikeFoldableList";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import ConfirmChoice from "../components/ConfirmChoice";

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
    const navigate = useNavigate();
    const [showConfirmSaveAndGoToGraphs, setShowConfirmSaveAndGoToGraphs] = useState(false);
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const { expenseData, namesData, preSelectedOptionsData } =
                    await fetchInitialData();
                setExpenseData(expenseData);
                setNamesData(namesData);
                setPreSelectedOptions(preSelectedOptionsData);
                setUserExpenseData(expenseData);
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

    const handleSaveAndGoToGraphs = async () => {
        // Check if all options are selected
        const allSelectedNames = getAllSelectedNames(userExpenseData);
        const allOptionsSelected = namesData.every((name) =>
            allSelectedNames.includes(name)
        );
        const nonSelectedOptions = namesData.filter(
            (name) => !allSelectedNames.includes(name)
        );

        if (!allOptionsSelected) {
            setShowConfirmSaveAndGoToGraphs(true);
        } else {
            userExpenseData["Miscellaneous"] = [
                ...userExpenseData["Miscellaneous"],
                ...nonSelectedOptions,
            ];
            await saveAndGoToGraphs();
        }
    };

    const handleResetOptionsToDefault = async () => {
        setShowConfirmReset(true)
    };

    const saveAndGoToGraphs = async () => {
        try {
            await saveDataToFile(userExpenseData);
            navigate("/graphs");
        } catch (error) {
            console.error("Error saving data:", error);
            // Optionally, add user feedback for the error
        }
    };

    const handleConfirmChoiceSaveAndGoToGraphs = async (confirmed) => {
        setShowConfirmSaveAndGoToGraphs(false);
        if (confirmed) {
            const allSelectedNames = getAllSelectedNames(userExpenseData);
            const nonSelectedOptions = namesData.filter(
                (name) => !allSelectedNames.includes(name)
            );
            userExpenseData["Miscellaneous"] = [
                ...userExpenseData["Miscellaneous"],
                ...nonSelectedOptions,
            ];
            await saveAndGoToGraphs();
        }
    };

    const handleConfirmChoiceReset = async(confirmed) => {
        setShowConfirmReset(false);
        if (confirmed) {
            const response = await fetch("/api/reset-user-options-to-default");
            
            if (response.ok) {
                window.location.reload();
            } else {
                console.error("Error resetting options:", response.statusText);
            }
        }
    };

    return (
        <div className="foldable-list-container">
            <div className="mb-3 d-flex ">
                <Button onClick={handleSaveAndGoToGraphs} className="me-1">
                    Save and go to graphs
                </Button>
                <Button onClick={handleResetOptionsToDefault}>
                    Reset selection to default
                </Button>
            </div>
            <BulletListLookalikeFoldableList items={namesData} />
            <h2>Categories</h2>
            <FoldableList
                data={expenseData}
                availableOptions={availableOptions}
                onDataUpdate={handleDataUpdate}
                userExpenseData={userExpenseData}
            />
            {showConfirmSaveAndGoToGraphs && (
                <div className="confirm-choice-overlay">
                    <ConfirmChoice
                        message="Are you sure you want to continue? Some options have not been selected and they will be added to the Miscellaneous category if you confirm."
                        onConfirm={handleConfirmChoiceSaveAndGoToGraphs}
                    />
                </div>
            )}
            {showConfirmReset && (
                <div className="confirm-choice-overlay">
                    <ConfirmChoice
                        message="Are you sure you want to reset the data? The default configuration will be loaded."
                        onConfirm={handleConfirmChoiceReset}
                    />
                </div>
            )}
        </div>
    );
};

export default SelectOptions;
