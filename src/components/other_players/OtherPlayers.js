import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { useMultiplayer } from '../../state/MultiplayerContext';

const OtherRider = ({ data }) => {
    const gl = useThree((state) => state.gl);
    const { scene } = useGLTF(
        '/Assets/rider/rider_smaller.glb',
        undefined,
        undefined,
        (loader) => {
            const ktx2loader = new KTX2Loader();
            ktx2loader.setTranscoderPath(
                "https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/"
            );
            ktx2loader.detectSupport(gl);
            loader.setKTX2Loader(ktx2loader);
        }
    );

    if (!data.position || !data.quaternion) return null;

    return (
        <primitive
            object={scene.clone()}
            position={[data.position.x, data.position.y, data.position.z]}
            quaternion={[data.quaternion.x, data.quaternion.y, data.quaternion.z, data.quaternion.w]}
            scale={0.2}
            castShadow
        />
    );
};

export default function OtherPlayers() {
    const { otherPlayers } = useMultiplayer();

    return (
        <>
            {Object.values(otherPlayers).map((data) => (
                <OtherRider key={data.id} data={data} />
            ))}
        </>
    );
}
