import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, PremiumButton, Icon, EmptyState, SkeletonLoader } from '../../components/common';
import { CircularScore, CategoryBar, TrendChart } from '../../components/charts';
import { useTheme, spacing, typography, radius } from '../../theme';
import { useATS } from '../../hooks/useATS';
import { useATSHistory } from '../../hooks/useATSHistory';
import { ROUTES } from '../../navigation/routes';
import { formatDate } from '../../utils/helpers';
import Logger from '../../utils/logger';

const ATSScoreScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const resumeId = route.params?.resumeId;

  const { loading: analyzing, report, analyze } = useATS();
  const { history, loadHistory } = useATSHistory();

  useEffect(() => {
    if (resumeId) {
      // Analyze (or fetch cached) report
      analyze(resumeId)
        .then(() => {
           // Then load history for the trend chart
           loadHistory(resumeId);
        })
        .catch(err => {
           Logger.error('Analysis failed', err);
        });
    }
  }, [resumeId, analyze, loadHistory]);

  const handleImproveWithAI = () => {
     // For future: navigate to AI with context or show options
     navigation.navigate(ROUTES.AI_ASSISTANT);
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
       <View style={{alignItems: 'center', marginVertical: spacing.xl}}>
           <SkeletonLoader width={150} height={150} borderRadius={75} />
       </View>
       <PremiumCard style={{marginBottom: spacing.md}}>
           <SkeletonLoader width="40%" height={20} style={{marginBottom: spacing.md}} />
           <SkeletonLoader width="100%" height={10} style={{marginBottom: spacing.md}} />
           <SkeletonLoader width="100%" height={10} style={{marginBottom: spacing.md}} />
       </PremiumCard>
    </View>
  );

  const getPriorityColor = (priority) => {
      switch(priority) {
          case 'Critical': return theme.danger;
          case 'High': return theme.warning;
          case 'Medium': return theme.info;
          default: return theme.success;
      }
  };

  if (!resumeId) {
      return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <PremiumHeader title="ATS Score" onBack={() => navigation.goBack()} />
          <EmptyState
            title="Select a Resume"
            subtitle="You must select a resume to analyze its ATS score."
            icon="file-document-outline"
            actionButton={<PremiumButton title="Go to Resumes" onPress={() => navigation.navigate(ROUTES.RESUME)} />}
          />
        </View>
      );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader
        title="ATS Intelligence"
        onBack={() => navigation.goBack()}
        rightAction={
            <TouchableOpacity onPress={() => analyze(resumeId)} accessibilityLabel="Refresh Analysis">
               <Icon name="refresh" size={24} color={theme.primary} />
            </TouchableOpacity>
        }
      />

      {analyzing ? (
          renderSkeleton()
      ) : report ? (
          <ScrollView contentContainerStyle={styles.content}>

              {/* Overall Score Section */}
              <View style={styles.scoreHeader}>
                  <CircularScore score={report.overallScore} size={160} strokeWidth={12} label="ATS Match" />
                  <Text style={[typography.caption, { color: theme.textSecondary, marginTop: spacing.sm }]}>
                     Analyzed {formatDate(report.createdAt)}
                  </Text>
              </View>

              {/* Trend Chart */}
              {history && history.length > 1 && (
                  <PremiumCard style={styles.card} title="Improvement Trend">
                      <TrendChart data={history} height={80} />
                  </PremiumCard>
              )}

              {/* Category Breakdown */}
              <PremiumCard style={styles.card} title="Category Breakdown">
                  {Object.entries(report.categoryScores).map(([key, value]) => (
                      <CategoryBar
                          key={key}
                          label={key.charAt(0).toUpperCase() + key.slice(1)}
                          score={value}
                      />
                  ))}
              </PremiumCard>

              {/* Recommendations Section */}
              <View style={styles.sectionHeader}>
                  <Text style={[typography.h3, { color: theme.textPrimary }]}>Actionable Insights</Text>
                  <PremiumButton
                     title="Fix with AI"
                     icon="robot-outline"
                     variant="outline"
                     size="small"
                     onPress={handleImproveWithAI}
                  />
              </View>

              {report.recommendations && report.recommendations.length > 0 ? (
                  report.recommendations.map((rec, index) => (
                      <View key={index} style={[styles.recommendationItem, { backgroundColor: theme.surface, borderLeftColor: getPriorityColor(rec.priority) }]}>
                          <View style={styles.recHeader}>
                              <Text style={[typography.h4, { color: theme.textPrimary, flex: 1 }]}>{rec.title}</Text>
                              {rec.scoreImpact > 0 && (
                                  <View style={[styles.impactBadge, { backgroundColor: theme.success + '20' }]}>
                                      <Text style={[typography.caption, { color: theme.success, fontWeight: 'bold' }]}>+{rec.scoreImpact}</Text>
                                  </View>
                              )}
                          </View>
                          <Text style={[typography.body, { color: theme.textSecondary, marginVertical: spacing.xs }]}>
                              {rec.description}
                          </Text>
                          <View style={styles.recFooter}>
                              <Text style={[typography.caption, { color: getPriorityColor(rec.priority), fontWeight: 'bold' }]}>
                                  {rec.priority} Priority
                              </Text>
                              {rec.section && (
                                  <Text style={[typography.caption, { color: theme.textSecondary }]}>
                                      • {rec.section}
                                  </Text>
                              )}
                          </View>
                      </View>
                  ))
              ) : (
                  <EmptyState
                      title="Perfect Score!"
                      subtitle="We didn't find any actionable recommendations. Your resume is well optimized."
                      icon="check-decagram"
                  />
              )}

              <View style={{height: 100}} />
          </ScrollView>
      ) : (
          <EmptyState
            title="Analysis Failed"
            subtitle="There was an issue analyzing your resume. Please try again."
            icon="alert-circle-outline"
            actionButton={<PremiumButton title="Retry Analysis" onPress={() => analyze(resumeId)} />}
          />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  skeletonContainer: {
    padding: spacing.md,
  },
  scoreHeader: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.md,
      marginBottom: spacing.sm,
  },
  recommendationItem: {
      padding: spacing.md,
      borderRadius: radius.medium,
      marginBottom: spacing.sm,
      borderLeftWidth: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
  },
  recHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },
  impactBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: spacing.sm,
  },
  recFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
  }
});

export default ATSScoreScreen;
