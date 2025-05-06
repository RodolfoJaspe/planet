import { useFrame, useLoader } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Sound from './Sound';
const Car = ({setOrbitEnabled, setCarPosition, camera, isMuted, setIsMuted}) => {

    const gltf = useLoader(GLTFLoader, '/Assets/rider/scene.glb');
    const planetCenter = [0, 0, 0];
    const rigidBodyRef = useRef();
    
    // Movement parameters
    const moveForce = 0.001; // Reduced force for more controlled movement
    const turnForce = 0.0001; // Reduced force for more controlled turning
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const minSpeedForCameraFollow = 1.5; // Minimum speed to trigger camera follow
    const [hasStartedMoving, setHasStartedMoving] = useState(false);
    const [initialCameraSetup, setInitialCameraSetup] = useState(false);

    // Vectors for movement calculations
    const forward = useRef(new THREE.Vector3());
    const right = useRef(new THREE.Vector3());
    const up = useRef(new THREE.Vector3());
    const down = useRef(new THREE.Vector3());

    // Camera parameters
    const cameraOffset = new THREE.Vector3(0, 0.4, .5); // Camera position relative to car
    const cameraLookOffset = new THREE.Vector3(0, 0, 2); // Point camera looks at relative to car

    const keys = useRef({
        w: false,
        s: false,
        a: false,
        d: false,
    }).current;

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (keys[event.key.toLowerCase()] !== undefined) {
                keys[event.key.toLowerCase()] = true;
            }
        };

        const handleKeyUp = (event) => {
            if (keys[event.key.toLowerCase()] !== undefined) {
                keys[event.key.toLowerCase()] = false;
            }
        };

        // Set initial camera position
        if (camera && !initialCameraSetup) {
            camera.position.set(0, -1000, 0);
            camera.lookAt(0, 0, 0);
            setInitialCameraSetup(true);
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [keys, camera, initialCameraSetup]);

    useFrame(() => {
        if (!rigidBodyRef.current) return;
    
        const currentPosition = rigidBodyRef.current.translation();
        
        // Calculate direction to planet center (down vector)
        down.current.set(
            planetCenter[0] - currentPosition.x,
            planetCenter[1] - currentPosition.y,
            planetCenter[2] - currentPosition.z
        ).normalize();
        
        // Get the car's current rotation
        const rotation = rigidBodyRef.current.rotation();
        const quaternion = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
        
        // Calculate forward vector based on current rotation
        forward.current.set(0, 0, 1).applyQuaternion(quaternion);
        
        // Calculate right vector
        right.current.crossVectors(forward.current, down.current).normalize();
        
        // Recalculate forward vector to be perpendicular to both right and down
        forward.current.crossVectors(down.current, right.current).normalize();
        
        // Calculate up vector (opposite of down)
        up.current.copy(down.current).negate();

        // Calculate current speed based on velocity
        const velocity = rigidBodyRef.current.linvel();
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
        setCurrentSpeed(speed);

        // Update hasStartedMoving state only if we've moved significantly
        if (speed > 0.5 && !hasStartedMoving) {
            setHasStartedMoving(true);
        }

        // Apply movement force
        if (keys.w || keys.s) {
            const force = new THREE.Vector3();
            const direction = keys.w ? 1 : -1;
            force.copy(forward.current).multiplyScalar(moveForce * direction);
            rigidBodyRef.current.applyImpulse(force, true);
        }

        // Apply turning torque
        if (keys.a || keys.d) {
            const torque = new THREE.Vector3();
            // Flip direction when reversing
            const direction = keys.s ? (keys.a ? -1 : 1) : (keys.a ? 1 : -1);
            const turnSpeed = Math.min(currentSpeed, 1) * turnForce;
            torque.copy(up.current).multiplyScalar(turnSpeed * direction);
            rigidBodyRef.current.applyTorqueImpulse(torque, true);
        }

        // Apply gravitational force
        const gravityForce = down.current.clone().multiplyScalar(0.0005);
        // Reduce gravity when moving forward
        if (keys.w || keys.s) {
            gravityForce.multiplyScalar(-.01); // Adjust this value to control gravity reduction
        }
        rigidBodyRef.current.applyImpulse(gravityForce, true);

        // Calculate target rotation to keep car upright
        const targetQuaternion = new THREE.Quaternion();
        const rotationMatrix = new THREE.Matrix4();
        
        // Add tilt based on turning
        let tiltAngle = 0;
        if (keys.a) {
            // Flip tilt direction when reversing
            tiltAngle = keys.s ? -0.3 : 0.3; // Tilt right when turning left (forward), left when turning left (reverse)
        } else if (keys.d) {
            // Flip tilt direction when reversing
            tiltAngle = keys.s ? 0.3 : -0.3; // Tilt left when turning right (forward), right when turning right (reverse)
        }
        
        // Create a rotation matrix for the tilt using the car's right vector
        const tiltMatrix = new THREE.Matrix4().makeRotationAxis(right.current, tiltAngle);
        
        // Set up the rotation matrix using our calculated vectors
        rotationMatrix.makeBasis(right.current, up.current, forward.current);
        // Apply the tilt
        rotationMatrix.multiply(tiltMatrix);
        
        targetQuaternion.setFromRotationMatrix(rotationMatrix);
        
        // Smoothly interpolate current rotation to target
        const currentRotation = rigidBodyRef.current.rotation();
        const currentQuaternion = new THREE.Quaternion(currentRotation.x, currentRotation.y, currentRotation.z, currentRotation.w);
        currentQuaternion.slerp(targetQuaternion, 0.1); // Adjust 0.1 to control rotation speed
        
        // Apply the new rotation
        rigidBodyRef.current.setRotation(currentQuaternion, true);

        // Update car position state
        setCarPosition([currentPosition.x, currentPosition.y, currentPosition.z]);

        // Handle camera following
        if (hasStartedMoving && currentSpeed > minSpeedForCameraFollow && initialCameraSetup) {
            // Determine if we're moving forward or backward
            const isReversing = keys.s;
            
            // Calculate camera position based on direction
            const cameraPosition = new THREE.Vector3();
            cameraPosition.copy(currentPosition)
                .add(forward.current.clone().multiplyScalar(isReversing ? cameraOffset.z : -cameraOffset.z))
                .add(up.current.clone().multiplyScalar(cameraOffset.y));

            // Calculate point for camera to look at
            const lookAtPoint = new THREE.Vector3();
            lookAtPoint.copy(currentPosition)
                .add(forward.current.clone().multiplyScalar(isReversing ? -cameraLookOffset.z : cameraLookOffset.z));

            // Calculate camera up vector based on planet surface normal
            const cameraUp = new THREE.Vector3();
            cameraUp.copy(up.current);

            // Smoothly move camera
            camera.position.lerp(cameraPosition, 0.1);
            camera.up.copy(cameraUp);
            camera.lookAt(lookAtPoint);
            
            // Disable orbit controls when following
            setOrbitEnabled(false);
        } else if (!hasStartedMoving) {
            // Keep camera at initial position if car hasn't started moving
            camera.position.set(0, -1000, 0);
            camera.lookAt(0, 0, 0);
            setOrbitEnabled(true);
        } else {
            // Re-enable orbit controls when car is slow
            setOrbitEnabled(true);
        }
    });

    return (
        <>
        <Sound acceleration={currentSpeed} speed={currentSpeed} isMuted={isMuted} setIsMuted={setIsMuted} />
        <RigidBody 
            type="dynamic" 
            position={[0, 80, 80]}
            rotation={[0, -2.5, 0]}
            colliders="cuboid" 
            mass={1000}
            linearDamping={0.5} 
            angularDamping={5} 
            // contactSkin={0.1}
            gravityScale={0}
            friction={0.1}
            restitution={0.2}
            ref={rigidBodyRef}
        >
            <primitive object={gltf.scene} scale={.2} castShadow receiveShadow/>
        </RigidBody>
        </>
    );
}

export default Car;