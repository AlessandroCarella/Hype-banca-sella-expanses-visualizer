import React, { useState, useEffect, useRef } from "react";
import { handleClickOutside, renderOptions } from "./helpers/CustomSelect";

const CustomSelect = ({ options, value, onChange, disabled, selectedOptions, onOptionSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const handleSelect = (option) => {
        if (!disabled.includes(option)) {
            const newValue = Array.isArray(value) ? [...value] : [];
            const index = newValue.indexOf(option);
            if (index === -1) {
                newValue.push(option);
                onOptionSelect(option); // Notify parent about the newly selected option
            } else {
                newValue.splice(index, 1);
                onOptionSelect(option, true); // Notify parent about the deselected option
            }
            onChange(newValue);
        }
    };

    useEffect(() => {
        return handleClickOutside(selectRef, () => setIsOpen(false));
    }, []);

    const toggleOpen = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div className="custom-select-container">
            <div className="custom-select" ref={selectRef}>
                {isOpen && (
                    <ul className="options-list">
                        {renderOptions(options, disabled, handleSelect, value)}
                    </ul>
                )}
                <div
                    className={`select-header ${isOpen ? "open" : ""}`}
                    onClick={toggleOpen}
                >
                    Select options
                </div>
            </div>
            {Array.isArray(value) && value.length > 0 && (
                <div className="selected-options-box">
                    {value.map((option) => (
                        <span key={option} className="selected-option">
                            {option}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
