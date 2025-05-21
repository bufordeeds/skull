import React, { ReactNode } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { colors, spacing } from '../constants/theme';

interface ContainerProps {
	children: ReactNode;
	style?: object;
	safeArea?: boolean;
	paddingHorizontal?: boolean;
}

/**
 * Container component for consistent layout across screens
 */
const Container: React.FC<ContainerProps> = ({
	children,
	style,
	safeArea = true,
	paddingHorizontal = true
}) => {
	const Wrapper = safeArea ? SafeAreaView : View;

	return (
		<Wrapper
			style={[
				styles.container,
				paddingHorizontal && styles.padding,
				style
			]}
		>
			<StatusBar
				barStyle='light-content'
				backgroundColor={colors.deepPurple}
			/>
			{children}
		</Wrapper>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background
	},
	padding: {
		paddingHorizontal: spacing.md
	}
});

export default Container;
