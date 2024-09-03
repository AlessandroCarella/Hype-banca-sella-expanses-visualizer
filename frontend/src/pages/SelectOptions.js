import React, { useState, useEffect } from 'react';
import FoldableList from '../components/FoldableList';

const SelectOptions = () => {
  const [expenseDictionary, setExpenseDictionary] = useState({});
  const [namesList, setNamesList] = useState([]);

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

  return (
    <div className='foldable-list-container'>
      <FoldableList data={expenseDictionary} namesList={namesList} />
    </div>
  );
};

export default SelectOptions;
