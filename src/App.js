import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import React, { useState } from 'react';
import MobileControls from './components/dom_elements/MobileControls';
import Mute from './components/dom_elements/Mute';
import Moon from './components/moon/Moon';
import Planet from './components/planet/Planet';
import Rider from './components/rider/Rider';
import Eiffel from './components/structures/Eiffel';
import Pyramid from './components/structures/Pyramid';
import Track from './components/track/Track';
import { CameraStateProvider } from './state/CameraStateContext';
import { MultiplayerProvider } from './state/MultiplayerContext';
import OtherPlayers from './components/other_players/OtherPlayers';

import Town from './components/structures/Town';
function Scene({isMuted, setIsMuted}) {
    const [orbitEnabled, setOrbitEnabled] = useState(true);
    const [riderPosition, setRiderPosition] = useState([0, 50, 0]);
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
            <Track />
            <Moon />
            <Eiffel />
            <Pyramid />
            <Town />
            <OtherPlayers />
            <Rider
                setOrbitEnabled={setOrbitEnabled}
                setRiderPosition={setRiderPosition}
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
                target={riderPosition} 
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
        <MultiplayerProvider>
            <CameraStateProvider>
                <Canvas>
                    <Scene isMuted={isMuted} setIsMuted={setIsMuted}/>
                </Canvas>
                <Mute isMuted={isMuted} setIsMuted={setIsMuted} />
                <MobileControls />
            </CameraStateProvider>
        </MultiplayerProvider>
    </div>
  );
}

export default App;
