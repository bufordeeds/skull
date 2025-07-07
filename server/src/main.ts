import { Server } from 'socket.io/mod.ts';
import { RoomManager } from 'room/roomManager.ts';
import { setupSocketHandlers } from 'socket/handlers.ts';
import { logger } from 'utils/logger.ts';
import { handleError } from 'utils/errors.ts';
import { handleHttpRequest } from './http/routes.ts';

// Use environment variable for port or default to 3000 (different from the original 8000)
const PORT = parseInt(Deno.env.get('PORT') || '3000');

logger.info(`Starting Skull game server on port ${PORT}...`);

// Create Socket.io server with more permissive options
const io = new Server({
	cors: {
		origin: [
			'*',
			'null',
			'file://',
			'http://localhost:8081',
			'http://localhost:8082',
			'http://192.168.1.68:8081',
			'http://192.168.1.68:8082'
		], // Allow all origins including null
		methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
	},
	// Add more options for better compatibility
	transports: ['websocket', 'polling'], // Match client configuration
	allowUpgrades: true,
	pingTimeout: 30000,
	pingInterval: 25000,
	connectTimeout: 30000,
	allowEIO3: true,
	path: '/socket.io/', // Explicitly set the path
	serveClient: false // Don't serve client files, client will use its own
});

// Initialize room manager
const roomManager = new RoomManager();

// Set up socket event handlers
setupSocketHandlers(io, roomManager);

// Create a handler that can process both HTTP and WebSocket requests
const handler = async (req: Request): Promise<Response> => {
	// Add CORS headers to all responses
	const corsHeaders = new Headers({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods':
			'GET, POST, OPTIONS, PUT, PATCH, DELETE',
		'Access-Control-Allow-Headers':
			'Content-Type, Authorization, X-Requested-With',
		'Access-Control-Allow-Credentials': 'true'
	});

	// Handle preflight OPTIONS request
	if (req.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: corsHeaders
		});
	}

	// Check if it's a WebSocket request (handled by Socket.io)
	const upgrade = req.headers.get('upgrade') || '';
	if (upgrade.toLowerCase() === 'websocket') {
		// For WebSocket requests, let Socket.io handle it
		return io.handler()(req);
	}

	// Otherwise, it's an HTTP request, handle with our routes
	const response = await handleHttpRequest(req, roomManager);

	// Add CORS headers to the response
	const newHeaders = new Headers(response.headers);
	corsHeaders.forEach((value, key) => {
		newHeaders.set(key, value);
	});

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: newHeaders
	});
};

// Start the server using Deno.serve() API
await Deno.serve(
	{
		port: PORT,
		onListen: ({ port, hostname }) => {
			logger.info(
				`Skull game server running at: http://${hostname}:${port}`
			);
			logger.info('Ready for WebSocket and HTTP connections');
		}
	},
	handler
);

// Add error handling for unhandled rejections
addEventListener('unhandledrejection', (event) => {
	logger.error('Unhandled Promise Rejection:', event.reason);
	logger.error(handleError(event.reason));
});

// Add error handling for uncaught exceptions
addEventListener('error', (event) => {
	logger.error('Uncaught Exception:', event.error);
	logger.error(handleError(event.error));
});
