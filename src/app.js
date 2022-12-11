const express = require('express');
const cors = require('cors')();


const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('sendMessage', (msg) => {
        console.log(msg);

      socket.emit('nuovoMessagio', msg);
      socket.broadcast.emit('nuovoMessagio', msg);

    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});