import React from "react";
import "bootstrap/dist/css/bootstrap.css";

function Button({ onClick, children, className = "", type = "button" }) {
    return (
        <button
            type={type}
            className={`btn button ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;
