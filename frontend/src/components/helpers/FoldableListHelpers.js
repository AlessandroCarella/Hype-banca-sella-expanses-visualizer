export const initializeOpenItems = (data, isInnermost) => {
    if (isInnermost) {
        return Object.keys(data || {}).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
        );
    }
    return {};
};
