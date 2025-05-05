import { useLoader } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import React, { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function City() {
    const city = useLoader(GLTFLoader, '/Assets/track/track.glb');
    const meshesRef = useRef([]);

    useEffect(() => {
        // Collect all meshes from the scene
        city.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
                meshesRef.current.push(child);
            }
        });
    }, [city]);

    return (
        <RigidBody 
            type="fixed" 
            colliders="trimesh"
            position={[0, 100.1, 0]} 
            rotation={[0, 0, 0]}
            // activeCollisionTypes={0}
            // contactSkin={0.1}
            friction={1}
            restitution={0}
            canSleep={false}
        >
            <primitive object={city.scene} scale={.1} receiveShadow />
        </RigidBody>
    );
}

export default React.memo(City)