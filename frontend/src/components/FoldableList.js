import React, { useState, useEffect } from "react";
import FoldableListItem from "./FoldableListItem";
import { initializeOpenItems } from "./helpers/FoldableList";
import "../styles/components/FoldableList.css";

const FoldableList = ({ data, namesList, isInnermost = false, onSelect, onDataUpdate }) => {
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
        
        if (selectedOption === "Free") {
            // Remove the selection
            setSelections((prevSelections) => {
                const { [key]: removed, ...rest } = prevSelections;
                return rest;
            });
            setSelectedOptions((prevOptions) =>
                prevOptions.filter((option) => option !== selections[key])
            );
            delete updatedData[key];
        } else {
            // Add or update the selection
            setSelections((prevSelections) => ({
                ...prevSelections,
                [key]: selectedOption,
            }));
            setSelectedOptions((prevOptions) => [
                ...prevOptions.filter((option) => option !== selections[key]),
                selectedOption,
            ]);
            updatedData[key] = selectedOption;
        }

        // Call the onDataUpdate prop with the updated data
        if (onDataUpdate && typeof onDataUpdate === "function") {
            onDataUpdate(updatedData);
        }

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
