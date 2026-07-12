import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';

import ResumeDashboardScreen from '../screens/resume/ResumeDashboardScreen';
import ResumeEditorScreen from '../screens/resume/ResumeEditorScreen';
import SectionEditorScreen from '../screens/resume/SectionEditorScreen';
import ResumePreviewScreen from '../screens/resume/ResumePreviewScreen';
import ATSScoreScreen from '../screens/ats/ATSScoreScreen';

const Stack = createNativeStackNavigator();

const ResumeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.RESUME_DASHBOARD}>
      <Stack.Screen name={ROUTES.RESUME_DASHBOARD} component={ResumeDashboardScreen} />
      <Stack.Screen name={ROUTES.RESUME_EDITOR} component={ResumeEditorScreen} />
      <Stack.Screen name={ROUTES.SECTION_EDITOR} component={SectionEditorScreen} />
      <Stack.Screen name={ROUTES.RESUME_PREVIEW} component={ResumePreviewScreen} />
      <Stack.Screen name={ROUTES.ATS_SCORE} component={ATSScoreScreen} />
    </Stack.Navigator>
  );
};

export default ResumeStack;
