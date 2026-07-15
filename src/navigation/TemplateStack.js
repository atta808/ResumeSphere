import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TemplatesScreen from '../screens/templates/TemplatesScreen';
import { ROUTES } from './routes';
import { ScreenWrapper } from '../components/common';

const Stack = createNativeStackNavigator();

const TemplateStack = () => {
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
      <Stack.Screen name={ROUTES.TEMPLATES_SCREEN} component={TemplatesScreen} />
    </Stack.Navigator>
  );
};

export default TemplateStack;
