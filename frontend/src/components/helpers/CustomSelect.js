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
