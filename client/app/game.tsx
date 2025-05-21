import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Container from '../src/components/Container';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import { colors, typography, spacing } from '../src/constants/theme';

export default function GameScreen() {
	const handleEndGame = () => {
		// In a real implementation, this would confirm with the user first
		router.replace('/');
	};

	return (
		<Container>
			<Header title='Skull Game' showBackButton={false} />

			<View style={styles.content}>
				<Text style={styles.title}>Game Board</Text>
				<Text style={styles.subtitle}>
					This is a placeholder for the game board implementation
				</Text>

				<View style={styles.placeholderBoard}>
					<Text style={styles.placeholderText}>
						Game mechanics will be implemented in Phase 4
					</Text>
				</View>

				<View style={styles.buttonContainer}>
					<Button
						title='End Game'
						onPress={handleEndGame}
						variant='danger'
						fullWidth
					/>
				</View>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingHorizontal: spacing.lg,
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontFamily: 'Cinzel',
		fontSize: typography.fontSizeXL,
		color: colors.gold,
		marginBottom: spacing.sm,
		textAlign: 'center'
	},
	subtitle: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeMD,
		color: colors.boneWhite,
		marginBottom: spacing.xl,
		textAlign: 'center'
	},
	placeholderBoard: {
		width: '100%',
		height: 300,
		backgroundColor: colors.charcoal,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
		padding: spacing.lg,
		marginBottom: spacing.xl
	},
	placeholderText: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeMD,
		color: colors.boneWhite,
		textAlign: 'center'
	},
	buttonContainer: {
		width: '100%',
		marginTop: spacing.xl
	}
});
