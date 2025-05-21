import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import Container from '../src/components/Container';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import { colors, typography, spacing } from '../src/constants/theme';

export default function HomeScreen() {
	return (
		<Container>
			<View style={styles.content}>
				<View style={styles.logoContainer}>
					<Text style={styles.title}>SKULL</Text>
					<Text style={styles.subtitle}>
						The Game of Bluffing & Deception
					</Text>
				</View>

				<View style={styles.buttonContainer}>
					<Link href='/create' asChild>
						<Button
							title='Create Game'
							variant='primary'
							size='large'
							fullWidth
							onPress={() => {}}
						/>
					</Link>

					<View style={styles.buttonSpacer} />

					<Link href='/join' asChild>
						<Button
							title='Join Game'
							variant='secondary'
							size='large'
							fullWidth
							onPress={() => {}}
						/>
					</Link>

					<View style={styles.buttonSpacer} />

					<Link href='/rules' asChild>
						<Button
							title='How to Play'
							variant='outline'
							size='large'
							fullWidth
							onPress={() => {}}
						/>
					</Link>
				</View>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: spacing.lg
	},
	logoContainer: {
		alignItems: 'center',
		marginBottom: spacing.xxl
	},
	title: {
		fontFamily: 'Cinzel',
		fontSize: 48,
		color: colors.gold,
		marginBottom: spacing.sm
	},
	subtitle: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeMD,
		color: colors.boneWhite,
		textAlign: 'center'
	},
	buttonContainer: {
		width: '100%',
		maxWidth: 300
	},
	buttonSpacer: {
		height: spacing.md
	}
});
