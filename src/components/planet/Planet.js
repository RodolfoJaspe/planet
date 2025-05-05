import { RigidBody } from '@react-three/rapier';

// Planet component representing the central gravitational body
function Planet() {
    return (
      <RigidBody type="fixed" colliders="ball">
        <mesh>
          <sphereGeometry args={[100, 64, 64]} />
          <meshStandardMaterial color="pink" />
        </mesh>
      </RigidBody>
    );
  }

export default Planet;