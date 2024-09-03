import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TextCapsule = ({ text, onClick, isSelected }) => {
  return (
    <div 
      onClick={onClick} 
      className={`
        px-3 py-2 rounded-pill cursor-pointer
        ${isSelected ? 'selected' : ''}
        text-capsule
      `}
    >
      {text}
    </div>
  );
};

export default TextCapsule;