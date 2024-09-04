import React, { useState, useEffect, useRef } from "react";

export const handleClickOutside = (ref, callback) => {
    const handleClick = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            callback();
        }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
        document.removeEventListener("mousedown", handleClick);
    };
};

export const renderOptions = (options, disabled, onSelect, selectedValues, allSelectedOptions) => {
    const sortedOptions = sortOptions(options, allSelectedOptions);

    return sortedOptions.map(option => (
        <li
            key={option}
            onClick={() => onSelect(option)}
            className={getOptionClassName(option, disabled, selectedValues)}
        >
            {option}
        </li>
    ));
};

export const sortOptions = (options, allSelectedOptions) => {
    return [...options].sort((a, b) => {
        // First, sort alphabetically
        const alphabeticalOrder = a.localeCompare(b);
        if (alphabeticalOrder !== 0) return alphabeticalOrder;

        // If alphabetically equal, prioritize non-selected options
        const aSelected = allSelectedOptions.includes(a);
        const bSelected = allSelectedOptions.includes(b);
        if (aSelected === bSelected) return 0;
        return aSelected ? 1 : -1;
    });
};

export const getOptionClassName = (option, disabled, selectedValues) => {
    return `
        ${disabled.includes(option) ? "disabled" : ""}
        ${selectedValues.includes(option) ? "selected" : ""}
    `;
};

export const toggleOption = (option, value) => {
    const newValue = Array.isArray(value) ? [...value] : [];
    const index = newValue.indexOf(option);
    if (index === -1) {
        newValue.push(option);
    } else {
        newValue.splice(index, 1);
    }
    return newValue;
};

export const useCustomSelect = (itemKey, userExpenseData, onChange, onOptionSelect) => {
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

    return { isOpen, setIsOpen, selectRef, value, handleSelect, handleRemoveOption, toggleOpen };
};

export const SelectHeader = ({ isOpen, toggleOpen }) => (
    <div
        className={`select-header ${isOpen ? "open" : ""}`}
        onClick={toggleOpen}
    >
        Select options
    </div>
);

export const OptionsList = ({ options, handleSelect, value }) => (
    <ul className="options-list">
        {renderOptions(options, [], handleSelect, value, value)}
    </ul>
);

export const SelectedOptionsBox = ({ value, handleRemoveOption }) => (
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
