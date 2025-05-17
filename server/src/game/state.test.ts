import { assertEquals, assertNotEquals } from 'std/testing/asserts.ts';
import { GameState } from './state.ts';

Deno.test('GameState - Player Management', async (t) => {
	await t.step('should add players correctly', () => {
		const gameState = new GameState();

		// Add first player
		const result1 = gameState.addPlayer('player1', 'Alice');
		assertEquals(result1, true);
		assertEquals(gameState.players.size, 1);
		assertEquals(gameState.currentPlayerId, 'player1');
		assertEquals(gameState.gamePhase, 'waiting');

		// Add second player
		const result2 = gameState.addPlayer('player2', 'Bob');
		assertEquals(result2, true);
		assertEquals(gameState.players.size, 2);
		assertEquals(gameState.gamePhase, 'placement');

		// Verify player data
		const player1 = gameState.players.get('player1');
		assertEquals(player1?.name, 'Alice');
		assertEquals(player1?.cards, 4);
		assertEquals(player1?.stack.length, 0);
		assertEquals(player1?.points, 0);
		assertEquals(player1?.isConnected, true);
	});

	await t.step('should remove players correctly', () => {
		const gameState = new GameState();

		// Add players
		gameState.addPlayer('player1', 'Alice');
		gameState.addPlayer('player2', 'Bob');
		assertEquals(gameState.players.size, 2);

		// Remove a player
		gameState.removePlayer('player1');
		assertEquals(gameState.players.size, 1);
		assertEquals(gameState.players.has('player1'), false);
		assertEquals(gameState.players.has('player2'), true);

		// Game should go back to waiting phase with only one player
		assertEquals(gameState.gamePhase, 'waiting');
	});

	await t.step('should handle player connection status', () => {
		const gameState = new GameState();

		// Add a player
		gameState.addPlayer('player1', 'Alice');
		const player = gameState.players.get('player1');
		assertEquals(player?.isConnected, true);

		// Set player as disconnected
		gameState.setPlayerConnection('player1', false);
		assertEquals(player?.isConnected, false);

		// Set player as connected again
		gameState.setPlayerConnection('player1', true);
		assertEquals(player?.isConnected, true);
	});
});

Deno.test('GameState - Game Mechanics', async (t) => {
	await t.step('should handle card placement correctly', () => {
		const gameState = new GameState();

		// Add players
		gameState.addPlayer('player1', 'Alice');
		gameState.addPlayer('player2', 'Bob');

		// Place a card for player1
		const result1 = gameState.placeCard('player1', 'rose');
		assertEquals(result1, true);

		// Verify the card was placed
		const player1 = gameState.players.get('player1');
		assertEquals(player1?.stack.length, 1);
		assertEquals(player1?.stack[0].type, 'rose');
		assertEquals(player1?.stack[0].faceUp, false);

		// Turn should move to player2
		assertEquals(gameState.currentPlayerId, 'player2');

		// Place a card for player2
		const result2 = gameState.placeCard('player2', 'skull');
		assertEquals(result2, true);

		// Verify the card was placed
		const player2 = gameState.players.get('player2');
		assertEquals(player2?.stack.length, 1);
		assertEquals(player2?.stack[0].type, 'skull');

		// Game phase should change to bidding after all players have placed a card
		assertEquals(gameState.gamePhase, 'bidding');
	});

	await t.step('should handle bidding correctly', () => {
		const gameState = new GameState();

		// Set up game state for bidding
		gameState.addPlayer('player1', 'Alice');
		gameState.addPlayer('player2', 'Bob');
		gameState.placeCard('player1', 'rose');
		gameState.placeCard('player2', 'skull');
		assertEquals(gameState.gamePhase, 'bidding');

		// Player1 makes a bid
		const result1 = gameState.makeBid('player1', 1);
		assertEquals(result1, true);
		assertEquals(gameState.currentBid, 1);
		assertEquals(gameState.highestBidderId, 'player1');
		assertEquals(gameState.currentPlayerId, 'player2');

		// Player2 makes a higher bid
		const result2 = gameState.makeBid('player2', 2);
		assertEquals(result2, true);
		assertEquals(gameState.currentBid, 2);
		assertEquals(gameState.highestBidderId, 'player2');
		assertEquals(gameState.currentPlayerId, 'player1');

		// Player1 passes
		const result3 = gameState.pass('player1');
		assertEquals(result3, true);

		// Game phase should change to flipping
		assertEquals(gameState.gamePhase, 'flipping');
		assertEquals(gameState.currentPlayerId, 'player2');
	});

	await t.step('should handle card flipping correctly', () => {
		const gameState = new GameState();

		// Set up game state for flipping
		gameState.addPlayer('player1', 'Alice');
		gameState.addPlayer('player2', 'Bob');
		gameState.placeCard('player1', 'rose');
		gameState.placeCard('player2', 'rose');
		gameState.makeBid('player1', 1);
		gameState.pass('player2');
		assertEquals(gameState.gamePhase, 'flipping');

		// Player1 flips their own card (rose)
		const result = gameState.flipCard('player1', 'player1');
		assertEquals(result.success, true);
		assertEquals(result.result, 'rose');

		// Game phase should change to result
		assertEquals(gameState.gamePhase, 'result');

		// Player1 should get a point
		const player1 = gameState.players.get('player1');
		assertEquals(player1?.points, 1);
	});

	await t.step('should handle next round correctly', () => {
		const gameState = new GameState();

		// Set up a completed round
		gameState.addPlayer('player1', 'Alice');
		gameState.addPlayer('player2', 'Bob');
		gameState.placeCard('player1', 'rose');
		gameState.placeCard('player2', 'rose');
		gameState.makeBid('player1', 1);
		gameState.pass('player2');
		gameState.flipCard('player1', 'player1');

		// Start next round
		gameState.nextRound();

		// Verify round was reset
		assertEquals(gameState.gamePhase, 'placement');
		assertEquals(gameState.round, 2);
		assertEquals(gameState.currentBid, 0);
		assertEquals(gameState.highestBidderId, null);

		// Verify player stacks were cleared
		const player1 = gameState.players.get('player1');
		const player2 = gameState.players.get('player2');
		assertEquals(player1?.stack.length, 0);
		assertEquals(player2?.stack.length, 0);

		// Points should be preserved
		assertEquals(player1?.points, 1);
	});
});

Deno.test('GameState - JSON Serialization', () => {
	const gameState = new GameState();

	// Add players
	gameState.addPlayer('player1', 'Alice');
	gameState.addPlayer('player2', 'Bob');

	// Place cards
	gameState.placeCard('player1', 'rose');
	gameState.placeCard('player2', 'skull');

	// Make a bid
	gameState.makeBid('player1', 1);

	// Convert to JSON
	const json = gameState.toJSON();

	// Verify JSON structure
	assertEquals(typeof json, 'object');
	assertEquals(Array.isArray(json.players), true);
	assertEquals(json.players.length, 2);
	assertEquals(json.gamePhase, 'bidding');
	assertEquals(json.currentPlayerId, 'player2');
	assertEquals(json.currentBid, 1);
	assertEquals(json.highestBidderId, 'player1');
});
