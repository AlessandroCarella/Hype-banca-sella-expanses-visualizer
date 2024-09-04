import React, { useEffect, useState } from "react";
import FoldableList from "../components/FoldableList";
import BulletListLookalikeFoldableList from "../components/BulletListLookalikeFoldableList";
import { updateAvailableOptions, useSelectedOptions, fetchAllData, processInitialData } from "./helpers/SelectOptionsHelpers";

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
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (isDataLoaded) {
            updateAvailableOptionsEffect();
        }
    }, [isDataLoaded, userExpenseData, namesData, preSelectedOptions]);

    const fetchInitialData = async () => {
        try {
            const [expenseData, namesData, preSelectedOptionsData] = await fetchAllData();
            processInitialData(expenseData, namesData, preSelectedOptionsData, setExpenseData, setNamesData, setPreSelectedOptions, setUserExpenseData);
            setIsDataLoaded(true);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const updateAvailableOptionsEffect = () => {
        const allNames = [...namesData, ...preSelectedOptions];
        const newAvailableOptions = updateAvailableOptions(userExpenseData, allNames);
        setAvailableOptions(newAvailableOptions);
    };

    const handleDataUpdate = (updatedData) => {
        setUserExpenseData(updatedData);
        updateAvailableOptionsEffect();
        logUpdatedData(updatedData);
    };

    const logUpdatedData = (data) => {
        console.log("Updated userExpenseData:", JSON.stringify(data, null, 2));
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
