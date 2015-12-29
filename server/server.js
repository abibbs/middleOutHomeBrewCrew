var express = require('express');
var app = express();
var socketServer = require('http').createServer(app);
var io = require('socket.io')(socketServer);
var path = require('path');
var people = {};

app.use(express.static(__dirname + './../client'));

socketServer.listen((process.env.PORT || 3000), function() {
  var host = socketServer.address().address;
  var port = socketServer.address().port;

  console.log('App launched and hosting at http://%s:%s',host,port);
});

// create socket.io connection
io.on('connection', function(socket) {

  socket.on('join', function(name) {
    people[socket.id] = name;
    socket.emit('update','You have connected to the server');
    io.emit('update', name + ' has joined the server.');
    io.emit('update-people', people);
    console.log(people[socket.id] + ' has connected!');
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', people[socket.id], msg);
    console.log(people[socket.id] + ': ' + msg);
  });

  socket.on('disconnect', function() {
    io.emit('update', people[socket.id] + ' has left the server.');
    delete people[socket.id];
    io.emit('update-people',people);
    console.log(people[socket.id] || socket.id + ' has disconnected!');
  });

  socket.on('url submit', function(url){
    io.emit('url submit', url);
    console.log(people[socket.id] + ' has submitted a URL: ', url);
  });

});


