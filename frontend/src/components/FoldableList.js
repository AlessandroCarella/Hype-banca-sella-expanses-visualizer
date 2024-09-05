import React, { useState, useEffect } from "react";
import FoldableListItem from "./FoldableListItem";
import { initializeOpenItems } from "./helpers/FoldableListHelpers";

const FoldableList = ({ data, availableOptions, onDataUpdate, userExpenseData, unfoldAll, setUnfoldAll, onItemToggle }) => {
    const [openItems, setOpenItems] = useState({});
    const [closedItems, setClosedItems] = useState({});

    useEffect(() => {
        if (unfoldAll) {
            setOpenItems(Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
            setClosedItems({});
        } else {
            setOpenItems(initializeOpenItems(data, Array.isArray(data)));
            setClosedItems({});
        }
    }, [unfoldAll, data]);

    const toggleOpen = (key) => {
        if (unfoldAll) {
            setClosedItems(prev => {
                const newClosedItems = { ...prev, [key]: !prev[key] };
                onItemToggle(!newClosedItems[key]);
                return newClosedItems;
            });
        } else {
            setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
        }
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
                    isOpen={unfoldAll ? !closedItems[key] : openItems[key]}
                    toggleOpen={() => toggleOpen(key)}
                    handleSelect={handleSelect}
                    availableOptions={availableOptions}
                    userExpenseData={userExpenseData}
                    unfoldAll={unfoldAll}
                    setUnfoldAll={setUnfoldAll}
                    onItemToggle={onItemToggle} // Pass onItemToggle to FoldableListItem
                />
            ))}
        </div>
    );
};

export default FoldableList;
