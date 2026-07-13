import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, Icon } from '../../components/common';
import { useTheme } from '../../theme';
import { ROUTES } from '../../navigation/routes';
import InterviewEngine from '../../services/interview/InterviewEngine';
import Logger from '../../utils/logger';

const InterviewDashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const loadAnalytics = async () => {
        try {
          const stats = await InterviewEngine.getAnalytics();
          if (isMounted) {
            setAnalytics(stats);
            setLoading(false);
          }
        } catch (error) {
          Logger.error(error);
          if (isMounted) setLoading(false);
        }
      };
      loadAnalytics();
      return () => { isMounted = false; };
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Interview Coach" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: theme.text }]}>Prepare for Success</Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Practice with AI-driven mock interviews tailored to your resume and target role.
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate(ROUTES.INTERVIEW_CONFIGURATION)}
            activeOpacity={0.8}
          >
            <Icon name="play-outline" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Start Mock Interview</Text>
          </TouchableOpacity>
        </View>

        {/* Analytics Section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Progress</Text>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.statsGrid}>
            <PremiumCard style={styles.statCard}>
              <Icon name="checkmark-circle-outline" size={28} color={theme.success} />
              <Text style={[styles.statValue, { color: theme.text }]}>{analytics?.totalSessions || 0}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Completed</Text>
            </PremiumCard>

            <PremiumCard style={styles.statCard}>
              <Icon name="trending-up-outline" size={28} color={theme.primary} />
              <Text style={[styles.statValue, { color: theme.text }]}>{analytics?.averageScore || 0}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Avg Score</Text>
            </PremiumCard>

            <PremiumCard style={styles.statCard}>
              <Icon name="trophy-outline" size={28} color={theme.warning} />
              <Text style={[styles.statValue, { color: theme.text }]}>{analytics?.bestScore || 0}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Best Score</Text>
            </PremiumCard>
          </View>
        )}

        {/* Navigation Actions */}
        <View style={styles.actionGroup}>
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => navigation.navigate(ROUTES.INTERVIEW_HISTORY)}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.primary + '20' }]}>
              <Icon name="time-outline" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Interview History</Text>
            <Icon name="chevron-forward" size={20} color={theme.border} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => navigation.navigate(ROUTES.INTERVIEW_PROGRESS)}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.success + '20' }]}>
              <Icon name="bar-chart-outline" size={22} color={theme.success} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Detailed Analytics</Text>
            <Icon name="chevron-forward" size={20} color={theme.border} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  actionGroup: {
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  }
});

export default InterviewDashboardScreen;
