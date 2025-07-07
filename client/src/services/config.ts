/**
 * Configuration settings for the application
 */

// API and Socket configuration
export const API_CONFIG = {
	// Base URL for the API
	BASE_URL: 'http://192.168.1.68:3000',

	// Socket.io server URL
	SOCKET_URL: 'http://192.168.1.68:3000',

	// API endpoints
	ENDPOINTS: {
		ROOMS: '/api/rooms',
		HEALTH: '/api/health'
	},

	// Request timeout in milliseconds
	TIMEOUT: 10000,

	// Maximum number of reconnection attempts for socket
	MAX_RECONNECT_ATTEMPTS: 5
};

// Game configuration
export const GAME_CONFIG = {
	// Maximum number of players per room
	MAX_PLAYERS: 6,

	// Minimum number of players required to start a game
	MIN_PLAYERS: 2,

	// Number of cards per player
	CARDS_PER_PLAYER: 4,

	// Number of skull cards per player
	SKULL_CARDS_PER_PLAYER: 1,

	// Number of rose cards per player
	ROSE_CARDS_PER_PLAYER: 3,

	// Points needed to win the game
	POINTS_TO_WIN: 2
};

// Default export for easier importing
export default {
	API: API_CONFIG,
	GAME: GAME_CONFIG
};
