import CustomSelect from "../CustomSelect";

export const handleOptionSelect = (option, isDeselect, itemKey, selections, handleSelect) => {
    let updatedSelections = selections[itemKey] ? [...selections[itemKey]] : [];

    if (isDeselect) {
        updatedSelections = updatedSelections.filter(item => item !== option);
    } else if (!updatedSelections.includes(option)) {
        updatedSelections.push(option);
    }

    handleSelect(itemKey, updatedSelections);
};

export const renderCustomSelect = (itemKey, selections, namesList, selectedOptions, onOptionSelect) => (
    <CustomSelect
        options={namesList}
        value={selections[itemKey] || []}
        onChange={(selectedOptions) => onOptionSelect(itemKey, selectedOptions)}
        disabled={[]}
        selectedOptions={selections[itemKey] || []}
        onOptionSelect={onOptionSelect}
    />
);
