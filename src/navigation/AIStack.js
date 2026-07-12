import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AIAssistantScreen from '../screens/ai/AIAssistantScreen';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const AIStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.AI_ASSISTANT} component={AIAssistantScreen} />
    </Stack.Navigator>
  );
};

export default AIStack;
