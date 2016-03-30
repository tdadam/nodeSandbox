'use strict';

//var socket = io.connect('http://10.0.112.166:3001' );
var socket = io.connect('http://localhost:3000' );

// Keep track of people; could also be an array
var people = {};
var color = '#' + Math.floor(Math.random() * 16777215).toString(16);

// Listen for mousemove events on the user's browser
document.addEventListener('mousemove', function(event) {
	socket.emit('mousemove', {
		id: socket.id,
		x: event.x,
		y: event.y,
		color: color
		//name: document.getElementById('name').value
	});
});

// listen for the time event from the server
socket.on('time', function(data) {
	document.getElementById('container').innerHTML = data.time;
});

// Listen for move events from the server
socket.on('clientmousemove', function(data) {
	people[data.id] = data;
});

socket.on('playerleft', function(data){
	delete people[data.id];
});


// setup canvas for drawing
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// draw all the things
function draw() {
	// clear drawing area
	ctx.clearRect(0, 0, 800, 800);

	// draw all people
	for (var id in people) {
		ctx.fillStyle = people[id].color;
		ctx.fillRect(people[id].x - 15, people[id].y - 15, 10, 10);
		ctx.fillText(people[id].id, people[id].x, people[id].y);
		//ctx.fillText(people[id].name, people[id].x, people[id].y);
	}

	window.requestAnimationFrame(draw);
}
// Call the draw() method on the next frame
window.requestAnimationFrame(draw);

// Helper method to make API call
function getJson(endpoint) {
	return window.fetch(endpoint).then(response => {
		return response.json()
	});
}
