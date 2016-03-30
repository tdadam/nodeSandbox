var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var bodyParser = require('body-parser');

// Configure for parsing JSON
app.use(bodyParser.urlencoded({	extended: true }));
app.use(bodyParser.json());

// Server or static directories
app.use('/', express.static(__dirname + '/client'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Api to get the current time in milliseconds
app.get('/api/time', function(req, res) {
	res.send({
		time: new Date().getTime()
	});
});

// Listen for websocket connections
io.on('connection', function(socket) {

	// Listen for mousemove websocket events from browsers
	socket.on('mousemove', function(data) {
		// Tell all listening browsers of new mouse move data
		io.sockets.emit('clientmousemove', data);

		// These two lines do the same thing
		// socket.emit('clientmousemove', data); // Tell only the sender of this event
		// socket.broadcast.emit('clientmousemove', data); // tell everyone but sender
	});

	socket.on('disconnect', function () {
		io.sockets.emit('playerleft', {
			id: socket.id
		});
	})
});

var port = '3000';
server.listen(port, function() {
	console.log('server started on port ' + port);
});
