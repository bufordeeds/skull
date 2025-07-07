import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import Container from '../src/components/Container';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import LoadingOverlay from '../src/components/LoadingOverlay';
import { colors, typography, spacing } from '../src/constants/theme';
import { useGame } from '../src/context/GameContext';

export default function CreateGameScreen() {
	const [playerName, setPlayerName] = useState('');
	const { createRoom, loading, error } = useGame();

	// Handle errors
	useEffect(() => {
		if (error) {
			Alert.alert('Error', error);
		}
	}, [error]);

	const handleCreateGame = async () => {
		if (!playerName.trim()) return;

		try {
			// Create room using the game context
			await createRoom(playerName);

			// Navigate to lobby on success
			router.push('/lobby');
		} catch (err) {
			// Error is handled by the game context and displayed via the useEffect above
			console.error('Failed to create room:', err);
		}
	};

	return (
		<Container>
			<Header title='Create Game' showBackButton />
			<LoadingOverlay visible={loading} text='Creating game...' />

			<View style={styles.content}>
				<Text style={styles.label}>Your Name</Text>
				<TextInput
					style={styles.input}
					value={playerName}
					onChangeText={setPlayerName}
					placeholder='Enter your name'
					placeholderTextColor={colors.darkGray}
					maxLength={20}
					autoFocus
				/>

				<View style={styles.buttonContainer}>
					<Button
						title='Create Game'
						onPress={handleCreateGame}
						disabled={!playerName.trim() || loading}
						loading={loading}
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
		paddingTop: spacing.xl
	},
	label: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeMD,
		color: colors.boneWhite,
		marginBottom: spacing.sm
	},
	input: {
		backgroundColor: colors.charcoal,
		color: colors.boneWhite,
		padding: spacing.md,
		borderRadius: 8,
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeMD,
		marginBottom: spacing.xl
	},
	buttonContainer: {
		marginTop: spacing.md
	}
});
