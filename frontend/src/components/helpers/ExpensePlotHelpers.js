import * as d3 from "d3";
import { renderMonthView } from './ExpensePlotMonthView';
import { renderYearView } from './ExpensePlotYearView';

export const generateShade = (baseColor, index, total) => {
    if (!baseColor) {
        //console.warn(`Missing color for supercategory. Using default.`);
        return "#FF0000"; // Return a default color
    }
    const color = d3.color(baseColor);
    if (!color) {
        //console.warn(`Invalid color: ${baseColor}. Using default.`);
        return "#FF0000"; // Return a default color
    }
    const lightenFactor = 0.1 + (index / total) * 1;
    return color.brighter(lightenFactor);
};

export const loadSupercategoryColors = async () => {
    const response = await fetch("/api/get-supercategory-colors");
    const data = await response.json();
    return data;
};

export { renderMonthView, renderYearView };