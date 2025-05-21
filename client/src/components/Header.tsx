import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ViewStyle,
	TextStyle
} from 'react-native';
import { router } from 'expo-router';
import { colors, typography, spacing } from '../constants/theme';

interface HeaderProps {
	title: string;
	showBackButton?: boolean;
	onBackPress?: () => void;
	rightComponent?: React.ReactNode;
}

/**
 * Header component for screen titles and navigation
 */
const Header: React.FC<HeaderProps> = ({
	title,
	showBackButton = false,
	onBackPress,
	rightComponent
}) => {
	const handleBackPress = () => {
		if (onBackPress) {
			onBackPress();
		} else {
			router.back();
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.leftContainer}>
				{showBackButton && (
					<TouchableOpacity
						onPress={handleBackPress}
						style={styles.backButton}
					>
						<Text style={styles.backButtonText}>←</Text>
					</TouchableOpacity>
				)}
			</View>

			<Text style={styles.title}>{title}</Text>

			<View style={styles.rightContainer}>
				{rightComponent || <View style={styles.placeholder} />}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 60,
		width: '100%',
		paddingHorizontal: spacing.md,
		marginBottom: spacing.md
	},
	leftContainer: {
		width: 40,
		alignItems: 'flex-start'
	},
	rightContainer: {
		width: 40,
		alignItems: 'flex-end'
	},
	title: {
		color: colors.text,
		fontSize: typography.fontSizeLG,
		fontWeight: '700' // Using direct value instead of typography.fontWeightBold
	},
	backButton: {
		padding: spacing.xs
	},
	backButtonText: {
		color: colors.text,
		fontSize: typography.fontSizeXL
	},
	placeholder: {
		width: 40
	}
});

export default Header;
