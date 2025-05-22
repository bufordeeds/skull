import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const colors = {
  primary: "#A68C44", // Gold
  secondary: "#2C2C2C", // Dark Gray
  background: "#000000", // Black
  surface: "#1A1A1A", // Dark Surface
  error: "#CF6679", // Error Red
  text: {
    primary: "#FFFFFF",
    secondary: "#CCCCCC",
    disabled: "#666666",
  },
  // Game specific colors
  skull: {
    primary: "#A68C44", // Gold
    secondary: "#2C2C2C", // Dark Gray
    accent: "#8B0000", // Dark Red
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  fontWeights: {
    regular: "400",
    medium: "500",
    bold: "700",
  },
} as const;

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    onSurface: colors.text.primary,
    onSurfaceVariant: colors.text.secondary,
  },
  spacing,
  typography,
} as const;

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    onSurface: colors.text.primary,
    onSurfaceVariant: colors.text.secondary,
  },
  spacing,
  typography,
} as const;

export type AppTheme = typeof darkTheme;
