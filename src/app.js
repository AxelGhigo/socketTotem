const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const newObj = {
  "head": ["priorità", "type", "number", "data", "room", "stato"],
  "body": [[{ "value": "alta" }, { "png": "sedia", "class": "type" }, { "value": "NP001", "color": "red", "class": "standard" }, { "value": "9 ago 17:15" }, { "value": "Piano terra" }, { "value": "Chiamato", "class": "blink " }],
  [{ "value": "alta" }, "", { "value": "NP002", "color": "red", "class": "standard" }, { "value": "9 ago 17:15" }, { "value": "Piano terra" }, { "value": "Chiamato", "class": "blink " }],
  [{ "value": "bassa" }, { "value": "" }, { "value": "NP003", "color": "green", "class": "standard" }, { "value": "9 ago 17:15" }, { "value": "Piano terra" }, { "value": "Chiamato", "class": "blink " }],
  [{ "value": "media" }, "", { "value": "NP004", "color": "orange", "class": "standard" }, { "value": "9 ago 17:15" }, { "value": "Piano terra" }, { "value": "Chiamato", "class": "blink " }],
  [{ "value": "media" }, "", { "value": "NP005", "color": "", "class": "standard" }, { "value": "9 ago 17:15" }, { "value": "Piano terra" }, { "value": "Chiamato", "class": "blink " }]]
}


const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ["https://corso-angular-f932b.web.app"]
  }
});

app.get('/', (req, res) => {
  res.write(`<h1>Socket IO start on ${PORT}</h1>`)
  res.end()
})


let user = []

io.on('connection', async (socket) => {
  console.log('a user connected ' + socket.id);

  io.emit('user', user)

  //aggiungere id tabelloni
  socket.on('type', (e) => {
    if (e !== 'totem') {
      user.push({ 'user': socket.id, 'tab': newObj })

      io.emit('user', user)
    }
  })

  console.log("user: ", user);

  //popup
  socket.on('sendpopup', (msg) => {
    console.log("PopUp: ", msg);
    io.emit('popup', {
      awaitTime: 4000,
      data: msg

    });


  });
  //invio tab selezionato
  socket.on('takeSelectedtab', (t) => {
    socket.emit('sendSelecetedTab', user[user.findIndex((e) => e.user === t.user)])
  })

  //lista
  socket.emit('Messagio', newObj)


  socket.on("newMsg", ({ head, body, selectedTab }) => {
    console.log(user)
    user[user.findIndex((e) => e.user === selectedTab)].tab = { head, body }
    io.to(selectedTab).emit('Messagio', { head, body })
  })

  socket.on('disconnect', () => {
    console.log('user disconnected ' + socket.id);
    user.splice(user.findIndex((e) => e.user === socket.id), 1)
    io.emit('user', user)
    console.log(user)
  });
});

http.listen(PORT, () => {
  console.log('listening on *:3000');
});