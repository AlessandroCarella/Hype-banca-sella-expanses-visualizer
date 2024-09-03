import React from 'react';
import '../styles/components/SelectValue.css';

const SelectValue = ({ namesDescriptionsDict }) => {
  return (
    <select className="select-value">
      <option value="">Select a value</option>
      {Object.entries(namesDescriptionsDict).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </select>
  );
};

export default SelectValue;
