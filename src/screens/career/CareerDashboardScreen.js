import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, Icon, PremiumButton, EmptyState } from '../../components/common';
import { CircularScore, CategoryBar } from '../../components/charts';
import { useTheme } from '../../theme';
import CareerCoachService from '../../services/career/CareerCoachService';
import { useProfile } from '../../hooks/useProfile';
import { ROUTES } from '../../navigation/routes';

const CareerDashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { profile } = useProfile();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  const loadDashboard = useCallback(async () => {
    if (!profile?.id) return;
    try {
      setLoading(true);
      const data = await CareerCoachService.getDashboardState(profile.id);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load career dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const handleGeneratePlan = async () => {
    if (!profile?.id || !dashboardData?.currentGoal?.id) return;
    try {
      setGenerating(true);
      const data = await CareerCoachService.generateCareerPlan(profile.id, dashboardData.currentGoal.id);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to generate career plan:', error);
      alert('Failed to generate career plan. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!dashboardData?.hasGoal) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <PremiumHeader title="Career Coach" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <EmptyState
            title="Set Your Career Goal"
            subtitle="Tell us where you want to go, and your AI Career Coach will build a personalized roadmap."
            icon="compass-outline"
            actionLabel="Create Career Goal"
            onAction={() => navigation.navigate(ROUTES.CAREER_GOAL)}
          />
        </View>
      </View>
    );
  }

  const hasPlan = dashboardData.roadmap.length > 0 || dashboardData.learningPlan.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Career Dashboard" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Goal Overview */}
        <PremiumCard style={styles.goalCard}>
          <View style={styles.goalHeader}>
             <Icon name="flag" size={24} color={theme.primary} />
             <Text style={[styles.goalTitle, { color: theme.text }]}>{dashboardData.currentGoal.title}</Text>
          </View>
          <Text style={[styles.goalType, { color: theme.textSecondary }]}>
             Target: {dashboardData.currentGoal.targetRole || dashboardData.currentGoal.goalType}
          </Text>
          <TouchableOpacity
             style={styles.editGoalBtn}
             onPress={() => navigation.navigate(ROUTES.CAREER_GOAL, { goalId: dashboardData.currentGoal.id })}
          >
             <Text style={[styles.editGoalText, { color: theme.primary }]}>Edit Goal</Text>
          </TouchableOpacity>
        </PremiumCard>

        {/* Career Readiness Score */}
        <PremiumCard style={styles.scoreCard}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Career Readiness</Text>
          <View style={styles.scoreContainer}>
            <CircularScore
               score={dashboardData.score}
               size={120}
               strokeWidth={12}
            />
          </View>
        </PremiumCard>

        <PremiumCard style={styles.generateCard}>
           <Icon name="sparkles" size={32} color={theme.primary} style={{ alignSelf: 'center', marginBottom: 12 }} />
           <Text style={[styles.generateTitle, { color: theme.text }]}>{hasPlan ? 'Regenerate Career Plan' : 'Generate Career Plan'}</Text>
           <Text style={[styles.generateDesc, { color: theme.textSecondary }]}>
              {hasPlan ? 'Update your career plan based on your latest profile and goals.' : 'Let AI analyze your profile, skills, and goals to build a personalized career roadmap and learning plan.'}
           </Text>
           <PremiumButton
              title={generating ? "Generating..." : (hasPlan ? "Regenerate AI Plan" : "Generate AI Plan")}
              onPress={handleGeneratePlan}
              disabled={generating}
           />
        </PremiumCard>

        {hasPlan && (
           <>
              {/* Quick Actions */}
              <View style={styles.grid}>
                 <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate(ROUTES.CAREER_ROADMAP)}>
                    <PremiumCard style={styles.actionCard}>
                       <Icon name="map-outline" size={28} color={theme.primary} />
                       <Text style={[styles.actionTitle, { color: theme.text }]}>Roadmap</Text>
                       <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{dashboardData.roadmap.length} steps</Text>
                    </PremiumCard>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate(ROUTES.LEARNING_PLAN)}>
                    <PremiumCard style={styles.actionCard}>
                       <Icon name="book-outline" size={28} color={theme.primary} />
                       <Text style={[styles.actionTitle, { color: theme.text }]}>Learning Plan</Text>
                       <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{dashboardData.learningPlan.length} topics</Text>
                    </PremiumCard>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate(ROUTES.CERTIFICATION)}>
                    <PremiumCard style={styles.actionCard}>
                       <Icon name="ribbon-outline" size={28} color={theme.primary} />
                       <Text style={[styles.actionTitle, { color: theme.text }]}>Certifications</Text>
                       <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{dashboardData.certifications.length} recs</Text>
                    </PremiumCard>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate(ROUTES.SALARY_INSIGHT)}>
                    <PremiumCard style={styles.actionCard}>
                       <Icon name="cash-outline" size={28} color={theme.primary} />
                       <Text style={[styles.actionTitle, { color: theme.text }]}>Salary Insights</Text>
                       <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Market Data</Text>
                    </PremiumCard>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate(ROUTES.PROMOTION_READINESS)}>
                    <PremiumCard style={styles.actionCard}>
                       <Icon name="trending-up-outline" size={28} color={theme.primary} />
                       <Text style={[styles.actionTitle, { color: theme.text }]}>Promotion Prep</Text>
                       <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Readiness Score</Text>
                    </PremiumCard>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate(ROUTES.CAREER_PROGRESS)}>
                    <PremiumCard style={styles.actionCard}>
                       <Icon name="stats-chart-outline" size={28} color={theme.primary} />
                       <Text style={[styles.actionTitle, { color: theme.text }]}>Progress Tracker</Text>
                       <Text style={{ color: theme.textSecondary, fontSize: 12 }}>View History</Text>
                    </PremiumCard>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate(ROUTES.CAREER_RECOMMENDATION)}>
                    <PremiumCard style={styles.actionCard}>
                       <Icon name="star-outline" size={28} color={theme.primary} />
                       <Text style={[styles.actionTitle, { color: theme.text }]}>Skill Gaps</Text>
                       <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{dashboardData.skillGaps?.length || 0} gaps</Text>
                    </PremiumCard>
                 </TouchableOpacity>
              </View>

              {/* Next Steps (Roadmap Preview) */}
              <PremiumCard style={styles.listCard}>
                 <View style={styles.listHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Next Steps</Text>
                    <TouchableOpacity onPress={() => navigation.navigate(ROUTES.CAREER_ROADMAP)}>
                       <Text style={{ color: theme.primary }}>View All</Text>
                    </TouchableOpacity>
                 </View>
                 {dashboardData.roadmap.slice(0, 3).map((item, index) => (
                    <View key={item.id} style={[styles.listItem, index !== dashboardData.roadmap.slice(0, 3).length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
                       <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>
                       <Text style={[styles.itemDesc, { color: theme.textSecondary }]} numberOfLines={1}>{item.description}</Text>
                    </View>
                 ))}
              </PremiumCard>
           </>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  goalCard: { padding: 20, marginBottom: 16 },
  goalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  goalTitle: { fontSize: 20, fontWeight: '700', marginLeft: 12, flex: 1 },
  goalType: { fontSize: 14, marginLeft: 36, marginBottom: 12 },
  editGoalBtn: { alignSelf: 'flex-start', marginLeft: 36 },
  editGoalText: { fontWeight: '600' },
  scoreCard: { padding: 20, marginBottom: 16, alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16, alignSelf: 'flex-start' },
  scoreContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  generateCard: { padding: 24, alignItems: 'center', marginTop: 16 },
  generateTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  generateDesc: { textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  gridItem: { width: '48%', marginBottom: 16 },
  actionCard: { padding: 16, alignItems: 'center', justifyContent: 'center', height: 110 },
  actionTitle: { fontSize: 14, fontWeight: '600', marginTop: 8, marginBottom: 4 },
  listCard: { padding: 16, marginBottom: 16 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  listItem: { paddingVertical: 12 },
  itemTitle: { fontSize: 15, fontWeight: '500', marginBottom: 4 },
  itemDesc: { fontSize: 13 }
});

export default CareerDashboardScreen;
