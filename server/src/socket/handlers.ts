import { Server, Socket } from 'socket.io/mod.ts';
import { RoomManager } from 'room/roomManager.ts';
import { GameState } from 'game/state.ts';
import { logger } from 'utils/logger.ts';
import {
	ErrorCodes,
	RoomError,
	GameStateError,
	PlayerError,
	handleError
} from 'utils/errors.ts';

/**
 * Sets up all socket event handlers
 * @param io The Socket.io server
 * @param roomManager The room manager
 */
export function setupSocketHandlers(
	io: Server,
	roomManager: RoomManager
): void {
	io.on('connection', (socket: Socket) => {
		logger.info(`Client connected: ${socket.id}`);

		// Room management events
		setupRoomEvents(socket, io, roomManager);

		// Game events
		setupGameEvents(socket, io, roomManager);

		// Disconnection handling
		socket.on('disconnect', () => {
			handleDisconnect(socket, io, roomManager);
		});
	});
}

/**
 * Sets up room-related socket events
 * @param socket The client socket
 * @param io The Socket.io server
 * @param roomManager The room manager
 */
function setupRoomEvents(
	socket: Socket,
	io: Server,
	roomManager: RoomManager
): void {
	// Create a new room
	socket.on('create_room', () => {
		try {
			const roomCode = roomManager.createRoom();
			socket.join(roomCode);
			socket.data.roomCode = roomCode;
			socket.emit('room_created', { roomCode });
			logger.info(`Room created: ${roomCode} by ${socket.id}`);
		} catch (error) {
			logger.error('Error creating room:', error);
			socket.emit('error', handleError(error));
		}
	});

	// Join an existing room
	socket.on('join_room', ({ roomCode, playerName }) => {
		try {
			if (!roomManager.roomExists(roomCode)) {
				throw new RoomError(
					ErrorCodes.ROOM_NOT_FOUND,
					'Room does not exist'
				);
			}

			const gameState = roomManager.getRoom(roomCode);
			if (!gameState) {
				throw new GameStateError(
					ErrorCodes.INVALID_GAME_PHASE,
					'Failed to get game state'
				);
			}

			// Add player to the game
			const success = gameState.addPlayer(socket.id, playerName);
			if (!success) {
				throw new RoomError(ErrorCodes.ROOM_FULL, 'Game is full');
			}

			// Join the socket room
			socket.join(roomCode);
			socket.data.roomCode = roomCode;

			// Notify the player they joined successfully
			socket.emit('room_joined', { roomCode });

			// Notify all players in the room about the new player
			io.to(roomCode).emit('player_joined', {
				playerId: socket.id,
				playerName
			});

			// Send the current game state to all players
			io.to(roomCode).emit('game_state_update', gameState.toJSON());

			logger.info(
				`Player ${playerName} (${socket.id}) joined room ${roomCode}`
			);
		} catch (error) {
			logger.error('Error joining room:', error);
			socket.emit('error', handleError(error));
		}
	});

	// Leave a room
	socket.on('leave_room', () => {
		try {
			const roomCode = socket.data.roomCode;
			if (!roomCode || !roomManager.roomExists(roomCode)) {
				return;
			}

			const gameState = roomManager.getRoom(roomCode);
			if (!gameState) {
				return;
			}

			// Remove player from the game
			gameState.removePlayer(socket.id);

			// Leave the socket room
			socket.leave(roomCode);
			delete socket.data.roomCode;

			// Notify all players in the room
			io.to(roomCode).emit('player_left', { playerId: socket.id });

			// Send the updated game state to all players
			io.to(roomCode).emit('game_state_update', gameState.toJSON());

			// If the room is empty, remove it
			if (gameState.players.size === 0) {
				roomManager.removeRoom(roomCode);
				logger.info(`Room ${roomCode} removed (empty)`);
			}

			logger.info(`Player ${socket.id} left room ${roomCode}`);
		} catch (error) {
			logger.error('Error leaving room:', error);
			socket.emit('error', handleError(error));
		}
	});
}

/**
 * Sets up game-related socket events
 * @param socket The client socket
 * @param io The Socket.io server
 * @param roomManager The room manager
 */
function setupGameEvents(
	socket: Socket,
	io: Server,
	roomManager: RoomManager
): void {
	// Place a card
	socket.on('place_card', ({ cardType }) => {
		try {
			const roomCode = socket.data.roomCode;
			if (!roomCode || !roomManager.roomExists(roomCode)) {
				throw new RoomError(ErrorCodes.ROOM_NOT_FOUND, 'Not in a room');
			}

			const gameState = roomManager.getRoom(roomCode);
			if (!gameState) {
				throw new GameStateError(
					ErrorCodes.INVALID_GAME_PHASE,
					'Failed to get game state'
				);
			}

			// Place the card
			const success = gameState.placeCard(socket.id, cardType);
			if (!success) {
				throw new GameStateError(
					ErrorCodes.INVALID_ACTION,
					'Failed to place card'
				);
			}

			// Notify all players
			io.to(roomCode).emit('card_placed', {
				playerId: socket.id,
				cardType
			});

			// Send the updated game state to all players
			io.to(roomCode).emit('game_state_update', gameState.toJSON());

			logger.info(
				`Player ${socket.id} placed a ${cardType} card in room ${roomCode}`
			);
		} catch (error) {
			logger.error('Error placing card:', error);
			socket.emit('error', handleError(error));
		}
	});

	// Make a bid
	socket.on('make_bid', ({ bid }) => {
		const roomCode = socket.data.roomCode;
		if (!roomCode || !roomManager.roomExists(roomCode)) {
			socket.emit('error', { message: 'Not in a room' });
			return;
		}

		const gameState = roomManager.getRoom(roomCode);
		if (!gameState) {
			socket.emit('error', { message: 'Failed to get game state' });
			return;
		}

		// Make the bid
		const success = gameState.makeBid(socket.id, bid);
		if (!success) {
			socket.emit('error', { message: 'Invalid bid' });
			return;
		}

		// Notify all players
		io.to(roomCode).emit('bid_made', {
			playerId: socket.id,
			bid
		});

		// Send the updated game state to all players
		io.to(roomCode).emit('game_state_update', gameState.toJSON());
	});

	// Pass on bidding
	socket.on('pass', () => {
		const roomCode = socket.data.roomCode;
		if (!roomCode || !roomManager.roomExists(roomCode)) {
			socket.emit('error', { message: 'Not in a room' });
			return;
		}

		const gameState = roomManager.getRoom(roomCode);
		if (!gameState) {
			socket.emit('error', { message: 'Failed to get game state' });
			return;
		}

		// Pass
		const success = gameState.pass(socket.id);
		if (!success) {
			socket.emit('error', { message: 'Cannot pass now' });
			return;
		}

		// Notify all players
		io.to(roomCode).emit('player_passed', {
			playerId: socket.id
		});

		// Send the updated game state to all players
		io.to(roomCode).emit('game_state_update', gameState.toJSON());
	});

	// Flip a card
	socket.on('flip_card', ({ targetPlayerId }) => {
		const roomCode = socket.data.roomCode;
		if (!roomCode || !roomManager.roomExists(roomCode)) {
			socket.emit('error', { message: 'Not in a room' });
			return;
		}

		const gameState = roomManager.getRoom(roomCode);
		if (!gameState) {
			socket.emit('error', { message: 'Failed to get game state' });
			return;
		}

		// Flip the card
		const result = gameState.flipCard(socket.id, targetPlayerId);
		if (!result.success) {
			socket.emit('error', { message: 'Failed to flip card' });
			return;
		}

		// Notify all players
		io.to(roomCode).emit('card_flipped', {
			playerId: socket.id,
			targetPlayerId,
			result: result.result
		});

		// Send the updated game state to all players
		io.to(roomCode).emit('game_state_update', gameState.toJSON());
	});

	// Start next round
	socket.on('next_round', () => {
		const roomCode = socket.data.roomCode;
		if (!roomCode || !roomManager.roomExists(roomCode)) {
			socket.emit('error', { message: 'Not in a room' });
			return;
		}

		const gameState = roomManager.getRoom(roomCode);
		if (!gameState) {
			socket.emit('error', { message: 'Failed to get game state' });
			return;
		}

		// Start the next round
		gameState.nextRound();

		// Notify all players
		io.to(roomCode).emit('round_started', {
			round: gameState.round
		});

		// Send the updated game state to all players
		io.to(roomCode).emit('game_state_update', gameState.toJSON());
	});
}

/**
 * Handles a client disconnection
 * @param socket The client socket
 * @param io The Socket.io server
 * @param roomManager The room manager
 */
function handleDisconnect(
	socket: Socket,
	io: Server,
	roomManager: RoomManager
): void {
	try {
		logger.info(`Client disconnected: ${socket.id}`);

		const roomCode = socket.data.roomCode;
		if (!roomCode || !roomManager.roomExists(roomCode)) {
			return;
		}

		const gameState = roomManager.getRoom(roomCode);
		if (!gameState) {
			return;
		}

		// Mark the player as disconnected
		gameState.setPlayerConnection(socket.id, false);

		// Notify all players in the room
		io.to(roomCode).emit('player_disconnected', { playerId: socket.id });

		// Send the updated game state to all players
		io.to(roomCode).emit('game_state_update', gameState.toJSON());

		// If all players are disconnected, remove the room after a delay
		const allDisconnected = Array.from(gameState.players.values()).every(
			(player) => !(player as { isConnected: boolean }).isConnected
		);

		if (allDisconnected) {
			logger.info(
				`All players disconnected in room ${roomCode}, scheduling cleanup`
			);

			setTimeout(() => {
				try {
					// Check again in case someone reconnected
					const gameState = roomManager.getRoom(roomCode);
					if (gameState) {
						const stillAllDisconnected = Array.from(
							gameState.players.values()
						).every(
							(player) =>
								!(player as { isConnected: boolean })
									.isConnected
						);

						if (stillAllDisconnected) {
							roomManager.removeRoom(roomCode);
							logger.info(
								`Room ${roomCode} removed (all disconnected)`
							);
						}
					}
				} catch (error) {
					logger.error('Error in room cleanup timeout:', error);
				}
			}, 60000); // 1 minute delay
		}
	} catch (error) {
		logger.error('Error handling disconnect:', error);
	}
}
