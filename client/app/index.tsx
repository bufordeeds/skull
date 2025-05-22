import WelcomePage from "./components/pages/WelcomePage";
import ThemeProvider from "./theme/ThemeProvider";

export default function Index() {
  return (
    <ThemeProvider>
      <WelcomePage />
    </ThemeProvider>
  );
}
