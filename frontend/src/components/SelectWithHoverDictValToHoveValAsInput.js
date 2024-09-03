import React, { useState } from 'react';

const SelectWithHoverDictValToHoveValAsInput = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [hoveredOption, setHoveredOption] = useState('');

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option);
  };

  return (
    <div className="custom-select">
      <div className="select-header" onClick={handleToggle}>
        {selectedOption || 'Select an option'}
      </div>
      {isOpen && (
        <ul className="options-list">
          {Object.keys(options).map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHoveredOption(option)}
              onMouseLeave={() => setHoveredOption('')}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
      {hoveredOption && (
        <div className="description-tooltip">
          {options[hoveredOption]}
        </div>
      )}
    </div>
  );
};

export default SelectWithHoverDictValToHoveValAsInput;