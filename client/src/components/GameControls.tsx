import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import Button from './Button';
import Card, { CardType } from './Card';

type GamePhase = 'placement' | 'bidding' | 'flipping' | 'results';

interface GameControlsProps {
	phase: GamePhase;
	isPlayerTurn: boolean;
	availableCards: CardType[];
	currentBid?: number;
	maxBid?: number;
	onPlaceCard?: (cardType: CardType) => void;
	onStartBidding?: () => void;
	onMakeBid?: (amount: number) => void;
	onPass?: () => void;
	onPlayAgain?: () => void;
	onReturnToLobby?: () => void;
}

/**
 * GameControls component for displaying phase-specific game controls
 */
const GameControls: React.FC<GameControlsProps> = ({
	phase,
	isPlayerTurn,
	availableCards,
	currentBid = 0,
	maxBid = 10,
	onPlaceCard,
	onStartBidding,
	onMakeBid,
	onPass,
	onPlayAgain,
	onReturnToLobby
}) => {
	const [selectedBid, setSelectedBid] = useState(currentBid + 1);
	const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

	// Render controls based on the current game phase
	const renderPhaseControls = () => {
		if (!isPlayerTurn) {
			return (
				<View style={styles.waitingContainer}>
					<Text style={styles.waitingText}>
						Waiting for other players...
					</Text>
				</View>
			);
		}

		switch (phase) {
			case 'placement':
				return renderPlacementControls();
			case 'bidding':
				return renderBiddingControls();
			case 'flipping':
				return renderFlippingControls();
			case 'results':
				return renderResultsControls();
			default:
				return null;
		}
	};

	// Render controls for the placement phase
	const renderPlacementControls = () => {
		return (
			<View style={styles.controlsContainer}>
				<Text style={styles.instructionText}>
					Select a card to place:
				</Text>

				<View style={styles.cardSelectionContainer}>
					{availableCards.includes('rose') && (
						<TouchableOpacity
							style={[
								styles.cardOption,
								selectedCard === 'rose' && styles.selectedCard
							]}
							onPress={() => setSelectedCard('rose')}
						>
							<Card
								type='rose'
								faceUp={true}
								size='small'
								disabled={true}
							/>
							<Text style={styles.cardLabel}>Rose</Text>
						</TouchableOpacity>
					)}

					{availableCards.includes('skull') && (
						<TouchableOpacity
							style={[
								styles.cardOption,
								selectedCard === 'skull' && styles.selectedCard
							]}
							onPress={() => setSelectedCard('skull')}
						>
							<Card
								type='skull'
								faceUp={true}
								size='small'
								disabled={true}
							/>
							<Text style={styles.cardLabel}>Skull</Text>
						</TouchableOpacity>
					)}
				</View>

				<View style={styles.actionButtonsContainer}>
					<Button
						title='Place Card'
						onPress={() => {
							if (selectedCard && onPlaceCard) {
								onPlaceCard(selectedCard);
								setSelectedCard(null);
							}
						}}
						disabled={!selectedCard}
						style={styles.actionButton}
					/>

					{onStartBidding && (
						<Button
							title='Start Bidding'
							onPress={onStartBidding}
							variant='secondary'
							style={styles.actionButton}
						/>
					)}
				</View>
			</View>
		);
	};

	// Render controls for the bidding phase
	const renderBiddingControls = () => {
		return (
			<View style={styles.controlsContainer}>
				<Text style={styles.instructionText}>Make a bid or pass:</Text>

				<View style={styles.bidControlsContainer}>
					<Button
						title='-'
						onPress={() => {
							if (selectedBid > currentBid + 1) {
								setSelectedBid(selectedBid - 1);
							}
						}}
						disabled={selectedBid <= currentBid + 1}
						size='small'
						style={styles.bidButton}
					/>

					<View style={styles.bidDisplay}>
						<Text style={styles.bidText}>{selectedBid}</Text>
					</View>

					<Button
						title='+'
						onPress={() => {
							if (selectedBid < maxBid) {
								setSelectedBid(selectedBid + 1);
							}
						}}
						disabled={selectedBid >= maxBid}
						size='small'
						style={styles.bidButton}
					/>
				</View>

				<View style={styles.actionButtonsContainer}>
					<Button
						title='Make Bid'
						onPress={() => {
							if (onMakeBid) {
								onMakeBid(selectedBid);
							}
						}}
						style={styles.actionButton}
					/>

					{onPass && (
						<Button
							title='Pass'
							onPress={onPass}
							variant='outline'
							style={styles.actionButton}
						/>
					)}
				</View>
			</View>
		);
	};

	// Render controls for the flipping phase
	const renderFlippingControls = () => {
		return (
			<View style={styles.controlsContainer}>
				<Text style={styles.instructionText}>Select cards to flip</Text>
				<Text style={styles.subInstructionText}>
					Start with your own cards, then select other players' cards
				</Text>
			</View>
		);
	};

	// Render controls for the results phase
	const renderResultsControls = () => {
		return (
			<View style={styles.controlsContainer}>
				<View style={styles.actionButtonsContainer}>
					{onPlayAgain && (
						<Button
							title='Play Again'
							onPress={onPlayAgain}
							style={styles.actionButton}
						/>
					)}

					{onReturnToLobby && (
						<Button
							title='Return to Lobby'
							onPress={onReturnToLobby}
							variant='outline'
							style={styles.actionButton}
						/>
					)}
				</View>
			</View>
		);
	};

	return <View style={styles.container}>{renderPhaseControls()}</View>;
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.charcoal,
		borderRadius: borderRadius.md,
		padding: spacing.md,
		marginVertical: spacing.md
	},
	controlsContainer: {
		alignItems: 'center'
	},
	instructionText: {
		fontFamily: 'Cinzel',
		fontSize: typography.fontSizeMD,
		color: colors.boneWhite,
		marginBottom: spacing.md,
		textAlign: 'center'
	},
	subInstructionText: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeSM,
		color: colors.boneWhite,
		marginBottom: spacing.md,
		textAlign: 'center'
	},
	cardSelectionContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: spacing.lg
	},
	cardOption: {
		alignItems: 'center',
		marginHorizontal: spacing.md,
		padding: spacing.sm,
		borderRadius: borderRadius.md
	},
	selectedCard: {
		backgroundColor: colors.deepPurple,
		alignItems: 'center',
		marginHorizontal: spacing.md,
		padding: spacing.sm,
		borderRadius: borderRadius.md
	},
	cardLabel: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeSM,
		color: colors.boneWhite,
		marginTop: spacing.sm
	},
	actionButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%'
	},
	actionButton: {
		marginHorizontal: spacing.sm,
		minWidth: 120
	},
	bidControlsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: spacing.lg
	},
	bidButton: {
		width: 50,
		height: 50,
		borderRadius: 25
	},
	bidDisplay: {
		backgroundColor: colors.deepPurple,
		width: 80,
		height: 50,
		borderRadius: borderRadius.md,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: spacing.md
	},
	bidText: {
		fontFamily: 'Cinzel',
		fontSize: typography.fontSizeLG,
		color: colors.gold
	},
	waitingContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: spacing.lg
	},
	waitingText: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeMD,
		color: colors.amber,
		textAlign: 'center'
	}
});

export default GameControls;
