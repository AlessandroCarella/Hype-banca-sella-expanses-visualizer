import React, { useState } from 'react';

const BulletListLookalikeFoldableList = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="foldable-list-item">
            <div className={`foldable-list-toggle ${isOpen ? 'open' : ''}`} onClick={toggleOpen}>
                <span className="toggle-text">Names to organize</span>
            </div>
            {isOpen && (
                <div className="foldable-list-content">
                    <ul className="bullet-list-lookalike-foldable-list-items">
                        {items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default BulletListLookalikeFoldableList;