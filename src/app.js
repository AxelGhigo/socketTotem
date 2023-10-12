const express = require('express');
const cors = require('cors')();

const newObj = {
  "head": ["priorità", "type", "number", "data", "room", "stato"],
  "body": [[{ "value": "alta" }, { "png": "sedia", "class": "type" }, { "value": "NP001", "color": "red", "class": "standard" }, { "value": "9 ago 17:15" }, { "value": "Piano terra" }, { "value": "Chiamato", "class": "blink " }],
  [{ "value": "alta" }, "", { "value": "NP002", "color": "red", "class": "standard" }, { "value": "9 ago 17:15" }, { "value": "Piano terra" }, { "value": "Chiamato", "class": "blink " }],
  [{ "value": "bassa" }, { "value": "" }, { "value": "NP003", "color": "green", "class": "standard" }, { "value": "9 ago 17:15" }, { "value": "Piano terra" }, { "value": "Chiamato", "class": "blink " }],
  [{ "value": "media" }, "", { "value": "NP004", "color": "orange", "class": "standard" }, { "value": "9 ago 17:15" }, { "value": "Piano terra" }, { "value": "Chiamato", "class": "blink " }],
  [{ "value": "media" }, "", { "value": "NP005", "color": "", "class": "standard" }, { "value": "9 ago 17:15" }, { "value": "Piano terra" }, { "value": "Chiamato", "class": "blink " }]]
}

const config = {
  numCollum: 3
}


const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*'
  }
});


let user = []

io.on('connection', async (socket) => {
  console.log('a user connected ' + socket.id);

  io.emit('user', user)

  //aggiungere id tabelloni
  socket.on('type', (e) => {
    if (e !== 'totem') {
      user.push(socket.id)

      io.emit('user', user)
    }
  })

  //popup
  socket.on('sendpopup', (msg) => {
    console.log(msg);
    io.emit('popup', {
      awaitTime: 4000,
      data: msg

    });
  });


  //lista
  socket.emit('Messagio', newObj)

  //config
  socket.emit('configurazioni', config)

  socket.on('disconnect', () => {
    console.log('user disconnected ' + socket.id);
    user.splice(user.indexOf(socket.id), 1)
    io.emit('user', user)
    console.log(user)
  });

  socket.on("newMsg", (msg) => {
    io.to(msg.selectedTab).emit('Messagio', msg)
  })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});