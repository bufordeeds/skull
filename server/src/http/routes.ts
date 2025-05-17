import { RoomManager } from '../room/roomManager.ts';
import { logger } from '../utils/logger.ts';
import { GameState } from '../game/state.ts';

/**
 * Handles HTTP requests and routes them to the appropriate handler
 * @param req The HTTP request
 * @param roomManager The room manager instance
 * @returns Response object
 */
export async function handleHttpRequest(
	req: Request,
	roomManager: RoomManager
): Promise<Response> {
	const url = new URL(req.url);
	const path = url.pathname;
	const method = req.method;

	logger.info(`HTTP ${method} ${path}`);

	// Root path - Welcome page / API documentation
	if (path === '/' && method === 'GET') {
		return new Response(
			JSON.stringify({
				name: 'Skull Game API',
				version: '1.0.0',
				description: 'API for the Skull card game',
				endpoints: [
					{
						path: '/api/health',
						method: 'GET',
						description: 'Health check endpoint'
					},
					{
						path: '/api/rooms',
						method: 'GET',
						description: 'Get all rooms'
					},
					{
						path: '/api/rooms',
						method: 'POST',
						description: 'Create a new room'
					},
					{
						path: '/api/rooms/:roomCode',
						method: 'GET',
						description: 'Get room details'
					},
					{
						path: '/api/stats',
						method: 'GET',
						description: 'Get server stats'
					}
				]
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}

	// Health check endpoint
	if (path === '/api/health' && method === 'GET') {
		return new Response(
			JSON.stringify({
				status: 'ok',
				timestamp: new Date().toISOString()
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}

	// Get all rooms
	if (path === '/api/rooms' && method === 'GET') {
		const roomCodes = roomManager.getRoomCodes();
		const rooms = roomCodes.map((code) => {
			const gameState = roomManager.getRoom(code);
			return {
				code,
				playerCount: gameState ? gameState.players.size : 0,
				inProgress: gameState
					? gameState.gamePhase !== 'waiting'
					: false
			};
		});

		return new Response(JSON.stringify({ rooms }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	// Create a new room
	if (path === '/api/rooms' && method === 'POST') {
		try {
			const roomCode = roomManager.createRoom();
			return new Response(
				JSON.stringify({
					roomCode,
					message: 'Room created successfully'
				}),
				{
					status: 201,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		} catch (error) {
			return new Response(
				JSON.stringify({
					error: 'Failed to create room',
					message: error.message
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}
	}

	// Get room details
	if (path.match(/^\/api\/rooms\/[A-Z0-9]+$/) && method === 'GET') {
		const roomCode = path.split('/').pop() as string;

		if (!roomManager.roomExists(roomCode)) {
			return new Response(
				JSON.stringify({
					error: 'Room not found'
				}),
				{
					status: 404,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}

		const gameState = roomManager.getRoom(roomCode);
		if (!gameState) {
			return new Response(
				JSON.stringify({
					error: 'Failed to get game state'
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}

		// Return a sanitized version of the game state (without sensitive info)
		return new Response(
			JSON.stringify({
				roomCode,
				playerCount: gameState.players.size,
				phase: gameState.gamePhase,
				round: gameState.round
				// Add more fields as needed, but be careful not to expose sensitive info
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}

	// Get server stats
	if (path === '/api/stats' && method === 'GET') {
		const roomCodes = roomManager.getRoomCodes();
		let totalPlayers = 0;

		for (const code of roomCodes) {
			const gameState = roomManager.getRoom(code);
			if (gameState) {
				totalPlayers += gameState.players.size;
			}
		}

		const stats = {
			activeRooms: roomCodes.length,
			totalPlayers,
			serverTime: new Date().toISOString(),
			version: '1.0.0'
		};

		return new Response(JSON.stringify(stats), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	// If no route matches, return 404
	return new Response(
		JSON.stringify({
			error: 'Not found',
			message: `No endpoint found for ${method} ${path}`
		}),
		{
			status: 404,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}
