import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import Container from '../src/components/Container';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import { colors, typography, spacing } from '../src/constants/theme';

export default function CreateGameScreen() {
	const [playerName, setPlayerName] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	const handleCreateGame = () => {
		if (!playerName.trim()) return;

		setIsCreating(true);
		// TODO: Implement game creation logic with socket.io
		// For now, just navigate to the lobby screen after a delay
		setTimeout(() => {
			setIsCreating(false);
			router.push('/lobby');
		}, 1000);
	};

	return (
		<Container>
			<Header title='Create Game' showBackButton />

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
						disabled={!playerName.trim()}
						loading={isCreating}
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
