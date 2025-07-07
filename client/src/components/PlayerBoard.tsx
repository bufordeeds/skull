import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import {
	colors,
	typography,
	spacing,
	borderRadius,
	shadows
} from '../constants/theme';
import CardStack from './CardStack';
import { CardType } from './Card';

interface PlayerBoardProps {
	player: {
		id: string;
		name: string;
		isReady: boolean;
		isHost?: boolean;
		score?: number;
		cards?: number;
	};
	isCurrentPlayer: boolean;
	isCurrentTurn: boolean;
	placedCards: CardType[];
	faceUpCards: boolean[];
	onCardPress?: (index: number) => void;
	style?: ViewStyle;
	position?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * PlayerBoard component for displaying a player's information and cards during the game
 */
const PlayerBoard: React.FC<PlayerBoardProps> = ({
	player,
	isCurrentPlayer,
	isCurrentTurn,
	placedCards,
	faceUpCards,
	onCardPress,
	style,
	position = 'bottom'
}) => {
	// Determine position-specific styles
	const getPositionStyles = () => {
		switch (position) {
			case 'top':
				return styles.topPosition;
			case 'right':
				return styles.rightPosition;
			case 'left':
				return styles.leftPosition;
			case 'bottom':
			default:
				return styles.bottomPosition;
		}
	};

	return (
		<View
			style={[
				styles.container,
				getPositionStyles(),
				isCurrentTurn && styles.currentTurn,
				isCurrentPlayer && styles.currentPlayer,
				style
			]}
		>
			<View style={styles.playerInfo}>
				<Text style={styles.playerName}>
					{player.name} {player.isHost ? '(Host)' : ''}
				</Text>
				{player.score !== undefined && (
					<Text style={styles.scoreText}>Score: {player.score}</Text>
				)}
				{player.cards !== undefined && (
					<Text style={styles.cardsText}>Cards: {player.cards}</Text>
				)}
			</View>

			<View style={styles.cardArea}>
				<CardStack
					cards={placedCards}
					faceUp={faceUpCards}
					onCardPress={onCardPress}
					disabled={!isCurrentTurn || !isCurrentPlayer}
					size='medium'
				/>
			</View>

			{isCurrentTurn && (
				<View style={styles.turnIndicator}>
					<Text style={styles.turnText}>Current Turn</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: spacing.md,
		borderRadius: borderRadius.md,
		backgroundColor: colors.charcoal,
		...shadows.md,
		minWidth: 150,
		minHeight: 200
	},
	playerInfo: {
		marginBottom: spacing.sm
	},
	playerName: {
		fontFamily: 'Cinzel',
		fontSize: typography.fontSizeMD,
		color: colors.boneWhite,
		marginBottom: spacing.xs
	},
	scoreText: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeSM,
		color: colors.gold
	},
	cardsText: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeSM,
		color: colors.boneWhite
	},
	cardArea: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	turnIndicator: {
		position: 'absolute',
		top: -10,
		right: -10,
		backgroundColor: colors.primary,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: borderRadius.round
	},
	turnText: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeXS,
		color: colors.boneWhite,
		fontWeight: 'bold'
	},
	currentTurn: {
		borderWidth: 2,
		borderColor: colors.primary
	},
	currentPlayer: {
		backgroundColor: colors.deepPurple
	},
	// Position-specific styles
	topPosition: {
		alignSelf: 'center',
		marginBottom: spacing.xl
	},
	rightPosition: {
		alignSelf: 'flex-end',
		marginLeft: spacing.xl
	},
	bottomPosition: {
		alignSelf: 'center',
		marginTop: spacing.xl
	},
	leftPosition: {
		alignSelf: 'flex-start',
		marginRight: spacing.xl
	}
});

export default PlayerBoard;
