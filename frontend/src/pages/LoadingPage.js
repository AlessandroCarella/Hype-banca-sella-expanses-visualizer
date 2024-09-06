import React, { useState, useEffect } from 'react';

const LoadingPage = () => {
    const [randomGif, setRandomGif] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/loading-gif')
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Network response was not ok: ${text}`);
                    });
                }
                return response.blob();
            })
            .then(blob => {
                const gifUrl = URL.createObjectURL(blob);
                setRandomGif(gifUrl);
            })
            .catch(error => {
                console.error('Error fetching loading GIF:', error);
                setError(error.message);
            });
    }, []);

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="loading-container">
            {randomGif && <img src={randomGif} alt="Loading" />}
        </div>
    );
};

export default LoadingPage;