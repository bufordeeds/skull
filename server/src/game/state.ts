/**
 * Represents a card in the game
 */
export interface Card {
	type: 'rose' | 'skull';
	faceUp: boolean;
}

/**
 * Represents a player in the game
 */
export interface Player {
	id: string;
	name: string;
	cards: number;
	stack: Card[];
	points: number;
	isConnected: boolean;
}

/**
 * Game phases
 */
export type GamePhase =
	| 'waiting'
	| 'placement'
	| 'bidding'
	| 'flipping'
	| 'result';

/**
 * Manages the state of a Skull game
 */
export class GameState {
	players: Map<string, Player> = new Map();
	gamePhase: GamePhase = 'waiting';
	currentPlayerId: string | null = null;
	currentBid: number = 0;
	highestBidderId: string | null = null;
	cardsFlipped: number = 0;
	round: number = 1;

	/**
	 * Adds a player to the game
	 * @param id The player's ID
	 * @param name The player's name
	 * @returns True if the player was added, false if the game is full
	 */
	addPlayer(id: string, name: string): boolean {
		// Maximum 6 players
		if (this.players.size >= 6) {
			return false;
		}

		this.players.set(id, {
			id,
			name,
			cards: 4, // Start with 4 cards (3 roses, 1 skull)
			stack: [],
			points: 0,
			isConnected: true
		});

		// If this is the first player, make them the current player
		if (this.players.size === 1) {
			this.currentPlayerId = id;
		}

		// If we have at least 2 players, change phase to placement
		if (this.players.size >= 2 && this.gamePhase === 'waiting') {
			this.gamePhase = 'placement';
		}

		return true;
	}

	/**
	 * Removes a player from the game
	 * @param id The player's ID
	 */
	removePlayer(id: string): void {
		this.players.delete(id);

		// If the current player was removed, move to the next player
		if (this.currentPlayerId === id) {
			this.nextPlayer();
		}

		// If the highest bidder was removed, reset bidding
		if (this.highestBidderId === id) {
			this.highestBidderId = null;
			this.currentBid = 0;
		}

		// If we have less than 2 players, go back to waiting
		if (this.players.size < 2) {
			this.gamePhase = 'waiting';
			this.round = 1;
		}
	}

	/**
	 * Sets a player's connection status
	 * @param id The player's ID
	 * @param isConnected Whether the player is connected
	 */
	setPlayerConnection(id: string, isConnected: boolean): void {
		const player = this.players.get(id);
		if (player) {
			player.isConnected = isConnected;
		}
	}

	/**
	 * Places a card on a player's stack
	 * @param playerId The player's ID
	 * @param cardType The type of card to place
	 * @returns True if the card was placed, false otherwise
	 */
	placeCard(playerId: string, cardType: 'rose' | 'skull'): boolean {
		// Validate it's the player's turn and we're in placement phase
		if (
			playerId !== this.currentPlayerId ||
			this.gamePhase !== 'placement'
		) {
			return false;
		}

		const player = this.players.get(playerId);
		if (!player) {
			return false;
		}

		// Add the card to the player's stack
		player.stack.push({
			type: cardType,
			faceUp: false
		});

		// Move to the next player
		this.nextPlayer();

		// Check if all players have placed at least one card
		let allPlayersHavePlacedCards = true;
		for (const player of this.players.values()) {
			if (player.stack.length === 0) {
				allPlayersHavePlacedCards = false;
				break;
			}
		}

		// If all players have placed at least one card, move to bidding phase
		if (allPlayersHavePlacedCards) {
			this.gamePhase = 'bidding';
		}

		return true;
	}

	/**
	 * Makes a bid
	 * @param playerId The player's ID
	 * @param bid The bid amount
	 * @returns True if the bid was made, false otherwise
	 */
	makeBid(playerId: string, bid: number): boolean {
		// Validate it's the player's turn and we're in bidding phase
		if (playerId !== this.currentPlayerId || this.gamePhase !== 'bidding') {
			return false;
		}

		// Validate the bid is higher than the current bid
		if (bid <= this.currentBid) {
			return false;
		}

		// Validate the bid is not higher than the total number of cards on the table
		let totalCards = 0;
		for (const player of this.players.values()) {
			totalCards += player.stack.length;
		}

		if (bid > totalCards) {
			return false;
		}

		// Update the bid
		this.currentBid = bid;
		this.highestBidderId = playerId;

		// Move to the next player
		this.nextPlayer();

		return true;
	}

	/**
	 * Passes on making a bid
	 * @param playerId The player's ID
	 * @returns True if the pass was successful, false otherwise
	 */
	pass(playerId: string): boolean {
		// Validate it's the player's turn and we're in bidding phase
		if (playerId !== this.currentPlayerId || this.gamePhase !== 'bidding') {
			return false;
		}

		// Move to the next player
		this.nextPlayer();

		// If we've gone all the way around to the highest bidder, start flipping
		if (this.currentPlayerId === this.highestBidderId) {
			this.gamePhase = 'flipping';
			this.cardsFlipped = 0;
		}

		return true;
	}

	/**
	 * Flips a card
	 * @param playerId The player doing the flipping
	 * @param targetPlayerId The player whose card is being flipped
	 * @returns Object with success flag and result if successful
	 */
	flipCard(
		playerId: string,
		targetPlayerId: string
	): { success: boolean; result?: 'rose' | 'skull' } {
		// Validate it's the player's turn and we're in flipping phase
		if (
			playerId !== this.currentPlayerId ||
			this.gamePhase !== 'flipping' ||
			playerId !== this.highestBidderId
		) {
			return { success: false };
		}

		const targetPlayer = this.players.get(targetPlayerId);
		if (!targetPlayer || targetPlayer.stack.length === 0) {
			return { success: false };
		}

		// Find the first face-down card in the target player's stack
		const cardIndex = targetPlayer.stack.findIndex((card) => !card.faceUp);
		if (cardIndex === -1) {
			return { success: false };
		}

		// Flip the card
		const card = targetPlayer.stack[cardIndex];
		card.faceUp = true;

		// Increment the number of cards flipped
		this.cardsFlipped++;

		// Check if it's a skull
		if (card.type === 'skull') {
			// Player loses
			this.gamePhase = 'result';

			// Player loses a card
			const player = this.players.get(playerId);
			if (player) {
				player.cards--;

				// If player has no cards left, they're eliminated
				if (player.cards <= 0) {
					this.removePlayer(playerId);
				}
			}

			return { success: true, result: 'skull' };
		}

		// Check if the player has flipped enough cards
		if (this.cardsFlipped >= this.currentBid) {
			// Player wins
			this.gamePhase = 'result';

			// Player gets a point
			const player = this.players.get(playerId);
			if (player) {
				player.points++;

				// Check if the player has won the game (2 points)
				if (player.points >= 2) {
					// Game over, player wins
					// In a real implementation, you might want to add a 'gameOver' phase
				}
			}
		}

		return { success: true, result: 'rose' };
	}

	/**
	 * Starts a new round
	 */
	nextRound(): void {
		// Reset game state for the next round
		this.gamePhase = 'placement';
		this.currentBid = 0;
		this.highestBidderId = null;
		this.cardsFlipped = 0;
		this.round++;

		// Clear all players' stacks
		for (const player of this.players.values()) {
			player.stack = [];
		}

		// Set the current player to the player after the previous first player
		if (this.currentPlayerId) {
			this.nextPlayer();
		} else if (this.players.size > 0) {
			// If there's no current player but there are players, set the first one
			this.currentPlayerId = this.players.values().next().value.id;
		}
	}

	/**
	 * Moves to the next player
	 */
	private nextPlayer(): void {
		if (!this.currentPlayerId || this.players.size === 0) {
			return;
		}

		// Get all player IDs
		const playerIds = Array.from(this.players.keys());

		// Find the current player's index
		const currentIndex = playerIds.indexOf(this.currentPlayerId);

		// Move to the next player (wrapping around if necessary)
		const nextIndex = (currentIndex + 1) % playerIds.length;
		this.currentPlayerId = playerIds[nextIndex];
	}

	/**
	 * Converts the game state to a JSON-serializable object
	 * @returns The game state as a plain object
	 */
	toJSON(): Record<string, unknown> {
		return {
			players: Array.from(this.players.values()),
			gamePhase: this.gamePhase,
			currentPlayerId: this.currentPlayerId,
			currentBid: this.currentBid,
			highestBidderId: this.highestBidderId,
			cardsFlipped: this.cardsFlipped,
			round: this.round
		};
	}
}
