import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors, typography, spacing } from '../constants/theme';

interface LoadingOverlayProps {
	visible: boolean;
	text?: string;
	transparent?: boolean;
}

/**
 * LoadingOverlay component to display a loading indicator over content
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
	visible,
	text,
	transparent = false
}) => {
	if (!visible) return null;

	return (
		<View
			style={[
				styles.container,
				transparent && styles.transparentBackground
			]}
		>
			<View style={styles.loadingBox}>
				<ActivityIndicator
					size='large'
					color={colors.gold}
					style={styles.spinner}
				/>
				{text && <Text style={styles.text}>{text}</Text>}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(45, 27, 64, 0.8)', // deepPurple with opacity
		zIndex: 1000
	},
	transparentBackground: {
		backgroundColor: 'transparent'
	},
	loadingBox: {
		padding: spacing.lg,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center'
	},
	spinner: {
		marginBottom: spacing.sm
	},
	text: {
		color: colors.boneWhite,
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeMD,
		textAlign: 'center'
	}
});

export default LoadingOverlay;
