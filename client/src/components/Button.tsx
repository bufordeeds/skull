import React from 'react';
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	ActivityIndicator,
	ViewStyle,
	TextStyle
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

interface ButtonProps {
	title: string;
	onPress: () => void;
	variant?: 'primary' | 'secondary' | 'danger' | 'outline';
	size?: 'small' | 'medium' | 'large';
	disabled?: boolean;
	loading?: boolean;
	style?: ViewStyle;
	textStyle?: TextStyle;
	fullWidth?: boolean;
}

/**
 * Button component for consistent button styling across the app
 */
const Button: React.FC<ButtonProps> = ({
	title,
	onPress,
	variant = 'primary',
	size = 'medium',
	disabled = false,
	loading = false,
	style,
	textStyle,
	fullWidth = false
}) => {
	// Determine button and text styles based on variant and size
	const getButtonStyles = () => {
		const variantStyles = {
			primary: styles.primaryButton,
			secondary: styles.secondaryButton,
			danger: styles.dangerButton,
			outline: styles.outlineButton
		};

		const sizeStyles = {
			small: styles.smallButton,
			medium: styles.mediumButton,
			large: styles.largeButton
		};

		const widthStyle = fullWidth ? styles.fullWidth : {};

		return [
			styles.button,
			variantStyles[variant],
			sizeStyles[size],
			widthStyle,
			disabled && styles.disabledButton,
			style
		];
	};

	const getTextStyles = () => {
		const variantTextStyles = {
			primary: styles.primaryText,
			secondary: styles.secondaryText,
			danger: styles.dangerText,
			outline: styles.outlineText
		};

		const sizeTextStyles = {
			small: styles.smallText,
			medium: styles.mediumText,
			large: styles.largeText
		};

		return [
			styles.text,
			variantTextStyles[variant],
			sizeTextStyles[size],
			disabled && styles.disabledText,
			textStyle
		];
	};

	return (
		<TouchableOpacity
			style={getButtonStyles()}
			onPress={onPress}
			disabled={disabled || loading}
			activeOpacity={0.8}
		>
			{loading ? (
				<ActivityIndicator
					color={
						variant === 'outline'
							? colors.primary
							: colors.boneWhite
					}
					size={size === 'small' ? 'small' : 'small'}
				/>
			) : (
				<Text style={getTextStyles()}>{title}</Text>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: borderRadius.md,
		justifyContent: 'center',
		alignItems: 'center'
	},
	primaryButton: {
		backgroundColor: colors.primary
	},
	secondaryButton: {
		backgroundColor: colors.secondary
	},
	dangerButton: {
		backgroundColor: colors.danger
	},
	outlineButton: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: colors.primary
	},
	smallButton: {
		paddingVertical: spacing.xs,
		paddingHorizontal: spacing.md
	},
	mediumButton: {
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.lg
	},
	largeButton: {
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.xl
	},
	fullWidth: {
		width: '100%'
	},
	disabledButton: {
		backgroundColor: colors.inactive,
		borderColor: colors.inactive
	},
	text: {
		textAlign: 'center'
	},
	primaryText: {
		color: colors.boneWhite
	},
	secondaryText: {
		color: colors.deepPurple
	},
	dangerText: {
		color: colors.boneWhite
	},
	outlineText: {
		color: colors.primary
	},
	smallText: {
		fontSize: typography.fontSizeSM,
		fontWeight: '500'
	},
	mediumText: {
		fontSize: typography.fontSizeMD,
		fontWeight: '500'
	},
	largeText: {
		fontSize: typography.fontSizeLG,
		fontWeight: '500'
	},
	disabledText: {
		color: colors.darkGray
	}
});

export default Button;
