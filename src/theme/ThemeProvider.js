import React, { useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from './ThemeContext';
import { lightTheme, darkTheme } from './colors';

const THEME_STORAGE_KEY = '@ResumeSphere_ThemeMode';

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState('system'); // 'light', 'dark', or 'system'
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const storedThemeMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedThemeMode) {
          setThemeModeState(storedThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme mode:', error);
      } finally {
        setIsReady(true);
      }
    };
    loadThemeMode();
  }, []);

  const setThemeMode = async (mode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  };

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const contextValue = useMemo(
    () => ({
      theme,
      themeMode,
      isDark,
      setThemeMode,
    }),
    [theme, themeMode, isDark]
  );

  if (!isReady) {
    return null; // or a loading screen if necessary
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
