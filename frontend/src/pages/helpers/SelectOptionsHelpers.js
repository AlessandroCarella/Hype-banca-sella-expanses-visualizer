export const updateAvailableOptions = (data, namesData) => {
    const allSelectedNames = getAllSelectedNames(data);
    return namesData.filter(
        (name) => !allSelectedNames.includes(name)
    );
};

export const getAllSelectedNames = (data) => {
    const selectedNames = [];
    const traverse = (obj) => {
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                selectedNames.push(...obj[key]);
            } else if (typeof obj[key] === "object") {
                traverse(obj[key]);
            }
        }
    };
    traverse(data);
    return selectedNames;
};