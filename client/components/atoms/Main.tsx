import { AppTheme } from "@/app/theme/themes";
import { View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";

type MainVariant = "default" | "centered" | "padded";

interface MainProps {
  children: React.ReactNode;
  variant?: MainVariant;
  style?: ViewStyle;
}

const getVariantStyles = (variant: MainVariant, theme: AppTheme): ViewStyle => {
  switch (variant) {
    case "centered":
      return {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      };
    case "padded":
      return {
        flex: 1,
        padding: 20,
        backgroundColor: theme.colors.background,
      };
    default:
      return {
        flex: 1,
        backgroundColor: theme.colors.background,
      };
  }
};

export const Main = ({ children, variant = "default", style }: MainProps) => {
  const theme = useTheme<AppTheme>();
  const variantStyles = getVariantStyles(variant, theme);

  return (
    <View style={[variantStyles, style]}>
      {children}
    </View>
  );
};
