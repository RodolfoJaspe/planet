import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CarSounds = ({ isMuted, camera }) => {
    const audioListener = useRef(new THREE.AudioListener());
    const engineSound = useRef(new THREE.Audio(audioListener.current));
    const audioLoader = useRef(new THREE.AudioLoader());
    const currentPitch = useRef(0.5);
    const currentVolume = useRef(0.0);
    const audioContextInitialized = useRef(false);

    const IDLE_PITCH = 0.5;
    const ACCEL_PITCH = 1.0;
    const IDLE_VOLUME = 0.4;
    const ACCEL_VOLUME = 0.9;
    const PITCH_LERP = 0.03;
    const VOLUME_LERP = 0.03;

    const keys = useRef({ w: false, s: false }).current;

    useEffect(() => {
        const handleKeyDown = (e) => { if (keys[e.key.toLowerCase()] !== undefined) keys[e.key.toLowerCase()] = true; };
        const handleKeyUp   = (e) => { if (keys[e.key.toLowerCase()] !== undefined) keys[e.key.toLowerCase()] = false; };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [keys]);

    useEffect(() => {
        if (!camera) return;

        const listener = audioListener.current;
        camera.add(listener);
        const sound = engineSound.current;

        const initAudio = () => {
            if (audioContextInitialized.current) return;
            const ctx = listener.context;
            if (ctx.state === 'suspended') ctx.resume();
            audioContextInitialized.current = true;
        };

        audioLoader.current.load(
            '/Assets/sounds/engine.mp3',
            (buffer) => {
                sound.setBuffer(buffer);
                sound.setLoop(true);
                sound.setVolume(0);

                const tryPlay = () => {
                    try { initAudio(); sound.play(); } catch (e) {}
                };
                document.addEventListener('click',      tryPlay, { once: true });
                document.addEventListener('touchstart', tryPlay, { once: true });
                document.addEventListener('keydown',    tryPlay, { once: true });
            },
            undefined,
            (e) => console.error('Error loading engine sound:', e)
        );

        const initOnInteraction = () => initAudio();
        document.addEventListener('click',      initOnInteraction);
        document.addEventListener('touchstart', initOnInteraction);

        return () => {
            sound.stop();
            camera.remove(listener);
            document.removeEventListener('click',      initOnInteraction);
            document.removeEventListener('touchstart', initOnInteraction);
        };
    }, [camera]);

    // Per-frame smooth audio updates — no React re-renders triggered
    useFrame(() => {
        const sound = engineSound.current;
        if (!sound.isPlaying) return;

        const isAccelerating = keys.w || keys.s;

        const targetPitch  = isAccelerating ? ACCEL_PITCH  : IDLE_PITCH;
        const targetVolume = isMuted ? 0 : (isAccelerating ? ACCEL_VOLUME : IDLE_VOLUME);

        currentPitch.current  = THREE.MathUtils.lerp(currentPitch.current,  targetPitch,  PITCH_LERP);
        currentVolume.current = THREE.MathUtils.lerp(currentVolume.current, targetVolume, VOLUME_LERP);

        sound.setPlaybackRate(currentPitch.current);
        sound.setVolume(currentVolume.current);
    });

    return null;
};

export default CarSounds; 