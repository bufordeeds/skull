import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import Container from '../src/components/Container';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import LoadingOverlay from '../src/components/LoadingOverlay';
import { colors, typography, spacing } from '../src/constants/theme';
import { useGame } from '../src/context/GameContext';

export default function JoinGameScreen() {
	const [playerName, setPlayerName] = useState('');
	const [roomCode, setRoomCode] = useState('');
	const [localError, setLocalError] = useState('');
	const { joinRoom, loading, error } = useGame();

	// Handle errors from the game context
	useEffect(() => {
		if (error) {
			setLocalError(error);
		}
	}, [error]);

	const handleJoinGame = async () => {
		if (!playerName.trim() || !roomCode.trim()) return;

		setLocalError('');

		try {
			// Join room using the game context
			await joinRoom(roomCode, playerName);

			// Navigate to lobby on success
			router.push('/lobby');
		} catch (err) {
			// Error is handled by the game context and displayed via the useEffect above
			console.error('Failed to join room:', err);
		}
	};

	return (
		<Container>
			<Header title='Join Game' showBackButton />
			<LoadingOverlay visible={loading} text='Joining game...' />

			<View style={styles.content}>
				<Text style={styles.label}>Room Code</Text>
				<TextInput
					style={styles.input}
					value={roomCode}
					onChangeText={(text) => {
						setRoomCode(text.toUpperCase());
						setLocalError('');
					}}
					placeholder='Enter room code'
					placeholderTextColor={colors.darkGray}
					maxLength={6}
					autoCapitalize='characters'
					autoFocus
				/>

				<Text style={styles.label}>Your Name</Text>
				<TextInput
					style={styles.input}
					value={playerName}
					onChangeText={setPlayerName}
					placeholder='Enter your name'
					placeholderTextColor={colors.darkGray}
					maxLength={20}
				/>

				{localError ? (
					<Text style={styles.errorText}>{localError}</Text>
				) : null}

				<View style={styles.buttonContainer}>
					<Button
						title='Join Game'
						onPress={handleJoinGame}
						disabled={
							!playerName.trim() || !roomCode.trim() || loading
						}
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
	errorText: {
		color: colors.bloodRed,
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeSM,
		marginBottom: spacing.md
	},
	buttonContainer: {
		marginTop: spacing.md
	}
});
