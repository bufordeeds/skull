import {
  TextInput as PaperTextInput,
  TextInputProps as PaperTextInputProps,
  TextInputIconProps,
} from "react-native-paper";
import { useState } from "react";
export interface TextInputProps extends PaperTextInputProps {
  label?: string;
  kind?: "password" | "email" | "text";
}

const PasswordInput = (props: TextInputProps) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  return (
    <PaperTextInput
      {...props}
      label={props.label || "Password"}
      secureTextEntry={secureTextEntry}
      right={
        <PaperTextInput.Icon
          icon={secureTextEntry ? "eye" : "eye-off"}
          onPress={() => setSecureTextEntry(!secureTextEntry)}
        />
      }
    />
  );
};

const EmailInput = (props: TextInputProps) => {
  return (
    <PaperTextInput
      label={props.label || "Email"}
      keyboardType="email-address"
      autoCapitalize="none"
    />
  );
};

export const TextInput = ({
  kind,
  label = "Text",
  ...props
}: TextInputProps) => {
  switch (kind) {
    case "password":
      return <PasswordInput {...props} />;
    case "email":
      return <EmailInput {...props} />;
  }
  return <PaperTextInput {...props} label={label} />;
};

TextInput.Icon = (props: TextInputIconProps) => {
  return <PaperTextInput.Icon {...props} />;
};
