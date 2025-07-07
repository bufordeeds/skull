import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Card, { CardType } from './Card';
import { spacing } from '../constants/theme';

interface CardStackProps {
	cards: CardType[];
	faceUp?: boolean[];
	onCardPress?: (index: number) => void;
	disabled?: boolean;
	style?: ViewStyle;
	size?: 'small' | 'medium' | 'large';
	maxVisible?: number;
}

/**
 * CardStack component for displaying a stack of cards
 */
const CardStack: React.FC<CardStackProps> = ({
	cards,
	faceUp = [],
	onCardPress,
	disabled = false,
	style,
	size = 'medium',
	maxVisible = 4
}) => {
	// Limit the number of visible cards
	const visibleCards = cards.slice(0, maxVisible);

	return (
		<View style={[styles.container, style]}>
			{visibleCards.map((cardType, index) => (
				<Card
					key={`card-${index}`}
					type={cardType}
					faceUp={faceUp[index] || false}
					onPress={onCardPress ? () => onCardPress(index) : undefined}
					disabled={disabled}
					size={size}
					index={visibleCards.length - index - 1}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		minHeight: 120,
		minWidth: 80,
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: spacing.md
	}
});

export default CardStack;
