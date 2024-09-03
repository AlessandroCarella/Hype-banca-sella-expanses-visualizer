import React, { useState } from 'react';

const SelectValue = ({ names, descriptions }) => {
  const [selected, setSelected] = useState('');

  return (
    <div>
      <select onChange={(e) => setSelected(e.target.value)} value={selected}>
        <option value="">Select a value</option>
        {names.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      {selected && (
        <div style={{ marginTop: 10 }}>
          <strong>Description:</strong> {descriptions[selected]}
        </div>
      )}
    </div>
  );
};

export default SelectValue;
