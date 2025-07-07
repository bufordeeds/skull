import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Text
} from 'react-native';
import { router } from 'expo-router';
import {
	Container,
	Header,
	PlayerBoard,
	GamePhaseIndicator,
	GameControls
} from '../src/components';
import { CardType } from '../src/components/Card';
import { colors, spacing } from '../src/constants/theme';
import { useGame } from '../src/context/GameContext';

export default function GameScreen() {
	const {
		gameState,
		player,
		placeCard,
		startBidding,
		makeBid,
		passBid,
		flipCard
	} = useGame();

	// Mock data for development - will be replaced with actual game state
	const [mockGameState, setMockGameState] = useState({
		phase: 'placement' as 'placement' | 'bidding' | 'flipping' | 'results',
		currentPlayerId: '1',
		round: 1,
		highestBid: {
			playerId: '',
			amount: 0
		},
		players: [
			{
				id: '1',
				name: 'You',
				isReady: true,
				isHost: true,
				score: 0,
				cards: 4
			},
			{
				id: '2',
				name: 'Player 2',
				isReady: true,
				isHost: false,
				score: 0,
				cards: 4
			},
			{
				id: '3',
				name: 'Player 3',
				isReady: true,
				isHost: false,
				score: 0,
				cards: 4
			},
			{
				id: '4',
				name: 'Player 4',
				isReady: true,
				isHost: false,
				score: 0,
				cards: 4
			}
		]
	});

	// Mock player data
	const [mockPlayerData, setMockPlayerData] = useState({
		id: '1',
		name: 'You',
		isReady: true,
		isHost: true,
		availableCards: ['rose', 'rose', 'rose', 'skull'] as CardType[],
		placedCards: [] as CardType[]
	});

	// Mock data for all players' placed cards
	const [playerCards, setPlayerCards] = useState<{
		[key: string]: { cards: CardType[]; faceUp: boolean[] };
	}>({
		'1': { cards: [], faceUp: [] },
		'2': { cards: [], faceUp: [] },
		'3': { cards: [], faceUp: [] },
		'4': { cards: [], faceUp: [] }
	});

	// Handle placing a card
	const handlePlaceCard = (cardType: CardType) => {
		// Update mock player data
		const availableCards = [...mockPlayerData.availableCards];
		const cardIndex = availableCards.indexOf(cardType);
		if (cardIndex !== -1) {
			availableCards.splice(cardIndex, 1);

			// Update placed cards
			const newPlacedCards = [...mockPlayerData.placedCards, cardType];
			setMockPlayerData({
				...mockPlayerData,
				availableCards,
				placedCards: newPlacedCards
			});

			// Update player cards
			setPlayerCards({
				...playerCards,
				'1': {
					cards: [...playerCards['1'].cards, cardType],
					faceUp: [...playerCards['1'].faceUp, false]
				}
			});

			// In a real implementation, we would call placeCard(cardType)
		}
	};

	// Handle starting the bidding phase
	const handleStartBidding = () => {
		setMockGameState({
			...mockGameState,
			phase: 'bidding'
		});

		// In a real implementation, we would call startBidding()
	};

	// Handle making a bid
	const handleMakeBid = (amount: number) => {
		setMockGameState({
			...mockGameState,
			highestBid: {
				playerId: '1',
				amount
			},
			currentPlayerId: '2'
		});

		// In a real implementation, we would call makeBid(amount)
	};

	// Handle passing a bid
	const handlePass = () => {
		setMockGameState({
			...mockGameState,
			currentPlayerId: '2'
		});

		// In a real implementation, we would call passBid()
	};

	// Handle flipping a card
	const handleFlipCard = (playerId: string, cardIndex: number) => {
		// Update player cards
		const playerCardData = playerCards[playerId];
		if (playerCardData) {
			const newFaceUp = [...playerCardData.faceUp];
			newFaceUp[cardIndex] = true;

			setPlayerCards({
				...playerCards,
				[playerId]: {
					...playerCardData,
					faceUp: newFaceUp
				}
			});
		}

		// In a real implementation, we would call flipCard(playerId, cardIndex)
	};

	// Handle ending the game
	const handleEndGame = () => {
		// In a real implementation, this would confirm with the user first
		router.replace('/');
	};

	// Get player positions based on the number of players
	const getPlayerPositions = () => {
		const positions = ['bottom', 'right', 'top', 'left'];
		const numPlayers = mockGameState.players.length;

		// Adjust positions based on number of players
		if (numPlayers === 2) {
			return ['bottom', 'top'];
		} else if (numPlayers === 3) {
			return ['bottom', 'right', 'left'];
		}

		return positions;
	};

	// Render player boards
	const renderPlayerBoards = () => {
		const positions = getPlayerPositions();

		return mockGameState.players.map((player, index) => {
			const position = positions[index] as
				| 'top'
				| 'right'
				| 'bottom'
				| 'left';
			const isCurrentPlayer = player.id === mockPlayerData.id;
			const isCurrentTurn = player.id === mockGameState.currentPlayerId;
			const playerCardData = playerCards[player.id] || {
				cards: [],
				faceUp: []
			};

			return (
				<PlayerBoard
					key={player.id}
					player={player}
					isCurrentPlayer={isCurrentPlayer}
					isCurrentTurn={isCurrentTurn}
					placedCards={playerCardData.cards}
					faceUpCards={playerCardData.faceUp}
					onCardPress={
						mockGameState.phase === 'flipping' && isCurrentTurn
							? (index) => handleFlipCard(player.id, index)
							: undefined
					}
					position={position}
				/>
			);
		});
	};

	return (
		<Container>
			<Header
				title='Skull Game'
				showBackButton={false}
				rightComponent={
					<TouchableOpacity onPress={handleEndGame}>
						<Text style={{ color: colors.danger }}>End Game</Text>
					</TouchableOpacity>
				}
			/>

			<ScrollView contentContainerStyle={styles.scrollContent}>
				<GamePhaseIndicator
					phase={mockGameState.phase}
					round={mockGameState.round}
					highestBid={
						mockGameState.highestBid.amount > 0
							? {
									playerId: mockGameState.highestBid.playerId,
									playerName:
										mockGameState.players.find(
											(p) =>
												p.id ===
												mockGameState.highestBid
													.playerId
										)?.name || 'Unknown',
									amount: mockGameState.highestBid.amount
							  }
							: undefined
					}
				/>

				<View style={styles.gameBoard}>{renderPlayerBoards()}</View>

				<GameControls
					phase={mockGameState.phase}
					isPlayerTurn={
						mockGameState.currentPlayerId === mockPlayerData.id
					}
					availableCards={mockPlayerData.availableCards}
					currentBid={mockGameState.highestBid.amount}
					maxBid={mockGameState.players.reduce(
						(total, player) => total + (player.cards || 0),
						0
					)}
					onPlaceCard={handlePlaceCard}
					onStartBidding={
						mockPlayerData.placedCards.length > 0
							? handleStartBidding
							: undefined
					}
					onMakeBid={handleMakeBid}
					onPass={handlePass}
					onPlayAgain={() => {
						// Reset game state for a new game
						setMockGameState({
							...mockGameState,
							phase: 'placement',
							round: mockGameState.round + 1,
							highestBid: { playerId: '', amount: 0 }
						});

						// Reset player data
						setMockPlayerData({
							...mockPlayerData,
							availableCards: ['rose', 'rose', 'rose', 'skull'],
							placedCards: []
						});

						// Reset player cards
						setPlayerCards({
							'1': { cards: [], faceUp: [] },
							'2': { cards: [], faceUp: [] },
							'3': { cards: [], faceUp: [] },
							'4': { cards: [], faceUp: [] }
						});
					}}
					onReturnToLobby={() => router.replace('/lobby')}
				/>
			</ScrollView>
		</Container>
	);
}

const styles = StyleSheet.create({
	scrollContent: {
		flexGrow: 1,
		padding: spacing.md
	},
	gameBoard: {
		flex: 1,
		position: 'relative',
		minHeight: 400,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
