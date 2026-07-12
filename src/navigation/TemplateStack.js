import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TemplatesScreen from '../screens/templates/TemplatesScreen';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const TemplateStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.TEMPLATES} component={TemplatesScreen} />
    </Stack.Navigator>
  );
};

export default TemplateStack;
