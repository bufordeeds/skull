import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";
import { useForm } from "react-hook-form";
import { Main } from "../atoms/Main";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { ControlledInput } from "../molecules/ControlledInput";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { control, handleSubmit } = useForm<FormData>({
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
  surface: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: "white",
  },
  forgotPassword: {
    marginTop: 16,
  },
});
