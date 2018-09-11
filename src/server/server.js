const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let lobby = {};

io.on('connection', socket => {

    let id = socket.id;
    let name;

    console.log`connected: ${id}`;

    socket.on('console',console.log);

    socket.on('login',username => {
        if (lobby[username] == null) {
            name = username;
            lobby[username] = id;
            socket.emit('page', 'lobby');
            for (let user in lobby)
                io.to(lobby[user]).emit('lobby', lobby);
        }
    });

    socket.on('get_name', () => socket.emit('get_name', name));

    socket.on('chat', msg => {
        for (let i in lobby) {
            io.to(lobby[i]).emit('chat', name + ': ' +  msg);
        }
    });

    socket.on('play', userId => {
        console.log(userId);
        socket.emit('page','game');
    });

});



server.listen(port, () => console.log`listening on ${port}`);