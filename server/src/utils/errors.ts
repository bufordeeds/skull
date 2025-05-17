/**
 * Error handling utilities for the Skull game server
 * Provides structured error types and handling functions
 */

/**
 * Base error class for the Skull game server
 * Extends the standard Error class with additional properties
 */
export class GameError extends Error {
	/**
	 * Creates a new GameError
	 * @param code Error code for programmatic handling
	 * @param message Human-readable error message
	 * @param details Optional additional details about the error
	 */
	constructor(
		public code: string,
		message: string,
		public details?: unknown
	) {
		super(message);
		this.name = 'GameError';
	}

	/**
	 * Converts the error to a JSON-serializable object
	 * @returns The error as a plain object
	 */
	toJSON(): Record<string, unknown> {
		return {
			name: this.name,
			code: this.code,
			message: this.message,
			details: this.details
		};
	}
}

/**
 * Error class for room-related errors
 */
export class RoomError extends GameError {
	constructor(code: string, message: string, details?: unknown) {
		super(code, message, details);
		this.name = 'RoomError';
	}
}

/**
 * Error class for player-related errors
 */
export class PlayerError extends GameError {
	constructor(code: string, message: string, details?: unknown) {
		super(code, message, details);
		this.name = 'PlayerError';
	}
}

/**
 * Error class for game state-related errors
 */
export class GameStateError extends GameError {
	constructor(code: string, message: string, details?: unknown) {
		super(code, message, details);
		this.name = 'GameStateError';
	}
}

/**
 * Error class for socket-related errors
 */
export class SocketError extends GameError {
	constructor(code: string, message: string, details?: unknown) {
		super(code, message, details);
		this.name = 'SocketError';
	}
}

/**
 * Common error codes
 */
export const ErrorCodes = {
	// Room errors
	ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
	ROOM_FULL: 'ROOM_FULL',
	INVALID_ROOM_CODE: 'INVALID_ROOM_CODE',

	// Player errors
	PLAYER_NOT_FOUND: 'PLAYER_NOT_FOUND',
	PLAYER_ALREADY_EXISTS: 'PLAYER_ALREADY_EXISTS',
	INVALID_PLAYER_NAME: 'INVALID_PLAYER_NAME',

	// Game state errors
	INVALID_GAME_PHASE: 'INVALID_GAME_PHASE',
	INVALID_TURN: 'INVALID_TURN',
	INVALID_ACTION: 'INVALID_ACTION',
	INVALID_BID: 'INVALID_BID',
	INVALID_CARD: 'INVALID_CARD',

	// Socket errors
	SOCKET_ERROR: 'SOCKET_ERROR',
	CONNECTION_ERROR: 'CONNECTION_ERROR',
	UNAUTHORIZED: 'UNAUTHORIZED'
};

/**
 * Handles an error by converting it to a standardized format
 * @param error The error to handle
 * @returns A standardized error object
 */
export function handleError(error: unknown): Record<string, unknown> {
	if (error instanceof GameError) {
		return error.toJSON();
	}

	if (error instanceof Error) {
		return {
			name: error.name,
			code: 'UNKNOWN_ERROR',
			message: error.message
		};
	}

	return {
		name: 'UnknownError',
		code: 'UNKNOWN_ERROR',
		message: String(error)
	};
}

export default {
	GameError,
	RoomError,
	PlayerError,
	GameStateError,
	SocketError,
	ErrorCodes,
	handleError
};
