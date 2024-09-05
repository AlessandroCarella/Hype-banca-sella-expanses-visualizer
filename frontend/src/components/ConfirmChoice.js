import React from 'react';
import Button from './Button';

const ConfirmChoice = ({ message, onConfirm }) => {
    return (
        <div className="confirm-choice">
            <p>{message}</p>
            <div className="button-group">
                <Button onClick={() => onConfirm(true)}>Yes</Button>
                <Button onClick={() => onConfirm(false)}>No</Button>
            </div>
        </div>
    );
};

export default ConfirmChoice;