import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import React, { useState } from 'react';
import Car from './components/car/Car';
import City from './components/city/City';
import Mute from './components/dom_elements/Mute';
import Planet from './components/planet/Planet';
import Eiffel from './components/structures/Eiffel';
import Pyramid from './components/structures/Pyramid';
import Sun from './components/sun/Sun';
import { CameraStateProvider } from './state/CameraStateContext';

import Town from './components/structures/Town';
function Scene({isMuted, setIsMuted}) {
    const [orbitEnabled, setOrbitEnabled] = useState(true);
    const [carPosition, setCarPosition] = useState([0, 50, 0]);
    const { camera } = useThree();
    return (
        <>
            <PerspectiveCamera
                    makeDefault
                    // position={[0, -100, 0]}
                    fov={90}
                    near={.1}
                    far={1000}
                />
            <ambientLight intensity={.4} color="pink"/>
            <directionalLight
                    position={[0, 100, -100]}
                    intensity={5}
                    color={"pink"}
            />

            
            <Physics gravity={[0, 0, 0]}>
            <Planet />
            <City />
            <Sun />
            <Eiffel />
            <Pyramid />
            <Town />
            <Car 
                setOrbitEnabled={setOrbitEnabled} 
                setCarPosition={setCarPosition} 
                camera={camera} 
                isMuted={isMuted}
                setIsMuted={setIsMuted}
            />
            </Physics>
            {orbitEnabled && 
            <OrbitControls 
                enableDamping 
                dampingFactor={0.01}
                rotateSpeed={0.5} 
                target={carPosition} 
                maxDistance={800} 
                minDistance={.5}/>}

        </>       
    )   
}
// Main App component
function App() {
    const [isMuted, setIsMuted] = useState(false);
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'brown' }}>
        <CameraStateProvider>
            <Canvas>
                <Scene isMuted={isMuted} setIsMuted={setIsMuted}/>
            </Canvas>
            <Mute isMuted={isMuted} setIsMuted={setIsMuted} />
        </CameraStateProvider>
    </div>
  );
}

export default App;
