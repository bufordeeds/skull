import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import Container from '../src/components/Container';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import { colors, typography, spacing } from '../src/constants/theme';

export default function JoinGameScreen() {
	const [playerName, setPlayerName] = useState('');
	const [roomCode, setRoomCode] = useState('');
	const [isJoining, setIsJoining] = useState(false);
	const [error, setError] = useState('');

	const handleJoinGame = () => {
		if (!playerName.trim() || !roomCode.trim()) return;

		setIsJoining(true);
		setError('');

		// TODO: Implement game joining logic with socket.io
		// For now, just navigate to the lobby screen after a delay
		setTimeout(() => {
			setIsJoining(false);
			router.push('/lobby');
		}, 1000);
	};

	return (
		<Container>
			<Header title='Join Game' showBackButton />

			<View style={styles.content}>
				<Text style={styles.label}>Room Code</Text>
				<TextInput
					style={styles.input}
					value={roomCode}
					onChangeText={(text) => {
						setRoomCode(text.toUpperCase());
						setError('');
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

				{error ? <Text style={styles.errorText}>{error}</Text> : null}

				<View style={styles.buttonContainer}>
					<Button
						title='Join Game'
						onPress={handleJoinGame}
						disabled={!playerName.trim() || !roomCode.trim()}
						loading={isJoining}
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
