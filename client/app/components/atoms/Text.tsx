import {
  TextProps as PaperTextProps,
  Text as PaperText,
  MD3TypescaleKey,
} from "react-native-paper";
import { StyleSheet } from "react-native";

export interface TextProps
  extends Omit<PaperTextProps<keyof typeof MD3TypescaleKey>, "variant"> {
  variant?: Extract<
    keyof typeof MD3TypescaleKey,
    "headlineMedium" | "bodyMedium"
  >;
}

export const Text = ({
  children,
  variant = "bodyMedium",
  style,
  ...props
}: TextProps) => {
  return (
    <PaperText {...props} variant={variant} style={[styles[variant], style]}>
      {children}
    </PaperText>
  );
};

const styles = StyleSheet.create({
  headlineMedium: {
    textAlign: "center",
    marginBottom: 24,
  },
  bodyMedium: {},
});
