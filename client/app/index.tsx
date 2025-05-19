import { View, StyleSheet } from "react-native";
import { TextInput, Surface } from "react-native-paper";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Main } from "./components/atoms/Main";
import { Button } from "./components/atoms/Button";
import { Text } from "./components/atoms/Text";
import { ControlledInput } from "./components/molecules/ControlledInput";

type FormData = {
  email: string;
  password: string;
};

export default function Index() {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <Main>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium">Welcome Back</Text>

        <ControlledInput control={control} kind="email" name="email" />
        <ControlledInput control={control} kind="password" name="password" />

        <Button variant="primary" onPress={handleSubmit(onSubmit)}>
          Login
        </Button>

        <Button
          variant="tertiary"
          onPress={() => {}}
          style={styles.forgotPassword}
        >
          Forgot Password?
        </Button>
      </Surface>
    </Main>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: "white",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  forgotPassword: {
    marginTop: 16,
  },
  errorText: {
    color: "#B00020",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
});
