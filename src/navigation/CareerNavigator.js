import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CareerDashboardScreen from '../screens/career/CareerDashboardScreen';
import CareerGoalScreen from '../screens/career/CareerGoalScreen';
import CareerRoadmapScreen from '../screens/career/CareerRoadmapScreen';
import LearningPlanScreen from '../screens/career/LearningPlanScreen';
import CertificationScreen from '../screens/career/CertificationScreen';
import SalaryInsightScreen from '../screens/career/SalaryInsightScreen';
import PromotionReadinessScreen from '../screens/career/PromotionReadinessScreen';
import CareerProgressScreen from '../screens/career/CareerProgressScreen';
import CareerRecommendationScreen from '../screens/career/CareerRecommendationScreen';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const CareerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.CAREER_DASHBOARD} component={CareerDashboardScreen} />
      <Stack.Screen name={ROUTES.CAREER_GOAL} component={CareerGoalScreen} />
      <Stack.Screen name={ROUTES.CAREER_ROADMAP} component={CareerRoadmapScreen} />
      <Stack.Screen name={ROUTES.LEARNING_PLAN} component={LearningPlanScreen} />
      <Stack.Screen name={ROUTES.CERTIFICATION} component={CertificationScreen} />
      <Stack.Screen name={ROUTES.SALARY_INSIGHT} component={SalaryInsightScreen} />
      <Stack.Screen name={ROUTES.PROMOTION_READINESS} component={PromotionReadinessScreen} />
      <Stack.Screen name={ROUTES.CAREER_PROGRESS} component={CareerProgressScreen} />
      <Stack.Screen name={ROUTES.CAREER_RECOMMENDATION} component={CareerRecommendationScreen} />
    </Stack.Navigator>
  );
};

export default CareerNavigator;
