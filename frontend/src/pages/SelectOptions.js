import React, { useState, useEffect, createContext, useContext } from 'react';
import FoldableList from '../components/FoldableList';

// Create the context
const SelectedOptionsContext = createContext();

// Create a custom hook for using the context
const useSelectedOptions = () => useContext(SelectedOptionsContext);

const SelectOptions = () => {
  const [expenseDictionary, setExpenseDictionary] = useState({});
  const [namesList, setNamesList] = useState([]);
  const [data, setData] = useState(/* your initial data structure */);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expenseResponse, namesResponse] = await Promise.all([
          fetch('/api/getUserExpenseDictionary'),
          fetch('/api/getExpansesNamesList')
        ]);

        const expenseData = await expenseResponse.json();
        const namesData = await namesResponse.json();

        setExpenseDictionary(expenseData);
        setNamesList(namesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDataUpdate = (updatedData) => {
    setData(updatedData);
  };

  return (
    <SelectedOptionsContext.Provider value={{ selectedOptions, setSelectedOptions }}>
      <div className='foldable-list-container'>
        <FoldableList 
          data={expenseDictionary} 
          namesList={namesList} 
          onSelect={handleDataUpdate}
        />
      </div>
    </SelectedOptionsContext.Provider>
  );
};

export { SelectOptions as default, useSelectedOptions };
