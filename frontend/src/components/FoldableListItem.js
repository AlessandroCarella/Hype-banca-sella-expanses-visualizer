import React from "react";
import { renderContent, renderCustomSelect } from "./helpers/FoldableListItemHelpers";

const FoldableListItem = ({
    itemKey,
    value,
    isOpen,
    toggleOpen,
    handleSelect,
    availableOptions,
    userExpenseData,
}) => {
    return (
        <div className="foldable-list-item">
            <div
                onClick={toggleOpen}
                className={`foldable-list-toggle ${isOpen ? "open" : ""} ${
                    Array.isArray(value) ? "array-item" : ""
                }`}
            >
                <span className="toggle-text">{itemKey}</span>
                {Array.isArray(value) && renderCustomSelect(itemKey, availableOptions, userExpenseData, handleSelect)}
            </div>
            {renderContent(isOpen, value, itemKey, handleSelect, availableOptions, userExpenseData)}
        </div>
    );
};

export default FoldableListItem;
