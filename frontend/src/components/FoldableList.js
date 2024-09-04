import React, { useState, useEffect } from "react";
import FoldableListItem from "./FoldableListItem";
import { initializeOpenItems, updateData } from "./helpers/FoldableListHelpers";
import { useSelectedOptions } from "../pages/SelectOptions";
import "../styles/components/FoldableList.css";

const FoldableList = ({ data, isInnermost = false, namesList, onDataUpdate, userExpenseData }) => {
    const [openItems, setOpenItems] = useState({});
    const [availableOptions, setAvailableOptions] = useState(namesList);

    useEffect(() => {
        setOpenItems(initializeOpenItems(data, isInnermost));
    }, [isInnermost, data]);

    useEffect(() => {
        const allSelectedOptions = Object.values(userExpenseData).flat();
        setAvailableOptions(namesList.filter(option => !allSelectedOptions.includes(option)));
    }, [userExpenseData, namesList]);

    const toggleOpen = (key) => {
        setOpenItems((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const handleSelect = (key, selectedOptions) => {
        const updatedData = { ...userExpenseData, [key]: selectedOptions };
        onDataUpdate(updatedData);
    };

    return (
        <div className="foldable-list">
            {Object.entries(data || {}).map(([key, value]) => (
                <FoldableListItem
                    key={key}
                    itemKey={key}
                    value={value}
                    isOpen={openItems[key]}
                    toggleOpen={() => toggleOpen(key)}
                    handleSelect={handleSelect}
                    availableOptions={availableOptions}
                    userExpenseData={userExpenseData}
                    namesList={namesList}  // Add this line
                />
            ))}
        </div>
    );
};

export default FoldableList;
