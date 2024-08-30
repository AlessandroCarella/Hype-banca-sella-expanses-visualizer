import { initColorModeSwitch } from "./modules/colorMode.js";

const csvFile = "data/x.csv";

// Promise.all([d3.csv(csvFile)])
//     .then(([data]) => {
//         // data
//     })
//     .catch((error) => console.error("Error loading the data:", error));

initColorModeSwitch();
