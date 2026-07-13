import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import { navigationRef } from './navigationRef';
import { ROUTES } from './routes';

import WelcomeScreen from '../screens/welcome/WelcomeScreen';
import MainTabNavigator from './MainTabNavigator';
import DocumentNavigator from './DocumentNavigator';
import InterviewNavigator from './InterviewNavigator';
import CareerNavigator from './CareerNavigator';
import PortfolioNavigator from './PortfolioNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { themeMode, theme } = useTheme();

  // Create custom navigation theme to match design system
  const navigationTheme = {
    ...(themeMode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(themeMode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,
      background: theme.background,
      card: theme.surface,
      text: theme.textPrimary,
      border: theme.border,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
        <Stack.Screen name={ROUTES.MAIN_TABS} component={MainTabNavigator} />
        <Stack.Screen name={ROUTES.DOCUMENT_NAVIGATOR} component={DocumentNavigator} />
        <Stack.Screen name={ROUTES.INTERVIEW_NAVIGATOR} component={InterviewNavigator} />
        <Stack.Screen name={ROUTES.CAREER_NAVIGATOR} component={CareerNavigator} />
        <Stack.Screen name={ROUTES.PORTFOLIO_NAVIGATOR} component={PortfolioNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
