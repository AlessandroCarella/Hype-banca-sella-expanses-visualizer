import React, { useState } from 'react';
import '../styles/components/SelectValue.css';

const SelectValue = ({ names, descriptions }) => {
  const [selected, setSelected] = useState('');

  return (
    <div className="select-value-container">
      <select 
        className="select-value-select"
        onChange={(e) => setSelected(e.target.value)} 
        value={selected}
      >
        <option value="">Select</option>
        {names.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      {selected && (
        <div className="select-value-description">
          <strong>Description:</strong> {descriptions[selected]}
        </div>
      )}
    </div>
  );
};

export default SelectValue;
