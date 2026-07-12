import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../components/common';
import { useTheme } from '../theme';
import { ROUTES } from './routes';

import HomeStack from './HomeStack';
import ResumeStack from './ResumeStack';
import AIStack from './AIStack';
import TemplateStack from './TemplateStack';
import SettingsStack from './SettingsStack';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === ROUTES.HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === ROUTES.RESUME) {
            iconName = focused ? 'file-document' : 'file-document-outline';
          } else if (route.name === ROUTES.AI_ASSISTANT) {
            iconName = focused ? 'robot' : 'robot-outline';
          } else if (route.name === ROUTES.TEMPLATES) {
            iconName = focused ? 'view-grid' : 'view-grid-outline';
          } else if (route.name === ROUTES.SETTINGS) {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
          paddingTop: 8,
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: Platform.OS === 'ios' ? insets.bottom || 16 : 16,
          borderRadius: 32,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name={ROUTES.RESUME}
        component={ResumeStack}
        options={{ tabBarLabel: 'Resume' }}
      />
      <Tab.Screen
        name={ROUTES.AI_ASSISTANT}
        component={AIStack}
        options={{ tabBarLabel: 'AI Chat' }}
      />
      <Tab.Screen
        name={ROUTES.TEMPLATES}
        component={TemplateStack}
        options={{ tabBarLabel: 'Templates' }}
      />
      <Tab.Screen
        name={ROUTES.SETTINGS}
        component={SettingsStack}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
