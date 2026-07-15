import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AIAssistantScreen from '../screens/ai/AIAssistantScreen';
import AIConversationScreen from '../screens/ai/AIConversationScreen';
import { ROUTES } from './routes';
import { ScreenWrapper } from '../components/common';

const Stack = createNativeStackNavigator();

const AIStack = () => {
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
      <Stack.Screen name={ROUTES.AI_ASSISTANT} component={AIAssistantScreen} />
      <Stack.Screen name={ROUTES.AI_CONVERSATION} component={AIConversationScreen} />
    </Stack.Navigator>
  );
};

export default AIStack;
