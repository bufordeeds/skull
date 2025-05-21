import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	// Load fonts
	const [fontsLoaded, fontError] = useFonts({
		Cinzel: require('../assets/fonts/Cinzel-Regular.ttf'),
		'Cinzel-Bold': require('../assets/fonts/Cinzel-Bold.ttf'),
		Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
		'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
		ShadowsIntoLight: require('../assets/fonts/ShadowsIntoLight-Regular.ttf')
	});

	useEffect(() => {
		if (fontsLoaded || fontError) {
			// Hide the splash screen after the fonts have loaded (or an error occurred)
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	// Prevent rendering until the font has loaded or an error was encountered
	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: '#2D1B40' },
				animation: 'fade'
			}}
		/>
	);
}
