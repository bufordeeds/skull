import {
  TextInput as PaperTextInput,
  TextInputProps as PaperTextInputProps,
} from "react-native-paper";

export interface TextInputProps extends PaperTextInputProps {
  label: string;
}

export const TextInput = (props: TextInputProps) => {
  return <PaperTextInput {...props} />;
};
