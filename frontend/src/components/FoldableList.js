import React, { useState, useEffect } from "react";
import FoldableListItem from "./FoldableListItem";
import { initializeOpenItems, updateData } from "./helpers/FoldableList";
import "../styles/components/FoldableList.css";

const FoldableList = ({ data, namesList, isInnermost = false, onDataUpdate, selectedOptions }) => {
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

    const handleSelect = (key, selectedOption) => {
        const updatedData = updateData(key, selectedOption, selectedOptions);
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
                    selections={selectedOptions}
                    handleSelect={handleSelect}
                    namesList={namesList}
                    onDataUpdate={onDataUpdate}
                    selectedOptions={selectedOptions}
                />
            ))}
        </div>
    );
};

export default FoldableList;
