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

export const renderOptions = (options, disabled, onSelect, selectedValues) => {
    return options.map((option) => (
        <li
            key={option}
            onClick={() => onSelect(option)}
            className={`
                ${disabled.includes(option) ? "disabled" : ""}
                ${selectedValues && selectedValues.includes(option) ? "selected" : ""}
            `}
        >
            {option}
        </li>
    ));
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
