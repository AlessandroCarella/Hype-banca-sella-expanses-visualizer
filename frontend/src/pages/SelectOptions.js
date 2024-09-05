import React, { createContext, useContext, useState, useEffect } from "react";
import FoldableList from "../components/FoldableList";
import {
    getAllSelectedNames,
    fetchInitialData,
    saveDataToFile,
}
from "./helpers/SelectOptionsHelpers";
import BulletListLookalikeFoldableList from "../components/BulletListLookalikeFoldableList";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import ConfirmChoice from "../components/ConfirmChoice";
import LoadingPage from "./LoadingPage"; // Import LoadingPage
import { ColorModeSwitch } from "../components/colorModeSwitch";
import { updateAvailableOptions } from "./helpers/SelectOptionsHelpers"; // Import the new function

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
    const [loading, setLoading] = useState(false);

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
    const [showConfirmSaveAndGoToGraphs, setShowConfirmSaveAndGoToGraphs] =
        useState(false);
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const [unfoldAll, setUnfoldAll] = useState(false);
    const [allUnfolded, setAllUnfolded] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true); // Set loading to true
                const { expenseData, namesData, preSelectedOptionsData } =
                    await fetchInitialData();
                setLoading(false); // Set loading to false

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
    }, [setExpenseData, setNamesData, setUserExpenseData]); // Added dependencies

    useEffect(() => {
        if (isDataLoaded) {
            updateAvailableOptions(userExpenseData, [
                ...namesData,
                ...preSelectedOptions,
            ], setAvailableOptions); // Pass setAvailableOptions as an argument
        }
    }, [isDataLoaded, userExpenseData, namesData, preSelectedOptions]);

    const handleDataUpdate = (updatedData) => {
        setUserExpenseData(updatedData);
        updateAvailableOptions(updatedData, [
            ...namesData,
            ...preSelectedOptions,
        ], setAvailableOptions); // Pass setAvailableOptions as an argument
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
        setShowConfirmReset(true);
    };

    const saveAndGoToGraphs = async () => {
        try {
            setLoading(true); // Set loading to true
            await saveDataToFile(userExpenseData);
            setLoading(false); // Set loading to false
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

    const handleConfirmChoiceReset = async (confirmed) => {
        setShowConfirmReset(false);
        if (confirmed) {
            setLoading(true); // Set loading to true
            const response = await fetch("/api/reset-user-options-to-default");
            setLoading(false); // Set loading to false

            if (response.ok) {
                window.location.reload();
            } else {
                console.error("Error resetting options:", response.statusText);
            }
        }
    };

    const handleUnfoldAll = () => {
        const newUnfoldAll = !unfoldAll;
        setUnfoldAll(newUnfoldAll);
        setAllUnfolded(newUnfoldAll);
    };

    const handleItemToggle = (isOpen) => {
        if (unfoldAll && !isOpen) {
            setAllUnfolded(false);
        }
    };

    if (loading) {
        return <LoadingPage />; // Show loading page when loading
    }

    return (
        <div>
            <div className="mb-3 d-flex fixed-top top-position-div">
                <Button onClick={handleSaveAndGoToGraphs} className="me-1">
                    Save and go to graphs
                </Button>
                <Button onClick={handleResetOptionsToDefault}>
                    Reset selection to default
                </Button>
                <Button onClick={handleUnfoldAll} className="ms-1">
                    {allUnfolded ? "Collapse All" : "Unfold All"}
                </Button>
                
                <ColorModeSwitch />
            </div>
            <div className="foldable-list-container">
                <BulletListLookalikeFoldableList items={namesData} />
                <h2>Categories</h2>
                <FoldableList
                    data={expenseData}
                    availableOptions={availableOptions}
                    onDataUpdate={handleDataUpdate}
                    userExpenseData={userExpenseData}
                    unfoldAll={unfoldAll} 
                    setUnfoldAll={setUnfoldAll}
                    onItemToggle={handleItemToggle} // Add this line
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
        </div>
    );
};

export default SelectOptions;
