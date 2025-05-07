import { useLoader } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


// Planet component representing the central gravitational body
function Eiffel() {
    const gltf = useLoader(GLTFLoader, '/Assets/pyramid/scene.glb');


    return (
      <RigidBody 
        type="fixed" 
        colliders="trimesh" 
        position={[20, 81.5, 50]} 
        rotation={[.55, 0, -.2]}
        friction={1}
        restitution={0}
      >
        <primitive object={gltf.scene} scale={.005} castShadow receiveShadow />
      </RigidBody>
    );
}

export default Eiffel;