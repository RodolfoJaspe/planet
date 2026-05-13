const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

const players = {};

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    // Send existing players to the newly connected player
    socket.emit('players:init', players);

    // Notify others a new player joined
    socket.broadcast.emit('player:joined', { id: socket.id });

    // Receive position/rotation updates and broadcast to everyone else
    socket.on('player:update', (data) => {
        players[socket.id] = { ...data, id: socket.id };
        socket.broadcast.emit('player:update', players[socket.id]);
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        delete players[socket.id];
        io.emit('player:left', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
