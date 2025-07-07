import React, { useRef, useState } from 'react';
import {
	View,
	StyleSheet,
	Animated,
	TouchableOpacity,
	Text,
	ViewStyle
} from 'react-native';
import {
	colors,
	typography,
	spacing,
	layout,
	shadows
} from '../constants/theme';

export type CardType = 'rose' | 'skull' | 'back';

interface CardProps {
	type: CardType;
	faceUp: boolean;
	onPress?: () => void;
	disabled?: boolean;
	style?: ViewStyle;
	size?: 'small' | 'medium' | 'large';
	index?: number; // For stacking cards
}

/**
 * Card component for displaying Rose and Skull cards
 */
const Card: React.FC<CardProps> = ({
	type,
	faceUp,
	onPress,
	disabled = false,
	style,
	size = 'medium',
	index = 0
}) => {
	// Animation values
	const flipAnim = useRef(new Animated.Value(faceUp ? 180 : 0)).current;
	const [flipped, setFlipped] = useState(faceUp);

	// Handle card flip animation
	const flipCard = () => {
		if (disabled) return;

		const toValue = flipped ? 0 : 180;

		Animated.spring(flipAnim, {
			toValue,
			friction: 8,
			tension: 40,
			useNativeDriver: true
		}).start(() => {
			setFlipped(!flipped);
			if (onPress) onPress();
		});
	};

	// Interpolate rotation values for the flip animation
	const frontInterpolate = flipAnim.interpolate({
		inputRange: [0, 180],
		outputRange: ['180deg', '0deg']
	});

	const backInterpolate = flipAnim.interpolate({
		inputRange: [0, 180],
		outputRange: ['0deg', '180deg']
	});

	// Card size styles
	const sizeStyles = {
		small: {
			width: layout.cardWidth * 0.7,
			height: layout.cardHeight * 0.7
		},
		medium: {
			width: layout.cardWidth,
			height: layout.cardHeight
		},
		large: {
			width: layout.cardWidth * 1.2,
			height: layout.cardHeight * 1.2
		}
	};

	// Stack offset for multiple cards
	const stackOffset = index * 4;

	// Front and back card styles with animations
	const frontAnimatedStyle = {
		transform: [{ rotateY: frontInterpolate }]
	};

	const backAnimatedStyle = {
		transform: [{ rotateY: backInterpolate }]
	};

	return (
		<TouchableOpacity
			onPress={flipCard}
			disabled={disabled || !onPress}
			activeOpacity={0.9}
			style={[
				styles.container,
				sizeStyles[size],
				{ top: stackOffset, left: stackOffset },
				style
			]}
		>
			{/* Back of card (face down) */}
			<Animated.View
				style={[
					styles.card,
					styles.cardBack,
					sizeStyles[size],
					backAnimatedStyle,
					disabled && styles.disabled
				]}
			>
				<View style={styles.cardBackDesign}>
					<Text style={styles.cardBackText}>SKULL</Text>
				</View>
			</Animated.View>

			{/* Front of card (face up) */}
			<Animated.View
				style={[
					styles.card,
					styles.cardFront,
					sizeStyles[size],
					frontAnimatedStyle,
					disabled && styles.disabled
				]}
			>
				{type === 'rose' ? (
					<View style={styles.roseCard}>
						<Text style={styles.cardSymbol}>🌹</Text>
					</View>
				) : (
					<View style={styles.skullCard}>
						<Text style={styles.cardSymbol}>💀</Text>
					</View>
				)}
			</Animated.View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center'
	},
	card: {
		backfaceVisibility: 'hidden',
		borderRadius: 8,
		position: 'absolute',
		...shadows.md
	},
	cardFront: {
		backgroundColor: colors.boneWhite,
		alignItems: 'center',
		justifyContent: 'center'
	},
	cardBack: {
		backgroundColor: colors.cardBack,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: colors.gold
	},
	cardBackDesign: {
		width: '80%',
		height: '80%',
		borderWidth: 1,
		borderColor: colors.gold,
		alignItems: 'center',
		justifyContent: 'center'
	},
	cardBackText: {
		fontFamily: 'Cinzel',
		fontSize: typography.fontSizeMD,
		color: colors.gold,
		transform: [{ rotate: '45deg' }]
	},
	roseCard: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
		backgroundColor: colors.boneWhite
	},
	skullCard: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
		backgroundColor: colors.boneWhite
	},
	cardSymbol: {
		fontSize: 40,
		textAlign: 'center'
	},
	disabled: {
		opacity: 0.7
	}
});

export default Card;
