import React, { useState, useEffect, useRef } from 'react';

const CustomSelect = ({ options, value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleSelect = (option) => {
    if (!disabled.includes(option)) {
      onChange(option);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-select" ref={selectRef}>
      <div
        className={`select-header ${isOpen ? 'open' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {value || 'Select an option'}
      </div>
      {isOpen && (
        <ul className="options-list">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={disabled.includes(option) ? 'disabled' : ''}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;