/**
 * Simple Express server with Socket.io for testing
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST', 'OPTIONS'],
		credentials: true
	}
});

// Define routes
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'socket-test.html'));
});

app.get('/api/test', (req, res) => {
	console.log('Test endpoint called');
	res.json({
		message: 'Test endpoint working',
		timestamp: new Date().toISOString(),
		cors: 'enabled',
		server: 'running'
	});
});

// Socket.io connection handling
io.on('connection', (socket) => {
	console.log(`Client connected: ${socket.id}`);

	// Send a welcome message
	socket.emit('welcome', { message: 'Welcome to the server!' });

	// Handle disconnection
	socket.on('disconnect', (reason) => {
		console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
	});

	// Echo any message back to the client
	socket.on('message', (data) => {
		console.log(`Received message from ${socket.id}:`, data);
		socket.emit('message', {
			echo: data,
			timestamp: new Date().toISOString()
		});
	});
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
	console.log(`Socket.io server ready for connections`);
});
