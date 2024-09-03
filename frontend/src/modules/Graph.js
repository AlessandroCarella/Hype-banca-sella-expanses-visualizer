import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as d3 from 'd3';

function Graphs() {
    const location = useLocation();
    const processedData = location.state?.processedData;

    return (
        <div>
            <h1>Graphs</h1>
            {/* Add your graph components here */}
            <pre>{JSON.stringify(processedData, null, 2)}</pre>
        </div>
    );
}

export default Graphs;