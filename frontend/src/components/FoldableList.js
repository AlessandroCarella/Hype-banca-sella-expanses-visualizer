import React, { useState, useEffect } from 'react';
import CustomSelect from './CustomSelect';
import '../styles/components/FoldableList.css';

const FoldableList = ({ data, namesList, isInnermost = false, onSelect }) => {
  const [openItems, setOpenItems] = useState({});
  const [selections, setSelections] = useState({});

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

  const handleSelect = (key, selectedOption) => {
    setSelections(prevSelections => ({
      ...prevSelections,
      [key]: selectedOption
    }));
    onSelect(key, selectedOption);
  };

  const disabledOptions = Object.values(selections);

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
              <CustomSelect
                options={namesList}
                value={selections[key] || ''}
                onChange={(selectedOption) => handleSelect(key, selectedOption)}
                disabled={disabledOptions}
              />
            )}
          </div>
          {openItems[key] && !isLastItem(value) && (
            <div className="foldable-list-content">
              <FoldableList 
                data={value} 
                namesList={namesList} 
                isInnermost={isLastItem(Object.values(value)[0])}
                onSelect={(subKey, subValue) => handleSelect(`${key}.${subKey}`, subValue)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FoldableList;
