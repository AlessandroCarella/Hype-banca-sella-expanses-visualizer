import React, { useState, useEffect, useRef } from "react";
import { 
    handleClickOutside, 
    renderOptions, 
    calculatePosition, 
    toggleOption 
} from "./helpers/CustomSelectHelpers";

const CustomSelect = ({ options, itemKey, userExpenseData, onChange, onOptionSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);
    const value = userExpenseData[itemKey] || [];

    useEffect(() => {
        return handleClickOutside(selectRef, () => setIsOpen(false));
    }, []);

    const handleSelect = (option) => {
        const newValue = toggleOption(option, value);
        onChange(itemKey, newValue);
        onOptionSelect(option, value.includes(option));
    };

    const handleRemoveOption = (option, e) => {
        e.stopPropagation();
        const newValue = value.filter(item => item !== option);
        onChange(itemKey, newValue);
        onOptionSelect(option, true);
    };

    const toggleOpen = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

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

const SelectHeader = ({ isOpen, toggleOpen }) => (
    <div
        className={`select-header ${isOpen ? "open" : ""}`}
        onClick={toggleOpen}
    >
        Select options
    </div>
);

const OptionsList = ({ options, handleSelect, value }) => (
    <ul className="options-list">
        {renderOptions(options, [], handleSelect, value, value)}
    </ul>
);

const SelectedOptionsBox = ({ value, handleRemoveOption }) => (
    Array.isArray(value) && value.length > 0 && (
        <div className="selected-options-box">
            {value.map((option) => (
                <span 
                    key={option} 
                    className="selected-option"
                    onClick={(e) => handleRemoveOption(option, e)}
                >
                    {option}
                    <span className="remove-option">×</span>
                </span>
            ))}
        </div>
    )
);

export default CustomSelect;
