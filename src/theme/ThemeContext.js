import { createContext, useContext } from 'react';

export const ThemeContext = createContext({
  theme: {},
  themeMode: 'system',
  isDark: false,
  setThemeMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);
