var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log("A User Connected.");
  //check for 'chat message' events
  socket.on('chat message', function(msg) {
    //emit that message to all the users connect to the database
    io.emit('chat message', msg);
    //log the message in node console
    console.log('message: ' + msg);
  });
  socket.on('disconnect', function() {
    console.log('user disconnected..');
  });
});

http.listen(3000, function() {
  console.log('listening on port 3000');
});