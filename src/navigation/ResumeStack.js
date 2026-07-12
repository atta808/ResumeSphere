import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ResumeBuilderScreen from '../screens/resume/ResumeBuilderScreen';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const ResumeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.RESUME} component={ResumeBuilderScreen} />
    </Stack.Navigator>
  );
};

export default ResumeStack;
