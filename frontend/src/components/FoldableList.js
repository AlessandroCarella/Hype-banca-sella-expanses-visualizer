import React, { useState, useEffect } from "react";
import FoldableListItem from "./FoldableListItem";
import { initializeOpenItems } from "./helpers/FoldableListHelpers";

const FoldableList = ({ data, availableOptions, onDataUpdate, userExpenseData }) => {
    const [openItems, setOpenItems] = useState({});

    useEffect(() => {
        setOpenItems(initializeOpenItems(data, Array.isArray(data)));
    }, [Array.isArray(data), data]);

    const toggleOpen = (key) => {
        setOpenItems((prevOpenItems) => ({
            ...prevOpenItems,
            [key]: !prevOpenItems[key],
        }));
    };

    const handleSelect = (key, selectedOptions) => {
        const updatedData = { ...userExpenseData, [key]: selectedOptions };
        onDataUpdate(updatedData);
    };

    return (
        <div className="foldable-list">
            {Object.entries(data).map(([key, value]) => (
                <FoldableListItem
                    key={key}
                    itemKey={key}
                    value={value}
                    isOpen={openItems[key]}
                    toggleOpen={() => toggleOpen(key)}
                    handleSelect={handleSelect}
                    availableOptions={availableOptions}
                    userExpenseData={userExpenseData}
                />
            ))}
        </div>
    );
};

export default FoldableList;
