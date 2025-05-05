import React, { createContext, useContext, useState } from 'react';

const ResetStateContext = createContext();

export const ResetStateProvider = ({ children }) => {
    const [resetTrigger, setResetTrigger] = useState(false);

    const triggerReset = () => {
        setResetTrigger(prev => !prev);
    };

    return (
        <ResetStateContext.Provider value={{ resetTrigger, triggerReset }}>
            {children}
        </ResetStateContext.Provider>
    );
};

export const useResetState = () => {
    const context = useContext(ResetStateContext);
    if (!context) {
        throw new Error('useResetState must be used within a ResetStateProvider');
    }
    return context;
}; 