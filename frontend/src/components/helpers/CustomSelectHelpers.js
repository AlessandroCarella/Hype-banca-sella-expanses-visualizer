export const handleClickOutside = (ref, callback) => {
    const handleClick = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            callback();
        }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
        document.removeEventListener("mousedown", handleClick);
    };
};

export const renderOptions = (options, disabled, onSelect, selectedValues, allSelectedOptions) => {
    const sortedOptions = sortOptions(options, allSelectedOptions);

    return sortedOptions.map(option => (
        <li
            key={option}
            onClick={() => onSelect(option)}
            className={getOptionClassName(option, disabled, selectedValues)}
        >
            {option}
        </li>
    ));
};

export const sortOptions = (options, allSelectedOptions) => {
    return [...options].sort((a, b) => {
        const aSelected = allSelectedOptions.includes(a);
        const bSelected = allSelectedOptions.includes(b);
        if (aSelected === bSelected) return 0;
        return aSelected ? 1 : -1;
    });
};

export const getOptionClassName = (option, disabled, selectedValues) => {
    return `
        ${disabled.includes(option) ? "disabled" : ""}
        ${selectedValues.includes(option) ? "selected" : ""}
    `;
};

export const calculatePosition = (element) => {
    const rect = element.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    
    if (spaceAbove > spaceBelow) {
        return { top: 'auto', bottom: '100%' };
    } else {
        return { top: '100%', bottom: 'auto' };
    }
};

export const toggleOption = (option, value) => {
    const newValue = Array.isArray(value) ? [...value] : [];
    const index = newValue.indexOf(option);
    if (index === -1) {
        newValue.push(option);
    } else {
        newValue.splice(index, 1);
    }
    return newValue;
};
