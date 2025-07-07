import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
	socketService,
	SocketEvent,
	Player,
	Room,
	GameState
} from '../services/socketService';
import { API_CONFIG } from '../services/config';

// Define the state interface
interface GameContextState {
	connected: boolean;
	room: Room | null;
	player: Player | null;
	gameState: GameState | null;
	error: string | null;
	loading: boolean;
}

// Define the initial state
const initialState: GameContextState = {
	connected: false,
	room: null,
	player: null,
	gameState: null,
	error: null,
	loading: false
};

// Define action types
type GameAction =
	| { type: 'SET_CONNECTED'; payload: boolean }
	| { type: 'SET_ROOM'; payload: Room | null }
	| { type: 'SET_PLAYER'; payload: Player | null }
	| { type: 'SET_GAME_STATE'; payload: GameState | null }
	| { type: 'SET_ERROR'; payload: string | null }
	| { type: 'SET_LOADING'; payload: boolean }
	| { type: 'PLAYER_JOINED'; payload: Player }
	| { type: 'PLAYER_LEFT'; payload: string }
	| { type: 'PLAYER_READY'; payload: { playerId: string; isReady: boolean } }
	| { type: 'RESET_STATE' };

// Create the reducer function
const gameReducer = (
	state: GameContextState,
	action: GameAction
): GameContextState => {
	switch (action.type) {
		case 'SET_CONNECTED':
			return { ...state, connected: action.payload, error: null };

		case 'SET_ROOM':
			return { ...state, room: action.payload };

		case 'SET_PLAYER':
			return { ...state, player: action.payload };

		case 'SET_GAME_STATE':
			return { ...state, gameState: action.payload };

		case 'SET_ERROR':
			return { ...state, error: action.payload };

		case 'SET_LOADING':
			return { ...state, loading: action.payload };

		case 'PLAYER_JOINED':
			if (!state.room) return state;
			return {
				...state,
				room: {
					...state.room,
					players: [...state.room.players, action.payload]
				}
			};

		case 'PLAYER_LEFT':
			if (!state.room) return state;
			return {
				...state,
				room: {
					...state.room,
					players: state.room.players.filter(
						(p) => p.id !== action.payload
					)
				}
			};

		case 'PLAYER_READY':
			if (!state.room) return state;
			return {
				...state,
				room: {
					...state.room,
					players: state.room.players.map((p) =>
						p.id === action.payload.playerId
							? { ...p, isReady: action.payload.isReady }
							: p
					)
				}
			};

		case 'RESET_STATE':
			return initialState;

		default:
			return state;
	}
};

// Create the context
interface GameContextValue extends GameContextState {
	// Connection methods
	connect: () => Promise<void>;
	disconnect: () => void;

	// Room methods
	createRoom: (playerName: string) => Promise<Room>;
	joinRoom: (roomCode: string, playerName: string) => Promise<Room>;
	leaveRoom: () => Promise<void>;

	// Game methods
	setReady: (isReady: boolean) => Promise<void>;
	startGame: () => Promise<void>;
	placeCard: (cardType: 'skull' | 'rose') => Promise<void>;
	startBidding: () => Promise<void>;
	makeBid: (amount: number) => Promise<void>;
	passBid: () => Promise<void>;
	flipCard: (playerId: string, cardIndex: number) => Promise<void>;
}

// Create the context with default values
const GameContext = createContext<GameContextValue>({
	...initialState,
	connect: async () => {},
	disconnect: () => {},
	createRoom: async () => ({
		id: '',
		code: '',
		players: [],
		status: 'waiting'
	}),
	joinRoom: async () => ({
		id: '',
		code: '',
		players: [],
		status: 'waiting'
	}),
	leaveRoom: async () => {},
	setReady: async () => {},
	startGame: async () => {},
	placeCard: async () => {},
	startBidding: async () => {},
	makeBid: async () => {},
	passBid: async () => {},
	flipCard: async () => {}
});

// Create the provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [state, dispatch] = useReducer(gameReducer, initialState);

	// Initialize socket connection
	useEffect(() => {
		// Set up socket event listeners
		const setupSocketListeners = () => {
			// Connection events
			socketService.on<void>(SocketEvent.CONNECT, () => {
				dispatch({ type: 'SET_CONNECTED', payload: true });
			});

			socketService.on<string>(SocketEvent.DISCONNECT, (reason) => {
				dispatch({ type: 'SET_CONNECTED', payload: false });
				console.log('Disconnected:', reason);
			});

			socketService.on<Error>(SocketEvent.CONNECT_ERROR, (error) => {
				dispatch({
					type: 'SET_ERROR',
					payload: `Connection error: ${error.message}`
				});
				console.error('Connection error:', error);
			});

			// Room events
			socketService.on<Room>(SocketEvent.ROOM_CREATED, (room) => {
				dispatch({ type: 'SET_ROOM', payload: room });
			});

			socketService.on<Room>(SocketEvent.ROOM_JOINED, (room) => {
				dispatch({ type: 'SET_ROOM', payload: room });
			});

			socketService.on<Player>(SocketEvent.PLAYER_JOINED, (player) => {
				dispatch({ type: 'PLAYER_JOINED', payload: player });
			});

			socketService.on<string>(SocketEvent.PLAYER_LEFT, (playerId) => {
				dispatch({ type: 'PLAYER_LEFT', payload: playerId });
			});

			socketService.on<{ playerId: string; isReady: boolean }>(
				SocketEvent.PLAYER_READY,
				(data) => {
					dispatch({ type: 'PLAYER_READY', payload: data });
				}
			);

			// Game events
			socketService.on<GameState>(
				SocketEvent.GAME_STARTED,
				(gameState) => {
					dispatch({ type: 'SET_GAME_STATE', payload: gameState });
				}
			);

			// Add more game event listeners as needed
		};

		// Clean up function to remove event listeners
		return () => {
			// Remove all socket event listeners
			Object.values(SocketEvent).forEach((event) => {
				socketService.off(event);
			});
		};
	}, []);

	// Connect to the socket server
	const connect = async (): Promise<void> => {
		try {
			dispatch({ type: 'SET_LOADING', payload: true });
			await socketService.initialize(API_CONFIG.SOCKET_URL);
			dispatch({ type: 'SET_LOADING', payload: false });
		} catch (error) {
			dispatch({
				type: 'SET_ERROR',
				payload: `Failed to connect: ${error}`
			});
			dispatch({ type: 'SET_LOADING', payload: false });
			throw error;
		}
	};

	// Disconnect from the socket server
	const disconnect = (): void => {
		socketService.disconnect();
		dispatch({ type: 'RESET_STATE' });
	};

	// Create a new room
	const createRoom = async (playerName: string): Promise<Room> => {
		try {
			dispatch({ type: 'SET_LOADING', payload: true });

			// Ensure we're connected
			if (!state.connected) {
				await connect();
			}

			const player: Player = {
				id: '', // Will be set by the server
				name: playerName,
				isReady: true,
				isHost: true
			};

			dispatch({ type: 'SET_PLAYER', payload: player });

			// Create room via socket
			const room = await socketService.emitWithAck<void, Room>(
				SocketEvent.CREATE_ROOM
			);

			// Update player with server-assigned ID
			const serverPlayer = room.players.find(
				(p) => p.name === playerName
			);
			if (serverPlayer) {
				dispatch({ type: 'SET_PLAYER', payload: serverPlayer });
			}

			dispatch({ type: 'SET_LOADING', payload: false });
			return room;
		} catch (error) {
			dispatch({
				type: 'SET_ERROR',
				payload: `Failed to create room: ${error}`
			});
			dispatch({ type: 'SET_LOADING', payload: false });
			throw error;
		}
	};

	// Join an existing room
	const joinRoom = async (
		roomCode: string,
		playerName: string
	): Promise<Room> => {
		try {
			dispatch({ type: 'SET_LOADING', payload: true });

			// Ensure we're connected
			if (!state.connected) {
				await connect();
			}

			const player: Player = {
				id: '', // Will be set by the server
				name: playerName,
				isReady: false,
				isHost: false
			};

			dispatch({ type: 'SET_PLAYER', payload: player });

			// Join room via socket
			const room = await socketService.emitWithAck<
				{ roomCode: string; playerName: string },
				Room
			>(SocketEvent.JOIN_ROOM, { roomCode, playerName });

			// Update player with server-assigned ID
			const serverPlayer = room.players.find(
				(p) => p.name === playerName
			);
			if (serverPlayer) {
				dispatch({ type: 'SET_PLAYER', payload: serverPlayer });
			}

			dispatch({ type: 'SET_LOADING', payload: false });
			return room;
		} catch (error) {
			dispatch({
				type: 'SET_ERROR',
				payload: `Failed to join room: ${error}`
			});
			dispatch({ type: 'SET_LOADING', payload: false });
			throw error;
		}
	};

	// Leave the current room
	const leaveRoom = async (): Promise<void> => {
		try {
			if (!state.room) return;

			await socketService.emitWithAck(SocketEvent.LEAVE_ROOM);
			dispatch({ type: 'SET_ROOM', payload: null });
			dispatch({ type: 'SET_PLAYER', payload: null });
		} catch (error) {
			dispatch({
				type: 'SET_ERROR',
				payload: `Failed to leave room: ${error}`
			});
			throw error;
		}
	};

	// Set player ready status
	const setReady = async (isReady: boolean): Promise<void> => {
		try {
			if (!state.player || !state.room) return;

			await socketService.emitWithAck<{ isReady: boolean }, void>(
				SocketEvent.PLAYER_READY,
				{ isReady }
			);

			// Update local player state
			dispatch({
				type: 'SET_PLAYER',
				payload: { ...state.player, isReady }
			});
		} catch (error) {
			dispatch({
				type: 'SET_ERROR',
				payload: `Failed to set ready status: ${error}`
			});
			throw error;
		}
	};

	// Start the game (host only)
	const startGame = async (): Promise<void> => {
		try {
			if (!state.player?.isHost || !state.room) return;

			dispatch({ type: 'SET_LOADING', payload: true });
			await socketService.emitWithAck(SocketEvent.START_GAME);
			dispatch({ type: 'SET_LOADING', payload: false });
		} catch (error) {
			dispatch({
				type: 'SET_ERROR',
				payload: `Failed to start game: ${error}`
			});
			dispatch({ type: 'SET_LOADING', payload: false });
			throw error;
		}
	};

	// Place a card during the placement phase
	const placeCard = async (cardType: 'skull' | 'rose'): Promise<void> => {
		try {
			if (!state.gameState || !state.player) return;

			await socketService.emitWithAck<
				{ cardType: 'skull' | 'rose' },
				void
			>(SocketEvent.PLACE_CARD, { cardType });
		} catch (error) {
			dispatch({
				type: 'SET_ERROR',
				payload: `Failed to place card: ${error}`
			});
			throw error;
		}
	};

	// Start the bidding phase
	const startBidding = async (): Promise<void> => {
		try {
			if (!state.gameState || !state.player) return;

			await socketService.emitWithAck(SocketEvent.START_BIDDING);
		} catch (error) {
			dispatch({
				type: 'SET_ERROR',
				payload: `Failed to start bidding: ${error}`
			});
			throw error;
		}
	};

	// Make a bid during the bidding phase
	const makeBid = async (amount: number): Promise<void> => {
		try {
			if (!state.gameState || !state.player) return;

			await socketService.emitWithAck<{ bid: number }, void>(
				SocketEvent.MAKE_BID,
				{ bid: amount }
			);
		} catch (error) {
			dispatch({
				type: 'SET_ERROR',
				payload: `Failed to make bid: ${error}`
			});
			throw error;
		}
	};

	// Pass during the bidding phase
	const passBid = async (): Promise<void> => {
		try {
			if (!state.gameState || !state.player) return;

			await socketService.emitWithAck(SocketEvent.PASS_BID);
		} catch (error) {
			dispatch({
				type: 'SET_ERROR',
				payload: `Failed to pass bid: ${error}`
			});
			throw error;
		}
	};

	// Flip a card during the flipping phase
	const flipCard = async (
		playerId: string,
		cardIndex: number
	): Promise<void> => {
		try {
			if (!state.gameState || !state.player) return;

			await socketService.emitWithAck<{ targetPlayerId: string }, void>(
				SocketEvent.FLIP_CARD,
				{ targetPlayerId: playerId }
			);
		} catch (error) {
			dispatch({
				type: 'SET_ERROR',
				payload: `Failed to flip card: ${error}`
			});
			throw error;
		}
	};

	// Combine state and methods to create the context value
	const contextValue: GameContextValue = {
		...state,
		connect,
		disconnect,
		createRoom,
		joinRoom,
		leaveRoom,
		setReady,
		startGame,
		placeCard,
		startBidding,
		makeBid,
		passBid,
		flipCard
	};

	return (
		<GameContext.Provider value={contextValue}>
			{children}
		</GameContext.Provider>
	);
};

// Custom hook to use the game context
export const useGame = (): GameContextValue => {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error('useGame must be used within a GameProvider');
	}
	return context;
};

export default GameContext;
