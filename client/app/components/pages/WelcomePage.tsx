import React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import { Surface } from "react-native-paper";
import { Main } from "../atoms/Main";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";

const WelcomePage = () => {
  return (
    <Main>
      <ImageBackground
        source={require("@/assets/images/background.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <Surface style={styles.content} elevation={4}>
          <Text variant="headlineMedium" style={styles.title}>
            SKULL
          </Text>

          <Text variant="bodyMedium" style={styles.subtitle}>
            Where Life Meets Death
          </Text>

          <Button variant="primary" onPress={() => {}} style={styles.button}>
            New Game
          </Button>

          <Button variant="secondary" onPress={() => {}} style={styles.button}>
            Join Game
          </Button>

          <Button variant="tertiary" onPress={() => {}} style={styles.button}>
            Rules
          </Button>
        </Surface>
      </ImageBackground>
    </Main>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  content: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgb(166, 140, 68)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontSize: 48,
  },
  subtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 40,
    fontSize: 20,
  },
  button: {
    width: "80%",
    marginBottom: 16,
  },
});

export default WelcomePage;
