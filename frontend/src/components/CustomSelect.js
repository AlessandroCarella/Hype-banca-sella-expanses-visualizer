import React from "react";
import { 
    useCustomSelect,
    SelectHeader,
    OptionsList,
    SelectedOptionsBox
} from "./helpers/CustomSelectHelpers";

const CustomSelect = ({ options, itemKey, userExpenseData, onChange, onOptionSelect }) => {
    const { 
        isOpen, 
        selectRef, 
        value, 
        handleSelect, 
        handleRemoveOption, 
        toggleOpen 
    } = useCustomSelect(itemKey, userExpenseData, onChange, onOptionSelect);

    return (
        <div className="custom-select-container">
            <div className="custom-select" ref={selectRef}>
                <SelectHeader isOpen={isOpen} toggleOpen={toggleOpen} />
                {isOpen && <OptionsList 
                    options={options} 
                    handleSelect={handleSelect} 
                    value={value} 
                />}
            </div>
            <SelectedOptionsBox value={value} handleRemoveOption={handleRemoveOption} />
        </div>
    );
};

export default CustomSelect;
