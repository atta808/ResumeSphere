import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';

import ResumeDashboardScreen from '../screens/resume/ResumeDashboardScreen';
import ResumeEditorScreen from '../screens/resume/ResumeEditorScreen';
import SectionEditorScreen from '../screens/resume/SectionEditorScreen';
import ResumePreviewScreen from '../screens/templates/ResumePreviewScreen';
import ATSScoreScreen from '../screens/ats/ATSScoreScreen';
import JobDescriptionInputScreen from '../screens/resume/jobMatching/JobDescriptionInputScreen';
import JobMatchAnalysisScreen from '../screens/resume/jobMatching/JobMatchAnalysisScreen';
import AITailoringPreviewScreen from '../screens/resume/jobMatching/AITailoringPreviewScreen';

const Stack = createNativeStackNavigator();

const ResumeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.RESUME_DASHBOARD}>
      <Stack.Screen name={ROUTES.RESUME_DASHBOARD} component={ResumeDashboardScreen} />
      <Stack.Screen name={ROUTES.RESUME_EDITOR} component={ResumeEditorScreen} />
      <Stack.Screen name={ROUTES.SECTION_EDITOR} component={SectionEditorScreen} />
      <Stack.Screen name={ROUTES.RESUME_PREVIEW} component={ResumePreviewScreen} />
      <Stack.Screen name={ROUTES.ATS_SCORE} component={ATSScoreScreen} />
      <Stack.Screen name={ROUTES.JOB_DESCRIPTION_INPUT} component={JobDescriptionInputScreen} />
      <Stack.Screen name={ROUTES.JOB_MATCH_ANALYSIS} component={JobMatchAnalysisScreen} />
      <Stack.Screen name={ROUTES.AI_TAILORING_PREVIEW} component={AITailoringPreviewScreen} />
    </Stack.Navigator>
  );
};

export default ResumeStack;
