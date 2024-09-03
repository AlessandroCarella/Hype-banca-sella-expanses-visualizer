import React, { createContext, useContext, useState, useEffect } from 'react';
import FoldableList from '../components/FoldableList';

// Create the context
const SelectedOptionsContext = createContext();

// Create a custom hook for using the context
export const SelectedOptionsProvider = ({ children }) => {
    const [selectedOptions, setSelectedOptions] = useState({});

    return (
        <SelectedOptionsContext.Provider value={{ selectedOptions, setSelectedOptions }}>
            {children}
        </SelectedOptionsContext.Provider>
    );
};

export const useSelectedOptions = () => {
    const context = useContext(SelectedOptionsContext);
    if (!context) {
        throw new Error('useSelectedOptions must be used within a SelectedOptionsProvider');
    }
    return context;
};

const SelectOptions = () => {
    const [expenseDictionary, setExpenseDictionary] = useState({});
    const [namesList, setNamesList] = useState([]);
    const { selectedOptions, setSelectedOptions } = useSelectedOptions();

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
        setSelectedOptions(updatedData);
        console.log('Updated data structure:', updatedData);
    };

    return (
        <div className='foldable-list-container'>
            <FoldableList 
                data={expenseDictionary} 
                namesList={namesList} 
                onDataUpdate={handleDataUpdate}
                selectedOptions={selectedOptions}
            />
        </div>
    );
};

export default SelectOptions;
