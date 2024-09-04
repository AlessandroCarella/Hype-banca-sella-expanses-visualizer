import React from "react";
import CustomSelect from "./CustomSelect";
import FoldableList from "./FoldableList";
import { isLastItem } from "./helpers/FoldableListHelpers";

const FoldableListItem = ({
    itemKey,
    value,
    isOpen,
    toggleOpen,
    handleSelect,
    availableOptions,
    userExpenseData,
}) => {
    const renderContent = () => {
        if (isOpen && !isLastItem(value)) {
            return (
                <div className="foldable-list-content">
                    <FoldableList 
                        data={value} 
                        isInnermost={isLastItem(Object.values(value)[0])}
                        availableOptions={availableOptions}
                        onDataUpdate={(updatedData) => handleSelect(itemKey, updatedData)}
                        userExpenseData={userExpenseData[itemKey] || {}}
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
                {isLastItem(value) && (
                    <CustomSelect
                        options={availableOptions}
                        itemKey={itemKey}
                        userExpenseData={userExpenseData}
                        onChange={handleSelect}
                        onOptionSelect={(option, isDeselect) => {
                            const currentSelections = userExpenseData[itemKey] || [];
                            const updatedSelections = isDeselect
                                ? currentSelections.filter(item => item !== option)
                                : [...currentSelections, option];
                            handleSelect(itemKey, updatedSelections);
                        }}
                    />
                )}
            </div>
            {renderContent()}
        </div>
    );
};

export default FoldableListItem;
