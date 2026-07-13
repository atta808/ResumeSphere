import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import PortfolioDashboardScreen from '../screens/portfolio/PortfolioDashboardScreen';
import PortfolioPreviewScreen from '../screens/portfolio/PortfolioPreviewScreen';
import PortfolioCustomizationScreen from '../screens/portfolio/PortfolioCustomizationScreen';
import PortfolioThemeScreen from '../screens/portfolio/PortfolioThemeScreen';
import PortfolioShareScreen from '../screens/portfolio/PortfolioShareScreen';
import QRCodeScreen from '../screens/portfolio/QRCodeScreen';
import PortfolioAnalyticsScreen from '../screens/portfolio/PortfolioAnalyticsScreen';
import PortfolioHistoryScreen from '../screens/portfolio/PortfolioHistoryScreen';
import { useTheme } from '../theme/ThemeContext';

const Stack = createNativeStackNavigator();

export default function PortfolioNavigator() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.surface,
        },
        headerTintColor: theme.textPrimary,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name={ROUTES.PORTFOLIO_DASHBOARD}
        component={PortfolioDashboardScreen}
        options={{ title: 'Digital Portfolio' }}
      />
      <Stack.Screen
        name={ROUTES.PORTFOLIO_PREVIEW}
        component={PortfolioPreviewScreen}
        options={{ title: 'Preview' }}
      />
      <Stack.Screen
        name={ROUTES.PORTFOLIO_CUSTOMIZATION}
        component={PortfolioCustomizationScreen}
        options={{ title: 'Customize Sections' }}
      />
      <Stack.Screen
        name={ROUTES.PORTFOLIO_THEME}
        component={PortfolioThemeScreen}
        options={{ title: 'Theme & Style' }}
      />
      <Stack.Screen
        name={ROUTES.PORTFOLIO_SHARE}
        component={PortfolioShareScreen}
        options={{ title: 'Publish & Share' }}
      />
      <Stack.Screen
        name={ROUTES.QR_CODE}
        component={QRCodeScreen}
        options={{ title: 'QR Resume' }}
      />
      <Stack.Screen
        name={ROUTES.PORTFOLIO_ANALYTICS}
        component={PortfolioAnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
      <Stack.Screen
        name={ROUTES.PORTFOLIO_HISTORY}
        component={PortfolioHistoryScreen}
        options={{ title: 'Version History' }}
      />
    </Stack.Navigator>
  );
}
