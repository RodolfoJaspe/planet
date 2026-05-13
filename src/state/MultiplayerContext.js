import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const MultiplayerContext = createContext(null);

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';

export function MultiplayerProvider({ children }) {
    const socketRef = useRef(null);
    const [otherPlayers, setOtherPlayers] = useState({});

    useEffect(() => {
        const socket = io(SERVER_URL, { transports: ['websocket'] });
        socketRef.current = socket;

        socket.on('players:init', (players) => {
            setOtherPlayers(players);
        });

        socket.on('player:joined', ({ id }) => {
            setOtherPlayers((prev) => ({ ...prev, [id]: { id } }));
        });

        socket.on('player:update', (data) => {
            setOtherPlayers((prev) => ({ ...prev, [data.id]: data }));
        });

        socket.on('player:left', (id) => {
            setOtherPlayers((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        });

        return () => socket.disconnect();
    }, []);

    const emitUpdate = (position, quaternion) => {
        if (!socketRef.current) return;
        socketRef.current.emit('player:update', {
            position: { x: position.x, y: position.y, z: position.z },
            quaternion: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
        });
    };

    return (
        <MultiplayerContext.Provider value={{ otherPlayers, emitUpdate }}>
            {children}
        </MultiplayerContext.Provider>
    );
}

export function useMultiplayer() {
    return useContext(MultiplayerContext);
}
