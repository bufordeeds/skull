import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

type GamePhase = 'placement' | 'bidding' | 'flipping' | 'results';

interface GamePhaseIndicatorProps {
	phase: GamePhase;
	round: number;
	highestBid?: {
		playerId: string;
		playerName: string;
		amount: number;
	};
}

/**
 * GamePhaseIndicator component for displaying the current game phase and information
 */
const GamePhaseIndicator: React.FC<GamePhaseIndicatorProps> = ({
	phase,
	round,
	highestBid
}) => {
	// Get phase-specific information
	const getPhaseInfo = () => {
		switch (phase) {
			case 'placement':
				return {
					title: 'Placement Phase',
					description: 'Place a card from your hand face down'
				};
			case 'bidding':
				return {
					title: 'Bidding Phase',
					description: 'Make a bid or pass'
				};
			case 'flipping':
				return {
					title: 'Flipping Phase',
					description: 'Flip cards to match your bid'
				};
			case 'results':
				return {
					title: 'Results Phase',
					description: 'Round complete'
				};
			default:
				return {
					title: 'Unknown Phase',
					description: ''
				};
		}
	};

	const phaseInfo = getPhaseInfo();

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.roundText}>Round {round}</Text>
				<Text style={styles.phaseTitle}>{phaseInfo.title}</Text>
			</View>

			<Text style={styles.description}>{phaseInfo.description}</Text>

			{phase === 'bidding' && highestBid && (
				<View style={styles.bidInfo}>
					<Text style={styles.bidText}>
						Highest Bid: {highestBid.amount} by{' '}
						{highestBid.playerName}
					</Text>
				</View>
			)}

			{phase === 'flipping' && highestBid && (
				<View style={styles.bidInfo}>
					<Text style={styles.bidText}>
						{highestBid.playerName} must flip {highestBid.amount}{' '}
						cards
					</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.charcoal,
		borderRadius: borderRadius.md,
		padding: spacing.md,
		marginVertical: spacing.md
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.sm
	},
	roundText: {
		fontFamily: 'Cinzel',
		fontSize: typography.fontSizeMD,
		color: colors.gold
	},
	phaseTitle: {
		fontFamily: 'Cinzel',
		fontSize: typography.fontSizeMD,
		color: colors.primary
	},
	description: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeSM,
		color: colors.boneWhite,
		marginBottom: spacing.sm
	},
	bidInfo: {
		backgroundColor: colors.deepPurple,
		padding: spacing.sm,
		borderRadius: borderRadius.sm,
		marginTop: spacing.sm
	},
	bidText: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeSM,
		color: colors.gold,
		textAlign: 'center'
	}
});

export default GamePhaseIndicator;
