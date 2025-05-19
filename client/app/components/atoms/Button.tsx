import {
  ButtonProps as PaperButtonProps,
  Button as PaperButton,
} from "react-native-paper";
import { StyleSheet } from "react-native";

export interface ButtonProps extends PaperButtonProps {
  variant?: "primary" | "secondary" | "tertiary";
}

const VARIANTS = new Set<string>(["primary", "secondary", "tertiary"]);

const variantConfig = {
  primary: {
    mode: "contained",
  },
  secondary: {
    mode: "outlined",
  },
  tertiary: {
    mode: "text",
  },
} as const;

const getConfig = (variant: ButtonProps["variant"]) => {
  if (!variant || !VARIANTS.has(variant)) {
    throw new Error(`Invalid variant: ${variant}`);
  }

  return variantConfig[variant];
};

export const Button = ({
  children,
  variant = "primary",
  style,
  contentStyle,
  ...props
}: ButtonProps) => {
  const config = getConfig(variant);

  return (
    <PaperButton
      mode={config.mode}
      {...props}
      contentStyle={[styles.buttonContent, contentStyle]}
      style={[styles.button, styles[variant], style]}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  primary: {},
  secondary: {
    backgroundColor: "#fff",
  },
  tertiary: {},
});

export default Button;
