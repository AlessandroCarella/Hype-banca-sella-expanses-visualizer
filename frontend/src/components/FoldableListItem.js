import React from "react";
import { isLastItem, renderContent, renderCustomSelect } from "./helpers/FoldableListItemHelpers";

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
                    isLastItem(value) ? "last-item" : ""
                }`}
            >
                <span className="toggle-text">{itemKey}</span>
                {isLastItem(value) && renderCustomSelect(itemKey, availableOptions, userExpenseData, handleSelect)}
            </div>
            {renderContent(isOpen, value, itemKey, handleSelect, availableOptions, userExpenseData)}
        </div>
    );
};

export default FoldableListItem;
