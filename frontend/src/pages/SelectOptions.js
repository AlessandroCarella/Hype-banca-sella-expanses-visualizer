import React from 'react';
import FoldableList from '../components/FoldableList';

// Define the expense dictionary based on the provided JSON structure
const expenseDictionary = {
  "Essential Categories": {
    "Housing": {
      "Rent/Mortgage": [],
      "Property Taxes": [],
      "Home Maintenance": [],
      "Home Insurance": []
    },
    "Utilities": {
      "Electricity": [],
      "Water": [],
      "Gas": [],
      "Internet & Cable": [],
      "Trash/Sewage": [],
      "Phone": []
    },
    //... (continue for all categories)
  },
  "Non-Essential Categories": {
    "Entertainment": {
      "Movies & Theaters": [],
      "Concerts & Events": [],
      "Streaming Services": [],
      "Books & Magazines": []
    },
    //... (continue for all non-essential categories)
  }
}

// Replace the separate names and descriptions with a single dictionary
const namesList = ["1", "2", "3", "4", "5"];

const SelectOptions = () => {
  return (
    <div>
      <h2>Select Options</h2>
      <FoldableList data={expenseDictionary} namesList={namesList} />
    </div>
  );
};

export default SelectOptions;
