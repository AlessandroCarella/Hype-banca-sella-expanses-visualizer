import React from "react";
import CustomSelect from "./CustomSelect";
import FoldableList from "./FoldableList";
import { isLastItem } from "./helpers/FoldableList";
import { useSelectedOptions } from "../pages/SelectOptions";

const FoldableListItem = ({
    itemKey,
    value,
    isOpen,
    toggleOpen,
    selections,
    handleSelect,
    namesList,
    onSelect,
}) => {
    const { selectedOptions, setSelectedOptions } = useSelectedOptions();

    const handleOptionSelect = (option, isDeselect = false) => {
        setSelectedOptions(prev => {
            if (isDeselect) {
                return prev.filter(item => item !== option);
            } else {
                return [...prev, option];
            }
        });

        // Update the selections for this specific item
        handleSelect(itemKey, isDeselect ? 
            selections[itemKey].filter(item => item !== option) : 
            [...(selections[itemKey] || []), option]
        );
    };

    const renderCustomSelect = () => (
        <CustomSelect
            options={namesList}
            value={selections[itemKey] || []}
            onChange={(selectedOptions) => handleSelect(itemKey, selectedOptions)}
            disabled={selectedOptions.filter(option => !selections[itemKey]?.includes(option))}
            selectedOptions={selections[itemKey] || []}
            onOptionSelect={handleOptionSelect}
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
