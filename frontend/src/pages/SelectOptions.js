import React, { useState, useEffect } from 'react';
import FoldableList from '../components/FoldableList';

const SelectOptions = () => {
  const [expenseDictionary, setExpenseDictionary] = useState({});
  const [namesList, setNamesList] = useState([]);
  const [data, setData] = useState(/* your initial data structure */);

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
    console.log("Data updated in parent:", updatedData);
};

  return (
    <div className='foldable-list-container'>
      <FoldableList data={expenseDictionary} namesList={namesList} onSelect={handleDataUpdate}/>
    </div>
  );
};

export default SelectOptions;
