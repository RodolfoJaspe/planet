import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const CarSounds = ({ acceleration, speed, isMuted, setIsMuted }) => {
    const audioListener = useRef(new THREE.AudioListener());
    const engineSound = useRef(new THREE.Audio(audioListener.current));
    const audioLoader = useRef(new THREE.AudioLoader());
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const currentPitch = useRef(0.5); // Start with idle pitch

    const IDLE_PITCH = 0.5;
    const ACCEL_PITCH = 1;
    const PITCH_CHANGE_SPEED = 0.1; // How fast the pitch changes

    // Track key states
    const keys = useRef({
        w: false,
        s: false,
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

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [keys]);

    const calculatePitch = () => {
        // Check if either w or s is pressed
        const isAccelerating = keys.w || keys.s;
        
        // Smoothly interpolate between idle and acceleration pitch
        const targetPitch = isAccelerating ? ACCEL_PITCH : IDLE_PITCH;
        currentPitch.current = THREE.MathUtils.lerp(
            currentPitch.current,
            targetPitch,
            PITCH_CHANGE_SPEED
        );
        return currentPitch.current;
    };

    useEffect(() => {
        console.log('Attempting to load engine sound...');
        
        // Load engine sound
        audioLoader.current.load(
            '/Assets/sounds/engine.mp3',
            (buffer) => {
                console.log('Engine sound loaded successfully');
                engineSound.current.setBuffer(buffer);
                engineSound.current.setLoop(true);
                engineSound.current.setVolume(isMuted ? 0 : 5.0);
                
                // Try to play sound after user interaction
                const handleFirstInteraction = () => {
                    try {
                        engineSound.current.play();
                        console.log('Engine sound started playing');
                        setIsSoundEnabled(true);
                    } catch (error) {
                        console.error('Error playing engine sound:', error);
                    }
                    document.removeEventListener('click', handleFirstInteraction);
                    document.removeEventListener('keydown', handleFirstInteraction);
                };

                document.addEventListener('click', handleFirstInteraction);
                document.addEventListener('keydown', handleFirstInteraction);
            },
            (xhr) => {
                console.log('Loading progress:', (xhr.loaded / xhr.total) * 100 + '%');
            },
            (error) => {
                console.error('Error loading engine sound:', error);
            }
        );

        return () => {
            console.log('Cleaning up engine sound');
            if (engineSound.current) {
                engineSound.current.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (engineSound.current.isPlaying) {
            // Set pitch based on key states with smooth transition
            const pitch = calculatePitch();
            engineSound.current.setPlaybackRate(pitch);

            // Adjust volume based on acceleration and mute state
            if (!isMuted) {
                const volume = 2.0 + Math.abs(acceleration) / 10;
                engineSound.current.setVolume(Math.max(2.0, Math.min(10.0, volume)));
            } else {
                engineSound.current.setVolume(0);
            }
        }
    }, [acceleration, speed, isMuted]);

    return null;
};

export default CarSounds; 