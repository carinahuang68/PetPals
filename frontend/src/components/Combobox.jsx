import React, { useState, useRef, useEffect } from 'react';
import './Combobox.css';

const Combobox = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionClick = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="combobox-container" ref={containerRef}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className="combobox-input"
            />
            {isOpen && (
                <ul className="combobox-dropdown">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className="combobox-option"
                        >
                            {option}
                        </li>
                    ))}
                    {value && !options.includes(value) && (
                        <li className="combobox-option custom-value">
                            Using custom: "{value}"
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Combobox;
