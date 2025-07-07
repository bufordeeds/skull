import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing } from '../constants/theme';

interface PlayerItemProps {
	player: {
		id: string;
		name: string;
		isReady: boolean;
		isHost: boolean;
	};
}

/**
 * AnimatedPlayerItem component for displaying player information with animations
 */
const AnimatedPlayerItem: React.FC<PlayerItemProps> = ({ player }) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.9)).current;

	useEffect(() => {
		// Animate when the component mounts
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true
			}),
			Animated.spring(scaleAnim, {
				toValue: 1,
				friction: 6,
				tension: 40,
				useNativeDriver: true
			})
		]).start();
	}, []);

	return (
		<Animated.View
			style={[
				styles.playerItem,
				{
					opacity: fadeAnim,
					transform: [{ scale: scaleAnim }]
				}
			]}
		>
			<View style={styles.playerInfo}>
				<Text style={styles.playerName}>
					{player.name} {player.isHost ? '(Host)' : ''}
				</Text>
				{player.isReady ? (
					<Text style={styles.readyText}>Ready</Text>
				) : (
					<Text style={styles.notReadyText}>Not Ready</Text>
				)}
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	playerItem: {
		backgroundColor: colors.charcoal,
		borderRadius: 8,
		padding: spacing.md,
		marginBottom: spacing.sm
	},
	playerInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	playerName: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeMD,
		color: colors.boneWhite
	},
	readyText: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeSM,
		color: colors.gold
	},
	notReadyText: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeSM,
		color: colors.amber
	}
});

export default AnimatedPlayerItem;
