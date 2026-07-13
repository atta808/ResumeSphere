import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme, spacing, typography, radius } from '../../../theme';
import { ROUTES } from '../../../navigation/routes';
import { PremiumHeader, PremiumCard, PremiumButton, Icon } from '../../../components/common';
import { useJobMatches } from '../../../hooks/useJobMatches';

const JobMatchAnalysisScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { resumeId, jobDescriptionId } = route.params;

  const { performMatch, currentMatch, loading, error } = useJobMatches();

  useEffect(() => {
    performMatch(resumeId, jobDescriptionId);
  }, [resumeId, jobDescriptionId, performMatch]);

  if (loading || !currentMatch) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <PremiumHeader title="Analyzing Match..." />
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: spacing.xl }} />
        <Text style={[typography.body, { color: theme.textSecondary, marginTop: spacing.md }]}>
          Comparing your profile against the job description...
        </Text>
      </View>
    );
  }

  if (error) {
     return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <PremiumHeader title="Match Analysis" onBack={() => navigation.goBack()} />
          <View style={{ padding: spacing.md }}>
             <Text style={{color: theme.danger}}>Failed to run match analysis.</Text>
          </View>
        </View>
     );
  }

  let recommendations = [];
  try {
    recommendations = JSON.parse(currentMatch.recommendations);
  } catch (e) {
    recommendations = [];
  }

  const handleImproveWithAI = (action) => {
    navigation.navigate(ROUTES.AI_TAILORING_PREVIEW, {
       resumeId,
       jobDescriptionId,
       aiAction: action.futureAiAction,
       title: action.title
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Match Analysis" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>

        {/* Score Overview */}
        <PremiumCard style={styles.scoreCard}>
           <Text style={[typography.h3, { color: theme.textPrimary, textAlign: 'center' }]}>
              Overall Match Score
           </Text>
           <Text style={[styles.scoreText, { color: currentMatch.overallScore > 75 ? theme.success : theme.warning }]}>
              {currentMatch.overallScore}%
           </Text>
           <View style={styles.scoreRow}>
              <View style={styles.scoreItem}>
                 <Text style={[typography.caption, { color: theme.textSecondary }]}>Skills</Text>
                 <Text style={[typography.h4, { color: theme.textPrimary }]}>{currentMatch.skillsScore}%</Text>
              </View>
              <View style={styles.scoreItem}>
                 <Text style={[typography.caption, { color: theme.textSecondary }]}>Experience</Text>
                 <Text style={[typography.h4, { color: theme.textPrimary }]}>{currentMatch.experienceScore}%</Text>
              </View>
              <View style={styles.scoreItem}>
                 <Text style={[typography.caption, { color: theme.textSecondary }]}>Keywords</Text>
                 <Text style={[typography.h4, { color: theme.textPrimary }]}>{currentMatch.keywordScore}%</Text>
              </View>
           </View>
        </PremiumCard>

        {/* AI Recommendations */}
        <Text style={[typography.h3, { color: theme.textPrimary, marginVertical: spacing.md }]}>
           AI Recommendations
        </Text>

        {recommendations.length === 0 ? (
           <Text style={[typography.body, { color: theme.textSecondary }]}>Your resume looks great! No critical gaps found.</Text>
        ) : (
           recommendations.map((rec, index) => (
             <PremiumCard key={index} style={styles.recCard}>
                <View style={styles.recHeader}>
                   <Icon name="lightbulb-on-outline" size={20} color={theme.primary} />
                   <Text style={[typography.h4, { color: theme.textPrimary, marginLeft: spacing.sm, flex: 1 }]}>
                     {rec.title}
                   </Text>
                   <View style={[styles.badge, { backgroundColor: theme.success + '20' }]}>
                     <Text style={[typography.caption, { color: theme.success, fontWeight: 'bold' }]}>
                       +{rec.estimatedScoreGain} pts
                     </Text>
                   </View>
                </View>
                <Text style={[typography.body, { color: theme.textSecondary, marginTop: spacing.sm }]}>
                   {rec.description}
                </Text>

                <PremiumButton
                   title="Improve with AI"
                   icon="creation"
                   variant="outline"
                   style={styles.improveBtn}
                   onPress={() => handleImproveWithAI(rec)}
                />
             </PremiumCard>
           ))
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  scoreCard: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: spacing.sm,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  scoreItem: {
    alignItems: 'center',
  },
  recCard: {
    marginBottom: spacing.md,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  improveBtn: {
    marginTop: spacing.md,
  }
});

export default JobMatchAnalysisScreen;
