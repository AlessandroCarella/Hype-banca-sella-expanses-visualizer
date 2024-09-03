import React, { useState, useEffect } from "react";
import FoldableListItem from "./FoldableListItem";
import { initializeOpenItems } from "./helpers/FoldableList";
import "../styles/components/FoldableList.css";

const FoldableList = ({ data, namesList, isInnermost = false, onSelect, onDataUpdate }) => {
    console.log("data", data)
    const [openItems, setOpenItems] = useState({});
    const [selections, setSelections] = useState({});
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        setOpenItems(initializeOpenItems(data, isInnermost));
    }, [isInnermost, data]);

    const toggleOpen = (key) => {
        setOpenItems((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const handleSelect = (key, selectedOption) => {
        let updatedData = { ...data };
        let currentObj = updatedData;
        const keys = key.split('.');

        // Traverse the nested structure
        for (let i = 0; i < keys.length - 1; i++) {
            currentObj = currentObj[keys[i]];
        }

        // Update the value at the final key
        currentObj[keys[keys.length - 1]] = selectedOption;

        setSelections((prevSelections) => ({
            ...prevSelections,
            [key]: selectedOption,
        }));
        setSelectedOptions((prevOptions) => [
            ...prevOptions.filter((option) => option !== selections[key]),
            selectedOption,
        ]);

        // Call the onDataUpdate prop with the updated data
        if (onDataUpdate && typeof onDataUpdate === "function") {
            onDataUpdate(updatedData);
        }

        console.log("Updated data:", updatedData);

        // Existing onSelect call
        if (onSelect && typeof onSelect === "function") {
            onSelect(key, selectedOption);
        }
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
                    selections={selections}
                    handleSelect={handleSelect}
                    namesList={namesList}
                    selectedOptions={selectedOptions}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
};

export default FoldableList;
