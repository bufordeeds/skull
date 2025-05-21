import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Container from '../src/components/Container';
import Header from '../src/components/Header';
import { colors, typography, spacing } from '../src/constants/theme';

export default function RulesScreen() {
	return (
		<Container>
			<Header title='How to Play' showBackButton />

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.content}
			>
				<Text style={styles.sectionTitle}>Game Components</Text>
				<Text style={styles.paragraph}>
					Each player has a set of 4 cards:
				</Text>
				<Text style={styles.listItem}>• 3 Rose cards (safe)</Text>
				<Text style={styles.listItem}>• 1 Skull card (dangerous)</Text>

				<Text style={styles.sectionTitle}>Game Flow</Text>
				<Text style={styles.paragraph}>
					The game is played in rounds, with each round consisting of
					three phases:
				</Text>

				<Text style={styles.subTitle}>1. Stack Phase</Text>
				<Text style={styles.paragraph}>
					Starting with the first player and proceeding clockwise,
					each player must place one card face-down in front of them.
				</Text>
				<Text style={styles.paragraph}>
					After everyone has placed at least one card, on your turn
					you may either:
				</Text>
				<Text style={styles.listItem}>
					• Place another card face-down on top of your stack (if you
					have cards remaining in your hand)
				</Text>
				<Text style={styles.listItem}>• Start the bidding phase</Text>

				<Text style={styles.subTitle}>2. Bidding Phase</Text>
				<Text style={styles.paragraph}>
					The player who chose to start bidding makes the first bid.
				</Text>
				<Text style={styles.paragraph}>
					A bid is a number representing how many cards the player
					believes they can flip without revealing a skull.
				</Text>
				<Text style={styles.paragraph}>
					Proceeding clockwise, each player must either:
				</Text>
				<Text style={styles.listItem}>• Make a higher bid</Text>
				<Text style={styles.listItem}>
					• Pass (once you pass, you cannot bid again in this round)
				</Text>
				<Text style={styles.paragraph}>
					Bidding continues until all players except one have passed.
				</Text>

				<Text style={styles.subTitle}>3. Flipping Phase</Text>
				<Text style={styles.paragraph}>
					The highest bidder must now flip cards equal to their bid
					without revealing a skull.
				</Text>
				<Text style={styles.paragraph}>
					The player MUST start by flipping their own cards first, one
					by one.
				</Text>
				<Text style={styles.paragraph}>
					After flipping all of their own cards, they may choose cards
					from other players to flip.
				</Text>
				<Text style={styles.paragraph}>
					When choosing another player's cards, they must flip from
					the top of that player's stack.
				</Text>

				<Text style={styles.sectionTitle}>Resolution</Text>
				<Text style={styles.paragraph}>
					If the player successfully flips the number of cards they
					bid without revealing a skull:
				</Text>
				<Text style={styles.listItem}>• They score one point.</Text>
				<Text style={styles.listItem}>
					• All cards are returned to their owners.
				</Text>

				<Text style={styles.paragraph}>
					If the player reveals a skull:
				</Text>
				<Text style={styles.listItem}>
					• They lose one of their cards at random (removed from the
					game).
				</Text>
				<Text style={styles.listItem}>
					• All cards are returned to their owners.
				</Text>
				<Text style={styles.listItem}>
					• If the skull revealed belonged to another player, that
					player chooses which of the bidder's cards to remove.
				</Text>

				<Text style={styles.sectionTitle}>Winning the Game</Text>
				<Text style={styles.paragraph}>
					The first player to score 2 points wins the game.
				</Text>
				<Text style={styles.paragraph}>
					If a player loses all their cards, they are eliminated from
					the game.
				</Text>
			</ScrollView>
		</Container>
	);
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1
	},
	content: {
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.lg,
		paddingBottom: spacing.xxl * 2
	},
	sectionTitle: {
		fontFamily: 'Cinzel',
		fontSize: typography.fontSizeLG,
		color: colors.gold,
		marginTop: spacing.lg,
		marginBottom: spacing.sm
	},
	subTitle: {
		fontFamily: 'Montserrat-Bold',
		fontSize: typography.fontSizeMD,
		color: colors.boneWhite,
		marginTop: spacing.md,
		marginBottom: spacing.xs
	},
	paragraph: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeMD,
		color: colors.boneWhite,
		marginBottom: spacing.sm,
		lineHeight: 24
	},
	listItem: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeMD,
		color: colors.boneWhite,
		marginBottom: spacing.xs,
		paddingLeft: spacing.md,
		lineHeight: 24
	}
});
