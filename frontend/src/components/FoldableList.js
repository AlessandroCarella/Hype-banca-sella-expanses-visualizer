import React, { useState } from 'react';
import SelectValue from './SelectValue';

const FoldableList = ({ data, names, descriptions }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ marginLeft: 20 }}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <div onClick={toggleOpen} style={{ cursor: 'pointer', fontWeight: 'bold', margin: '5px 0' }}>
            {key}
          </div>
          {isOpen && (
            <div style={{ paddingLeft: 10 }}>
              {typeof value === 'object' && Object.keys(value).length > 0 ? (
                <FoldableList data={value} names={names} descriptions={descriptions} />
              ) : (
                <SelectValue names={names} descriptions={descriptions} />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FoldableList;
