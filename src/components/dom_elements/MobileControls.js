import React from 'react';
import './MobileControls.css';

const dispatch = (key, type) => {
    window.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true }));
};

const ControlButton = ({ label, keyName, className }) => {
    const start = (e) => { e.preventDefault(); dispatch(keyName, 'keydown'); };
    const end   = (e) => { e.preventDefault(); dispatch(keyName, 'keyup'); };
    return (
        <button
            className={`mobile-btn ${className}`}
            onTouchStart={start}
            onTouchEnd={end}
            onTouchCancel={end}
            onMouseDown={start}
            onMouseUp={end}
            onMouseLeave={end}
        >
            {label}
        </button>
    );
};

export default function MobileControls() {
    return (
        <div className="mobile-controls">
            <div className="mobile-group mobile-group-left">
                <ControlButton label="▲" keyName="w" className="" />
                <ControlButton label="▼" keyName="s" className="" />
            </div>
            <div className="mobile-group mobile-group-right">
                <ControlButton label="◀" keyName="a" className="" />
                <ControlButton label="▶" keyName="d" className="" />
            </div>
        </div>
    );
}
