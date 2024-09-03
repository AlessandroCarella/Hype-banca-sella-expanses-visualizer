import React, { useState, useEffect } from 'react';
import SelectValue from './SelectValue';
import '../styles/components/FoldableList.css';

const FoldableList = ({ data, names, descriptions, isInnermost = false }) => {
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    if (isInnermost) {
      setOpenItems(Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }
  }, [isInnermost, data]);

  const toggleOpen = (key) => {
    setOpenItems(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };

  const isLastItem = (value) => typeof value !== 'object' || Object.keys(value).length === 0;

  return (
    <div className="foldable-list">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="foldable-list-item">
          <div
            onClick={() => toggleOpen(key)}
            className={`foldable-list-toggle ${openItems[key] ? 'open' : ''} ${isLastItem(value) ? 'last-item' : ''}`}
          >
            {key}
            {isLastItem(value) && (
              <SelectValue names={names} descriptions={descriptions} />
            )}
          </div>
          {openItems[key] && !isLastItem(value) && (
            <div className="foldable-list-content">
              <FoldableList 
                data={value} 
                names={names} 
                descriptions={descriptions} 
                isInnermost={isLastItem(Object.values(value)[0])}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FoldableList;
