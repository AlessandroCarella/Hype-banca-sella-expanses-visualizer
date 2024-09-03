import React from "react";
import CustomSelect from "./CustomSelect";
import FoldableList from "./FoldableList";
import { isLastItem } from "./helpers/FoldableList";
import { handleOptionSelect, renderCustomSelect } from "./helpers/FoldableListItem";

const FoldableListItem = ({
    itemKey,
    value,
    isOpen,
    toggleOpen,
    selections,
    handleSelect,
    namesList,
    onDataUpdate,
    selectedOptions
}) => {
    const onOptionSelect = (option, isDeselect) => {
        handleOptionSelect(option, isDeselect, itemKey, selections, handleSelect);
    };

    const renderContent = () => {
        if (isOpen && !isLastItem(value)) {
            return (
                <div className="foldable-list-content">
                    <FoldableList
                        data={value}
                        namesList={namesList}
                        isInnermost={isLastItem(Object.values(value)[0])}
                        onDataUpdate={(updatedData) => onDataUpdate({...selectedOptions, [itemKey]: updatedData})}
                        selectedOptions={selectedOptions[itemKey] || {}}
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <div className="foldable-list-item">
            <div
                onClick={toggleOpen}
                className={`foldable-list-toggle ${isOpen ? "open" : ""} ${
                    isLastItem(value) ? "last-item" : ""
                }`}
            >
                <span className="toggle-text">{itemKey}</span>
                {isLastItem(value) && renderCustomSelect(itemKey, selections, namesList, selectedOptions, onOptionSelect)}
            </div>
            {renderContent()}
        </div>
    );
};

export default FoldableListItem;
