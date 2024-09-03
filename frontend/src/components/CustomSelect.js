import React, { useState, useEffect, useRef } from "react";
import { handleClickOutside, renderOptions } from "./helpers/CustomSelect";

const CustomSelect = ({ options, value, onChange, disabled, selectedOptions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const handleSelect = (option) => {
        if (!disabled.includes(option)) {
            onChange(option);
            setIsOpen(false);
        }
    };

    useEffect(() => {
        return handleClickOutside(selectRef, () => setIsOpen(false));
    }, []);

    return (
        <div className="custom-select-container">
            <div className="custom-select" ref={selectRef}>
                <div
                    className={`select-header ${isOpen ? "open" : ""}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                >
                    {value || "Select an option"}
                </div>
                {isOpen && (
                    <ul className="options-list">
                        {renderOptions(options, disabled, handleSelect)}
                    </ul>
                )}
            </div>
            {selectedOptions && selectedOptions.length > 0 && (
                <div className="selected-options-box">
                    {selectedOptions.map((option, index) => (
                        <span key={index} className="selected-option">{option}</span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
