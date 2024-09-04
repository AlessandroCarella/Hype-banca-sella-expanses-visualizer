import React, { createContext, useContext, useState, useEffect } from 'react';
import FoldableList from '../components/FoldableList';

// Create the context
const SelectedOptionsContext = createContext();

// Create a custom hook for using the context
export const SelectedOptionsProvider = ({ children }) => {
    const [expenseData, setExpenseData] = useState({});
    const [namesData, setNamesData] = useState([]);
    const [userExpenseData, setUserExpenseData] = useState({});
    const [userMissingNamesData, setUserMissingNamesData] = useState([]);

    return (
        <SelectedOptionsContext.Provider value={{ 
            expenseData, setExpenseData,
            namesData, setNamesData,
            userExpenseData, setUserExpenseData,
            userMissingNamesData, setUserMissingNamesData
        }}>
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
    const { 
        expenseData, setExpenseData,
        namesData, setNamesData,
        userExpenseData, setUserExpenseData,
        userMissingNamesData, setUserMissingNamesData
    } = useSelectedOptions();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expenseResponse, namesResponse] = await Promise.all([
                    fetch('/api/getUserExpenseDictionary'),
                    fetch('/api/getExpansesNamesList')
                ]);

                const expenseData = await expenseResponse.json();
                const namesData = await namesResponse.json();

                setExpenseData(expenseData);
                setNamesData(namesData);
                setUserExpenseData(expenseData);
                setUserMissingNamesData(namesData);

                console.log('Initial expenseData:', expenseData);
                console.log('Initial namesData:', namesData);
                console.log('Initial userExpenseData:', expenseData);
                console.log('Initial userMissingNamesData:', namesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDataUpdate = (updatedData) => {
        setUserExpenseData(updatedData);
        
        // Update userMissingNamesData
        const allSelectedNames = getAllSelectedNames(updatedData);
        const newUserMissingNamesData = namesData.filter(name => !allSelectedNames.includes(name));
        setUserMissingNamesData(newUserMissingNamesData);

        console.log('Updated userExpenseData:', updatedData);
        console.log('Updated userMissingNamesData:', newUserMissingNamesData);
    };

    const getAllSelectedNames = (data) => {
        const selectedNames = [];
        const traverse = (obj) => {
            for (const key in obj) {
                if (typeof obj[key] === 'object') {
                    traverse(obj[key]);
                } else if (Array.isArray(obj[key])) {
                    selectedNames.push(...obj[key]);
                }
            }
        };
        traverse(data);
        return selectedNames;
    };

    return (
        <div className='foldable-list-container'>
            <FoldableList 
                data={expenseData} 
                namesList={namesData} 
                onDataUpdate={handleDataUpdate}
                userExpenseData={userExpenseData}
            />
        </div>
    );
};

export default SelectOptions;
