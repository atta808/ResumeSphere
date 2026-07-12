import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import ATSScoreScreen from '../screens/ats/ATSScoreScreen';
import CoverLetterScreen from '../screens/coverLetter/CoverLetterScreen';
import InterviewPrepScreen from '../screens/interview/InterviewPrepScreen';
import ImportScreen from '../screens/import/ImportScreen';
import ImportReviewScreen from '../screens/import/ImportReviewScreen';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen name={ROUTES.ATS_SCORE} component={ATSScoreScreen} />
      <Stack.Screen name={ROUTES.COVER_LETTER} component={CoverLetterScreen} />
      <Stack.Screen name={ROUTES.INTERVIEW_PREP} component={InterviewPrepScreen} />
      <Stack.Screen name={ROUTES.IMPORT_MENU} component={ImportScreen} />
      <Stack.Screen name={ROUTES.IMPORT_REVIEW} component={ImportReviewScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
