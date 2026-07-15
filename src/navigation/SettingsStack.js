import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/settings/SettingsScreen';
import AccountScreen from '../screens/settings/AccountScreen';
import SyncDashboardScreen from '../screens/settings/SyncDashboardScreen';
import BackupRestoreScreen from '../screens/settings/BackupRestoreScreen';
import ConnectedDevicesScreen from '../screens/settings/ConnectedDevicesScreen';
import PrivacySecurityScreen from '../screens/settings/PrivacySecurityScreen';
import { ROUTES } from './routes';
import { ScreenWrapper } from '../components/common';

const Stack = createNativeStackNavigator();

const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        screenLayout: ({ children, route, options }) => {
          return (
            <ScreenWrapper
              safeTop={options.safeTop}
              safeBottom={options.safeBottom}
              keyboardAware={options.keyboardAware}
              backgroundColor={options.backgroundColor}
            >
              {children}
            </ScreenWrapper>
          );
        }
      }}
    >
      <Stack.Screen name={ROUTES.SETTINGS_SCREEN} component={SettingsScreen} />
      <Stack.Screen name={ROUTES.ACCOUNT} component={AccountScreen} />
      <Stack.Screen name={ROUTES.CLOUD_SYNC} component={SyncDashboardScreen} />
      <Stack.Screen name={ROUTES.BACKUP_RESTORE} component={BackupRestoreScreen} />
      <Stack.Screen name={ROUTES.CONNECTED_DEVICES} component={ConnectedDevicesScreen} />
      <Stack.Screen name={ROUTES.PRIVACY_SECURITY} component={PrivacySecurityScreen} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
