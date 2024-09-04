import React, { useState, useEffect } from "react";
import FoldableListItem from "./FoldableListItem";
import { initializeOpenItems } from "./helpers/FoldableListHelpers";

const FoldableList = ({ data, isInnermost = false, availableOptions, onDataUpdate, userExpenseData }) => {
    const [openItems, setOpenItems] = useState({});

    useEffect(() => {
        setOpenItems(initializeOpenItems(data, isInnermost));
    }, [isInnermost, data]);

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
                />
            ))}
        </div>
    );
};

export default FoldableList;
