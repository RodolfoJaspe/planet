import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import React, { useState } from 'react';
import Car from './components/car/Car';
import City from './components/city/City';
import Mute from './components/dom_elements/Mute';
import Planet from './components/planet/Planet';
import Sun from './components/sun/Sun';
import { CameraStateProvider } from './state/CameraStateContext';

function Scene({isMuted, setIsMuted}) {
    const [orbitEnabled, setOrbitEnabled] = useState(true);
    const [carPosition, setCarPosition] = useState([0, 50, 0]);
    const { camera } = useThree();
    return (
        <>
            <PerspectiveCamera
                    makeDefault
                    position={[100, 100, 100]}
                    fov={75}
                    near={.1}
                    far={1000}
                    direction={[0,0,0]}
                />
            <ambientLight intensity={1} color="white"/>
            <directionalLight
                    position={[50, 200, 50]}
                    intensity={2}
                    color={"lightyellow"}
            />
            
            <Physics gravity={[0, 0, 0]}>
            <Planet />
            <City />
            <Sun />
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
                dampingFactor={0.1}
                rotateSpeed={0.5} 
                target={carPosition} 
                maxDistance={100} 
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
