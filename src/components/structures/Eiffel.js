import { useLoader } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


// Planet component representing the central gravitational body
function Eiffel() {
    const gltf = useLoader(GLTFLoader, '/Assets/Eiffel/scene.glb');


    return (
      <RigidBody 
        type="fixed" 
        colliders="trimesh" 
        position={[0, 99.3, 0]} 
        rotation={[0, 0, 0]}
        friction={1}
        restitution={0}
      >
        <primitive object={gltf.scene} scale={10} castShadow receiveShadow />
      </RigidBody>
    );
}

export default Eiffel;