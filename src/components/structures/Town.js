import { useLoader } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


// Planet component representing the central gravitational body
function Eiffel() {
    const gltf = useLoader(GLTFLoader, '/Assets/town/scene.glb');


    return (
      <RigidBody 
        type="fixed" 
        colliders="trimesh" 
        position={[ -52, 84.6, -10]} 
        rotation={[ -.15, 0, .52]}
        friction={1}
        restitution={0}
      >
        <primitive object={gltf.scene} scale={.4} castShadow receiveShadow />
      </RigidBody>
    );
}

export default Eiffel;