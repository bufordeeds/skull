import { io, Socket } from 'socket.io-client';

// Define event types for better type safety
export enum SocketEvent {
	// Connection events
	CONNECT = 'connect',
	DISCONNECT = 'disconnect',
	CONNECT_ERROR = 'connect_error',
	RECONNECT = 'reconnect',

	// Room events
	CREATE_ROOM = 'create_room',
	JOIN_ROOM = 'join_room',
	LEAVE_ROOM = 'leave_room',
	ROOM_JOINED = 'room_joined',
	ROOM_CREATED = 'room_created',
	PLAYER_JOINED = 'player_joined',
	PLAYER_LEFT = 'player_left',
	PLAYER_READY = 'player_ready',

	// Game events
	START_GAME = 'start_game',
	GAME_STARTED = 'game_started',
	PLACE_CARD = 'place_card',
	CARD_PLACED = 'card_placed',
	START_BIDDING = 'start_bidding',
	BIDDING_STARTED = 'bidding_started',
	MAKE_BID = 'make_bid',
	BID_MADE = 'bid_made',
	PASS_BID = 'pass',
	BID_PASSED = 'player_passed',
	FLIP_CARD = 'flip_card',
	CARD_FLIPPED = 'card_flipped',
	ROUND_ENDED = 'round_ended',
	GAME_ENDED = 'game_ended'
}

// Define types for socket events
export interface Player {
	id: string;
	name: string;
	isReady: boolean;
	isHost: boolean;
	score?: number;
	cards?: number;
}

export interface Room {
	id: string;
	code: string;
	players: Player[];
	status: 'waiting' | 'playing' | 'ended';
}

export interface GameState {
	phase: 'placement' | 'bidding' | 'flipping' | 'results';
	currentPlayerId: string;
	round: number;
	highestBid?: {
		playerId: string;
		amount: number;
	};
	players: Player[];
}

// Socket service class
class SocketService {
	private socket: Socket | null = null;
	private url: string = '';
	private reconnectAttempts: number = 0;
	private maxReconnectAttempts: number = 5;
	private listeners: Map<string, Function[]> = new Map();

	// Initialize the socket connection
	initialize(url: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				console.log('Initializing socket connection to:', url);
				this.url = url;

				// Try with more compatible options
				console.log('Attempting to connect with updated options');
				this.socket = io(url, {
					reconnectionAttempts: this.maxReconnectAttempts,
					timeout: 30000, // Increased timeout to match server
					autoConnect: true,
					transports: ['websocket', 'polling'], // Try websocket first, then polling
					upgrade: true, // Allow upgrade to WebSocket
					forceNew: true,
					reconnection: true,
					reconnectionDelay: 1000,
					reconnectionDelayMax: 5000,
					randomizationFactor: 0.5,
					extraHeaders: {}, // No extra headers needed
					query: {}, // No query params needed
					path: '/socket.io/', // Default path
					withCredentials: false // Don't send credentials
				});

				// Set up connection event handlers
				this.socket.on(SocketEvent.CONNECT, () => {
					console.log('Socket connected');
					this.reconnectAttempts = 0;
					resolve(true);
				});

				this.socket.on(SocketEvent.CONNECT_ERROR, (error: Error) => {
					console.error('Socket connection error:', error);
					this.reconnectAttempts++;
					if (this.reconnectAttempts >= this.maxReconnectAttempts) {
						reject(
							new Error(
								'Failed to connect to server after multiple attempts'
							)
						);
					}
				});

				this.socket.on(SocketEvent.DISCONNECT, (reason: string) => {
					console.log('Socket disconnected:', reason);
					this.notifyListeners(SocketEvent.DISCONNECT, reason);
				});

				this.socket.on(
					SocketEvent.RECONNECT,
					(attemptNumber: number) => {
						console.log(
							`Socket reconnected after ${attemptNumber} attempts`
						);
						this.notifyListeners(
							SocketEvent.RECONNECT,
							attemptNumber
						);
					}
				);
			} catch (error) {
				console.error('Error initializing socket:', error);
				reject(error);
			}
		});
	}

	// Connect to the socket server
	connect(): void {
		if (this.socket && !this.socket.connected) {
			this.socket.connect();
		}
	}

	// Disconnect from the socket server
	disconnect(): void {
		if (this.socket) {
			this.socket.disconnect();
		}
	}

	// Check if socket is connected
	isConnected(): boolean {
		return this.socket?.connected || false;
	}

	// Add event listener
	on<T>(event: SocketEvent, callback: (data: T) => void): void {
		if (!this.socket) {
			console.error('Socket not initialized');
			return;
		}

		this.socket.on(event, callback);

		// Store listener for later notification
		if (!this.listeners.has(event)) {
			this.listeners.set(event, []);
		}
		this.listeners.get(event)?.push(callback);
	}

	// Remove event listener
	off(event: SocketEvent, callback?: Function): void {
		if (!this.socket) {
			console.error('Socket not initialized');
			return;
		}

		if (callback) {
			this.socket.off(event, callback as any);

			// Remove specific listener from our map
			const listeners = this.listeners.get(event);
			if (listeners) {
				const index = listeners.indexOf(callback);
				if (index !== -1) {
					listeners.splice(index, 1);
				}
			}
		} else {
			this.socket.off(event);
			this.listeners.delete(event);
		}
	}

	// Emit event to server
	emit<T>(event: SocketEvent, data?: T): void {
		if (!this.socket) {
			console.error('Socket not initialized');
			return;
		}

		this.socket.emit(event, data);
	}

	// Emit event and wait for response
	emitWithAck<T, R>(event: SocketEvent, data?: T): Promise<R> {
		return new Promise((resolve, reject) => {
			if (!this.socket) {
				reject(new Error('Socket not initialized'));
				return;
			}

			this.socket.emit(
				event,
				data,
				(response: { success: boolean; data?: R; error?: string }) => {
					if (response.success) {
						resolve(response.data as R);
					} else {
						reject(new Error(response.error || 'Unknown error'));
					}
				}
			);
		});
	}

	// Notify all listeners of an event
	private notifyListeners(event: SocketEvent, data: any): void {
		const listeners = this.listeners.get(event);
		if (listeners) {
			listeners.forEach((callback) => {
				try {
					callback(data);
				} catch (error) {
					console.error(`Error in ${event} listener:`, error);
				}
			});
		}
	}
}

// Create singleton instance
export const socketService = new SocketService();
export default socketService;
