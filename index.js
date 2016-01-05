var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

var uniqueId = 0;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

//on connect
io.on('connection', function(socket) {
  
  console.log("A User Connected.");
  
  socket.on('chat message', function(data) {
    data.uniqueId = uniqueId;
    uniqueId++;
    io.emit('chat message', data);
    console.log('message: ' + data);
  });
  
  socket.on('disconnect', function() {
    console.log('user disconnected..');
  });
  
});

http.listen(port, function() {
  console.log('listening on port ', port);
});