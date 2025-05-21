import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Share,
	TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import Container from '../src/components/Container';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import { colors, typography, spacing } from '../src/constants/theme';

// Mock data for testing
const MOCK_ROOM_CODE = 'ABC123';
const MOCK_PLAYERS = [
	{ id: '1', name: 'You', isReady: true, isHost: true },
	{ id: '2', name: 'Player 2', isReady: false, isHost: false },
	{ id: '3', name: 'Player 3', isReady: true, isHost: false }
];

export default function LobbyScreen() {
	const [players, setPlayers] = useState(MOCK_PLAYERS);
	const [isReady, setIsReady] = useState(false);
	const [isStarting, setIsStarting] = useState(false);

	const allPlayersReady = players.every((player) => player.isReady);
	const isHost = players.find((player) => player.id === '1')?.isHost;

	const handleReadyToggle = () => {
		setIsReady(!isReady);
		// Update the current player's ready status
		setPlayers(
			players.map((player) =>
				player.id === '1' ? { ...player, isReady: !isReady } : player
			)
		);
	};

	const handleStartGame = () => {
		setIsStarting(true);
		// TODO: Implement game start logic with socket.io
		// For now, just navigate to the game screen after a delay
		setTimeout(() => {
			setIsStarting(false);
			router.push('/game');
		}, 1000);
	};

	const handleShareCode = async () => {
		try {
			await Share.share({
				message: `Join my Skull game with code: ${MOCK_ROOM_CODE}`
			});
		} catch (error) {
			console.error('Error sharing room code:', error);
		}
	};

	const renderPlayer = ({ item }: { item: (typeof MOCK_PLAYERS)[0] }) => (
		<View style={styles.playerItem}>
			<View style={styles.playerInfo}>
				<Text style={styles.playerName}>
					{item.name} {item.isHost ? '(Host)' : ''}
				</Text>
				{item.isReady ? (
					<Text style={styles.readyText}>Ready</Text>
				) : (
					<Text style={styles.notReadyText}>Not Ready</Text>
				)}
			</View>
		</View>
	);

	return (
		<Container>
			<Header title='Game Lobby' showBackButton />

			<View style={styles.content}>
				<View style={styles.roomCodeContainer}>
					<Text style={styles.roomCodeLabel}>Room Code:</Text>
					<View style={styles.roomCodeWrapper}>
						<Text style={styles.roomCode}>{MOCK_ROOM_CODE}</Text>
						<TouchableOpacity
							onPress={handleShareCode}
							style={styles.shareButton}
						>
							<Text style={styles.shareButtonText}>Share</Text>
						</TouchableOpacity>
					</View>
				</View>

				<Text style={styles.sectionTitle}>Players</Text>
				<FlatList
					data={players}
					renderItem={renderPlayer}
					keyExtractor={(item) => item.id}
					style={styles.playerList}
					contentContainerStyle={styles.playerListContent}
				/>

				<View style={styles.buttonContainer}>
					{isHost ? (
						<Button
							title='Start Game'
							onPress={handleStartGame}
							disabled={!allPlayersReady || players.length < 2}
							loading={isStarting}
							fullWidth
						/>
					) : (
						<Button
							title={isReady ? 'Not Ready' : 'Ready'}
							onPress={handleReadyToggle}
							variant={isReady ? 'outline' : 'primary'}
							fullWidth
						/>
					)}
				</View>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingHorizontal: spacing.lg
	},
	roomCodeContainer: {
		marginBottom: spacing.xl
	},
	roomCodeLabel: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeSM,
		color: colors.boneWhite,
		marginBottom: spacing.xs
	},
	roomCodeWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: colors.charcoal,
		borderRadius: 8,
		padding: spacing.md
	},
	roomCode: {
		fontFamily: 'Montserrat-Bold',
		fontSize: typography.fontSizeLG,
		color: colors.gold,
		letterSpacing: 2
	},
	shareButton: {
		backgroundColor: colors.teal,
		paddingVertical: spacing.xs,
		paddingHorizontal: spacing.md,
		borderRadius: 4
	},
	shareButtonText: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeSM,
		color: colors.boneWhite
	},
	sectionTitle: {
		fontFamily: 'Cinzel',
		fontSize: typography.fontSizeMD,
		color: colors.gold,
		marginBottom: spacing.md
	},
	playerList: {
		flex: 1
	},
	playerListContent: {
		paddingBottom: spacing.md
	},
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
	},
	buttonContainer: {
		marginVertical: spacing.lg
	}
});
