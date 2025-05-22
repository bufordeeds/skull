import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text } from "../atoms/Text";
import { TextInput } from "../atoms/TextInput";
import { StyleSheet } from "react-native";

type InputKind = "text" | "password" | "email";

type ControlledInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  kind: InputKind;
  label?: string;
};

const VALID_EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const ruleset = {
  email: {
    required: "Email is required",
    pattern: {
      value: VALID_EMAIL_REGEX,
      message: "Invalid email address",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
  },
  text: {},
} as const;

export const ControlledInput = <T extends FieldValues>({
  control,
  name,
  kind,
  label,
}: ControlledInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={ruleset[kind]}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <TextInput
            mode="outlined"
            kind={kind}
            label={label}
            value={value}
            onChangeText={onChange}
            style={styles.input}
            error={!!error}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: "#B00020",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
});

export default ControlledInput;
