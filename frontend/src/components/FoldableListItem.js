import React from "react";
import CustomSelect from "./CustomSelect";
import FoldableList from "./FoldableList";
import { isLastItem } from "./helpers/FoldableList";

const FoldableListItem = ({
    itemKey,
    value,
    isOpen,
    toggleOpen,
    selections,
    handleSelect,
    namesList,
    selectedOptions,
    onSelect,
}) => {
    const renderCustomSelect = () => (
        <CustomSelect
            options={["Free", ...namesList]}
            value={selections[itemKey] || ""}
            onChange={(selectedOption) => handleSelect(itemKey, selectedOption)}
            disabled={selectedOptions}
            selectedOptions={selectedOptions} // Pass the selectedOptions prop here
        />
    );

    return (
        <div className="foldable-list-item">
            <div
                onClick={toggleOpen}
                className={`foldable-list-toggle ${isOpen ? "open" : ""} ${
                    isLastItem(value) ? "last-item" : ""
                }`}
            >
                <span className="toggle-text">{itemKey}</span>
                {isLastItem(value) && renderCustomSelect()}
            </div>
            {isOpen && !isLastItem(value) && (
                <div className="foldable-list-content">
                    <FoldableList
                        data={value}
                        namesList={namesList}
                        isInnermost={isLastItem(Object.values(value)[0])}
                        onSelect={(subKey, subValue) =>
                            handleSelect(`${itemKey}.${subKey}`, subValue)
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default FoldableListItem;
