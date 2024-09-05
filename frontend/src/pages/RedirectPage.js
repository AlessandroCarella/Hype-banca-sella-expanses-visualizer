import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectPage = () => {
    const mainPage = "/select-options";

    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to /select-options after component mounts
        navigate(mainPage);
    }, [navigate]);

    return null; // No UI to render
};

export default RedirectPage;
