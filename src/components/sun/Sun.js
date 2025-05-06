import { RigidBody } from '@react-three/rapier';

// Planet component representing the central gravitational body
function Sun() {
    return (
      <RigidBody type="fixed" colliders="ball" position={[-200, 150, -300]}>
        <mesh>
          <sphereGeometry args={[20, 64, 64]} />
          <meshStandardMaterial color="teal" />
        </mesh>
      </RigidBody>
    );
  }

export default Sun;