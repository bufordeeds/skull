/**
 * Theme and styling constants for the Skull game
 */

// Color palette from DESIGN.md
export const colors = {
	// Primary colors
	deepPurple: '#2D1B40',
	bloodRed: '#8B0000',
	gold: '#FFD700',
	boneWhite: '#F8F0E3',

	// Secondary colors
	darkGray: '#333333',
	teal: '#008080',
	amber: '#FFBF00',
	charcoal: '#36454F',

	// Utility colors
	background: '#2D1B40', // Deep Purple
	text: '#F8F0E3', // Bone White
	primary: '#008080', // Teal
	secondary: '#FFD700', // Gold
	danger: '#8B0000', // Blood Red
	warning: '#FFBF00', // Amber
	inactive: '#333333', // Dark Gray
	cardBack: '#36454F' // Charcoal
};

// Typography
export const typography = {
	// Font families
	fontFamilyPrimary: 'Cinzel', // For headings and game title
	fontFamilySecondary: 'Montserrat', // For body text and UI elements
	fontFamilyAccent: 'Shadows Into Light', // For handwritten elements

	// Font sizes
	fontSizeXS: 12,
	fontSizeSM: 14,
	fontSizeMD: 16,
	fontSizeLG: 20,
	fontSizeXL: 24,
	fontSizeXXL: 32,

	// Font weights
	fontWeightLight: '300',
	fontWeightRegular: '400',
	fontWeightMedium: '500',
	fontWeightBold: '700'
};

// Spacing
export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48
};

// Border radius
export const borderRadius = {
	sm: 4,
	md: 8,
	lg: 16,
	xl: 24,
	round: 9999
};

// Shadows
export const shadows = {
	sm: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2
	},
	md: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4
	},
	lg: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8
	}
};

// Animation durations
export const animation = {
	fast: 200,
	medium: 300,
	slow: 500
};

// Layout
export const layout = {
	maxWidth: 1200,
	cardWidth: 80,
	cardHeight: 120,
	playerSize: 60
};

// Z-index
export const zIndex = {
	base: 1,
	card: 10,
	modal: 100,
	tooltip: 200
};

// Export all theme constants
export default {
	colors,
	typography,
	spacing,
	borderRadius,
	shadows,
	animation,
	layout,
	zIndex
};
