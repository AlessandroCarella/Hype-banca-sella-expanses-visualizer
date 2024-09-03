import CustomSelect from "../CustomSelect";

export const handleOptionSelect = (option, isDeselect, setSelectedOptions, itemKey, selections, handleSelect) => {
    setSelectedOptions(prev => {
        if (!prev) return isDeselect ? [] : [option];
        if (isDeselect) {
            return prev.filter(item => item !== option);
        } else {
            return [...prev, option];
        }
    });

    // Update the selections for this specific item
    handleSelect(itemKey, isDeselect ? 
        (selections[itemKey] || []).filter(item => item !== option) : 
        [...(selections[itemKey] || []), option]
    );
};

export const renderCustomSelect = (itemKey, selections, namesList, selectedOptions, onOptionSelect) => (
    <CustomSelect
        options={namesList}
        value={selections[itemKey] || []}
        onChange={(selectedOptions) => onOptionSelect(itemKey, selectedOptions)}
        disabled={selectedOptions.filter(option => !selections[itemKey]?.includes(option))}
        selectedOptions={selections[itemKey] || []}
        onOptionSelect={onOptionSelect}
    />
);
