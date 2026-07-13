import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, Icon } from '../../components/common';
import { useTheme } from '../../theme';
import InterviewEngine from '../../services/interview/InterviewEngine';
import Logger from '../../utils/logger';

const InterviewProgressScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
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
    fetchAnalytics();
    return () => { isMounted = false; };
  }, []);

  if (loading || !analytics) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <PremiumHeader title="Detailed Analytics" onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Detailed Analytics" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>

        <View style={styles.summaryCard}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>Overall Readiness</Text>
          <View style={styles.scoreCircleWrapper}>
            <View style={[styles.scoreCircle, { borderColor: theme.primary, backgroundColor: theme.surface }]}>
              <Text style={[styles.scoreValue, { color: theme.text }]}>{analytics.averageScore}</Text>
              <Text style={[styles.scoreLabel, { color: theme.textSecondary }]}>Avg Score</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Practice Statistics</Text>
        <View style={styles.statsGrid}>
          <PremiumCard style={styles.statCard}>
            <Icon name="time-outline" size={24} color={theme.primary} />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {Math.round(analytics.timePracticed / 60)}m
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Time Practiced</Text>
          </PremiumCard>
          <PremiumCard style={styles.statCard}>
            <Icon name="checkmark-circle-outline" size={24} color={theme.success} />
            <Text style={[styles.statValue, { color: theme.text }]}>{analytics.totalSessions}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Interviews</Text>
          </PremiumCard>
          <PremiumCard style={styles.statCard}>
            <Icon name="trophy-outline" size={24} color={theme.warning} />
            <Text style={[styles.statValue, { color: theme.text }]}>{analytics.bestScore}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Top Score</Text>
          </PremiumCard>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Trend</Text>
        <PremiumCard style={styles.trendCard}>
          {analytics.recentTrend.length === 0 ? (
            <Text style={[styles.trendEmpty, { color: theme.textSecondary }]}>Complete interviews to see trends.</Text>
          ) : (
            <View style={styles.trendBars}>
               {analytics.recentTrend.map((score, index) => (
                 <View key={index} style={styles.trendBarContainer}>
                   <View style={[styles.trendBar, { height: `${score}%`, backgroundColor: theme.primary }]} />
                   <Text style={[styles.trendLabel, { color: theme.textSecondary }]}>{score}</Text>
                 </View>
               ))}
            </View>
          )}
        </PremiumCard>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  summaryCard: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  scoreCircleWrapper: {
    padding: 8,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
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
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  trendCard: {
    padding: 16,
    minHeight: 150,
    justifyContent: 'center',
  },
  trendEmpty: {
    textAlign: 'center',
    fontSize: 14,
  },
  trendBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  trendBarContainer: {
    alignItems: 'center',
    width: 30,
    height: '100%',
    justifyContent: 'flex-end',
  },
  trendBar: {
    width: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  trendLabel: {
    fontSize: 10,
  }
});

export default InterviewProgressScreen;
