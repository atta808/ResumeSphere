import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AIAssistantScreen from '../screens/ai/AIAssistantScreen';
import AIConversationScreen from '../screens/ai/AIConversationScreen';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const AIStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.AI_ASSISTANT} component={AIAssistantScreen} />
      <Stack.Screen name={ROUTES.AI_CONVERSATION} component={AIConversationScreen} />
    </Stack.Navigator>
  );
};

export default AIStack;
