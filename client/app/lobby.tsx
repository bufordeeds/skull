import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Share,
	TouchableOpacity,
	Alert
} from 'react-native';
import { router } from 'expo-router';
import Container from '../src/components/Container';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import LoadingOverlay from '../src/components/LoadingOverlay';
import AnimatedPlayerItem from '../src/components/AnimatedPlayerItem';
import { colors, typography, spacing } from '../src/constants/theme';
import { useGame } from '../src/context/GameContext';
import { Player } from '../src/services/socketService';

export default function LobbyScreen() {
	const { room, player, loading, error, setReady, startGame, leaveRoom } =
		useGame();

	// Handle errors
	useEffect(() => {
		if (error) {
			Alert.alert('Error', error);
		}
	}, [error]);

	// Redirect to home if no room data is available
	useEffect(() => {
		if (!room && !loading) {
			router.replace('/');
		}
	}, [room, loading]);

	// If room or player is not available, show loading
	if (!room || !player) {
		return (
			<Container>
				<Header title='Game Lobby' showBackButton />
				<LoadingOverlay visible={true} text='Loading lobby...' />
			</Container>
		);
	}

	const allPlayersReady = room.players.every((p) => p.isReady);
	const isHost = player.isHost;

	const handleReadyToggle = async () => {
		try {
			await setReady(!player.isReady);
		} catch (err) {
			console.error('Failed to set ready status:', err);
		}
	};

	const handleStartGame = async () => {
		try {
			await startGame();
			router.push('/game');
		} catch (err) {
			console.error('Failed to start game:', err);
		}
	};

	const handleLeaveRoom = async () => {
		try {
			await leaveRoom();
			router.replace('/');
		} catch (err) {
			console.error('Failed to leave room:', err);
		}
	};

	const handleShareCode = async () => {
		try {
			await Share.share({
				message: `Join my Skull game with code: ${room.code}`
			});
		} catch (error) {
			console.error('Error sharing room code:', error);
		}
	};

	const renderPlayer = ({ item }: { item: Player }) => (
		<AnimatedPlayerItem player={item} />
	);

	return (
		<Container>
			<Header
				title='Game Lobby'
				showBackButton
				onBackPress={handleLeaveRoom}
			/>
			<LoadingOverlay visible={loading} text='Loading...' />

			<View style={styles.content}>
				<View style={styles.roomCodeContainer}>
					<Text style={styles.roomCodeLabel}>Room Code:</Text>
					<View style={styles.roomCodeWrapper}>
						<Text style={styles.roomCode}>{room.code}</Text>
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
					data={room.players}
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
							disabled={
								!allPlayersReady || room.players.length < 2
							}
							loading={loading}
							fullWidth
						/>
					) : (
						<Button
							title={player.isReady ? 'Not Ready' : 'Ready'}
							onPress={handleReadyToggle}
							variant={player.isReady ? 'outline' : 'primary'}
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
	simulateButton: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: colors.teal,
		justifyContent: 'center',
		alignItems: 'center'
	},
	simulateButtonText: {
		color: colors.boneWhite,
		fontSize: typography.fontSizeMD,
		fontWeight: 'bold'
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
