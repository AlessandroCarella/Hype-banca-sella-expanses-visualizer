export const initializeOpenItems = (data, isArray) => {
    if (isArray) {
        return Object.keys(data || {}).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
        );
    }
    return {};
};
