import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';

import InterviewDashboardScreen from '../screens/interview/InterviewDashboardScreen';
import InterviewConfigurationScreen from '../screens/interview/InterviewConfigurationScreen';
import InterviewSessionScreen from '../screens/interview/InterviewSessionScreen';
import InterviewFeedbackScreen from '../screens/interview/InterviewFeedbackScreen';
import InterviewHistoryScreen from '../screens/interview/InterviewHistoryScreen';
import InterviewProgressScreen from '../screens/interview/InterviewProgressScreen';
import InterviewDetailScreen from '../screens/interview/InterviewDetailScreen';

const Stack = createNativeStackNavigator();

const InterviewNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.INTERVIEW_DASHBOARD} component={InterviewDashboardScreen} />
      <Stack.Screen name={ROUTES.INTERVIEW_CONFIGURATION} component={InterviewConfigurationScreen} />
      <Stack.Screen name={ROUTES.INTERVIEW_SESSION} component={InterviewSessionScreen} />
      <Stack.Screen name={ROUTES.INTERVIEW_FEEDBACK} component={InterviewFeedbackScreen} />
      <Stack.Screen name={ROUTES.INTERVIEW_HISTORY} component={InterviewHistoryScreen} />
      <Stack.Screen name={ROUTES.INTERVIEW_PROGRESS} component={InterviewProgressScreen} />
      <Stack.Screen name={ROUTES.INTERVIEW_DETAIL} component={InterviewDetailScreen} />
    </Stack.Navigator>
  );
};

export default InterviewNavigator;
