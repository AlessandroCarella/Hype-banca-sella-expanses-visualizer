export const isLastItem = (value) =>
    typeof value !== "object" || Object.keys(value).length === 0;

export const initializeOpenItems = (data, isInnermost) => {
    if (isInnermost) {
        return Object.keys(data).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
        );
    }
    return {};
};

export const updateSelections = (key, selectedOption, selections, selectedOptions) => {
    let updatedSelections = { ...selections };
    let updatedSelectedOptions = [...selectedOptions];

    if (selectedOption === "Free") {
        const { [key]: removed, ...rest } = updatedSelections;
        updatedSelections = rest;
        updatedSelectedOptions = updatedSelectedOptions.filter((option) => option !== selections[key]);
    } else {
        updatedSelections[key] = selectedOption;
        updatedSelectedOptions = [
            ...updatedSelectedOptions.filter((option) => option !== selections[key]),
            selectedOption,
        ];
    }

    return { updatedSelections, updatedSelectedOptions };
};

export const updateData = (key, selectedOption, data) => {
    let updatedData = { ...data };
    
    if (selectedOption === "Free") {
        delete updatedData[key];
    } else {
        updatedData[key] = selectedOption;
    }

    return updatedData;
};
