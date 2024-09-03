import React, { useState, useEffect } from "react";
import FoldableListItem from "./FoldableListItem";
import { initializeOpenItems, updateSelections, updateData } from "./helpers/FoldableList";
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
        const { updatedSelections, updatedSelectedOptions } = updateSelections(key, selectedOption, selections, selectedOptions);
        setSelections(updatedSelections);
        setSelectedOptions(updatedSelectedOptions);

        const updatedData = updateData(key, selectedOption, data);
        
        if (onDataUpdate && typeof onDataUpdate === "function") {
            onDataUpdate(updatedData);
        }

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
