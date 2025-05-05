import React, { createContext, useContext, useState } from 'react';

const CameraStateContext = createContext();

export const CameraStateProvider = ({ children }) => {
    const [cameraState, setCameraState] = useState({
        position: [0, 0, 100],
        direction: [0,0,0],
        followingCar: true
    });

    return (
        <CameraStateContext.Provider value={{ cameraState, setCameraState }}>
            {children}
        </CameraStateContext.Provider>
    );
};

export const useCameraState = () => useContext(CameraStateContext);