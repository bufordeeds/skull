import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { darkTheme } from './themes';

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // You can add theme switching logic here
  const theme = darkTheme;

  return (
    <PaperProvider theme={theme}>
      {children}
    </PaperProvider>
  );
}; 

export default ThemeProvider;