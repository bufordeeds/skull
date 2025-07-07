import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import Container from '../src/components/Container';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import { colors, typography, spacing } from '../src/constants/theme';
import {
	runConnectionTests,
	testHttpConnection,
	testSocketConnection
} from '../src/services/testConnection';

// Define types for test results
interface TestResult {
	success: boolean;
	error: string | null;
	data?: any;
}

interface TestResults {
	http: TestResult;
	socket: TestResult;
}

export default function TestScreen() {
	const [results, setResults] = useState<TestResults | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const runTests = async () => {
		setLoading(true);
		setError(null);
		try {
			const testResults = await runConnectionTests();
			setResults(testResults as TestResults);
		} catch (err: any) {
			setError(err.message || 'An error occurred during testing');
		} finally {
			setLoading(false);
		}
	};

	// Default test result
	const defaultTestResult: TestResult = {
		success: false,
		error: null,
		data: null
	};

	const runHttpTest = async () => {
		setLoading(true);
		setError(null);
		try {
			const httpResult = await testHttpConnection();
			setResults((prev: TestResults | null) => ({
				http: { success: true, data: httpResult, error: null },
				socket: prev?.socket || defaultTestResult
			}));
		} catch (err: any) {
			setResults((prev: TestResults | null) => ({
				http: { success: false, data: null, error: err.message },
				socket: prev?.socket || defaultTestResult
			}));
		} finally {
			setLoading(false);
		}
	};

	const runSocketTest = async () => {
		setLoading(true);
		setError(null);
		try {
			await testSocketConnection();
			setResults((prev: TestResults | null) => ({
				http: prev?.http || defaultTestResult,
				socket: { success: true, error: null }
			}));
		} catch (err: any) {
			setResults((prev: TestResults | null) => ({
				http: prev?.http || defaultTestResult,
				socket: { success: false, error: err.message }
			}));
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container>
			<Header title='Connection Test' showBackButton />

			<ScrollView style={styles.content}>
				<Text style={styles.description}>
					This screen tests connectivity to the server. It will help
					diagnose connection issues.
				</Text>

				<View style={styles.buttonContainer}>
					<Button
						title='Run All Tests'
						onPress={runTests}
						disabled={loading}
						loading={loading}
						fullWidth
					/>

					<View style={styles.buttonRow}>
						<TouchableOpacity
							style={[
								styles.smallButton,
								loading && styles.disabledButton
							]}
							onPress={runHttpTest}
							disabled={loading}
						>
							<Text style={styles.smallButtonText}>
								Test HTTP
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.smallButton,
								loading && styles.disabledButton
							]}
							onPress={runSocketTest}
							disabled={loading}
						>
							<Text style={styles.smallButtonText}>
								Test Socket
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				{error && (
					<View style={styles.errorContainer}>
						<Text style={styles.errorText}>{error}</Text>
					</View>
				)}

				{results && (
					<View style={styles.resultsContainer}>
						<Text style={styles.resultsTitle}>Test Results:</Text>

						{/* HTTP Test Results */}
						<View style={styles.testResult}>
							<Text style={styles.testTitle}>
								HTTP Connection:
							</Text>
							<Text
								style={[
									styles.testStatus,
									results.http.success
										? styles.successText
										: styles.errorText
								]}
							>
								{results.http.success ? 'SUCCESS' : 'FAILED'}
							</Text>

							{results.http.error && (
								<Text style={styles.errorDetails}>
									{results.http.error}
								</Text>
							)}

							{results.http.data && (
								<View style={styles.dataContainer}>
									<Text style={styles.dataTitle}>
										Response:
									</Text>
									<Text style={styles.dataText}>
										{JSON.stringify(
											results.http.data,
											null,
											2
										)}
									</Text>
								</View>
							)}
						</View>

						{/* Socket Test Results */}
						<View style={styles.testResult}>
							<Text style={styles.testTitle}>
								Socket.io Connection:
							</Text>
							<Text
								style={[
									styles.testStatus,
									results.socket.success
										? styles.successText
										: styles.errorText
								]}
							>
								{results.socket.success ? 'SUCCESS' : 'FAILED'}
							</Text>

							{results.socket.error && (
								<Text style={styles.errorDetails}>
									{results.socket.error}
								</Text>
							)}
						</View>
					</View>
				)}
			</ScrollView>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		padding: spacing.lg
	},
	description: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeMD,
		color: colors.boneWhite,
		marginBottom: spacing.xl
	},
	buttonContainer: {
		marginBottom: spacing.xl
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: spacing.md
	},
	smallButton: {
		backgroundColor: colors.deepPurple,
		padding: spacing.md,
		borderRadius: 8,
		flex: 0.48,
		alignItems: 'center'
	},
	disabledButton: {
		opacity: 0.5
	},
	smallButtonText: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeSM,
		color: colors.boneWhite
	},
	errorContainer: {
		backgroundColor: colors.bloodRed,
		padding: spacing.md,
		borderRadius: 8,
		marginBottom: spacing.lg
	},
	errorText: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeMD,
		color: colors.boneWhite
	},
	resultsContainer: {
		backgroundColor: colors.charcoal,
		padding: spacing.md,
		borderRadius: 8
	},
	resultsTitle: {
		fontFamily: 'Montserrat-Bold',
		fontSize: typography.fontSizeLG,
		color: colors.boneWhite,
		marginBottom: spacing.md
	},
	testResult: {
		marginBottom: spacing.lg
	},
	testTitle: {
		fontFamily: 'Montserrat-Bold',
		fontSize: typography.fontSizeMD,
		color: colors.boneWhite
	},
	testStatus: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeMD,
		marginTop: spacing.xs
	},
	successText: {
		color: colors.teal
	},
	errorDetails: {
		fontFamily: 'Montserrat',
		fontSize: typography.fontSizeSM,
		color: colors.bloodRed,
		marginTop: spacing.xs
	},
	dataContainer: {
		marginTop: spacing.sm,
		backgroundColor: colors.charcoal,
		padding: spacing.sm,
		borderRadius: 4
	},
	dataTitle: {
		fontFamily: 'Montserrat-Bold',
		fontSize: typography.fontSizeSM,
		color: colors.boneWhite,
		marginBottom: spacing.xs
	},
	dataText: {
		fontFamily: 'SpaceMono-Regular',
		fontSize: typography.fontSizeXS,
		color: colors.darkGray
	}
});
