import CustomSelect from "../CustomSelect";
import FoldableList from "../FoldableList";

export const isLastItem = (value) =>
    typeof value !== "object" || Object.keys(value).length === 0;

export const renderContent = (isOpen, value, itemKey, handleSelect, availableOptions, userExpenseData) => {
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

export const renderCustomSelect = (itemKey, availableOptions, userExpenseData, handleSelect) => (
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
);
