import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumHeader, Button, PremiumCard, Icon } from '../../components/common';
import { useTheme } from '../../theme';
import { ROUTES } from '../../navigation/routes';
import InterviewEngine from '../../services/interview/InterviewEngine';
import Logger from '../../utils/logger';

const InterviewFeedbackScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { sessionId } = route.params;

  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const details = await InterviewEngine.getSessionDetails(sessionId);
        if (isMounted) {
          setSessionData(details);
          setLoading(false);
        }
      } catch (error) {
        Logger.error(error);
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [sessionId]);

  const handleFinish = () => {
    // Navigate back to the Interview Dashboard
    navigation.popToTop();
  };

  if (loading || !sessionData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <PremiumHeader title="Interview Feedback" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  const { session, questions, answers } = sessionData;

  const getScoreColor = (score) => {
    if (score >= 80) return theme.success;
    if (score >= 60) return theme.warning;
    return theme.error;
  };

  const renderFeedbackBlock = (title, items, icon, color) => {
    if (!items || items.length === 0) return null;
    return (
      <View style={styles.feedbackBlock}>
        <View style={styles.feedbackHeader}>
          <Icon name={icon} size={20} color={color} />
          <Text style={[styles.feedbackTitle, { color }]}>{title}</Text>
        </View>
        {items.map((item, idx) => (
          <Text key={idx} style={[styles.feedbackItem, { color: theme.text }]}>• {item}</Text>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Interview Feedback" onBack={handleFinish} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>

        {/* Overall Score */}
        <View style={styles.scoreSection}>
          <Text style={[styles.scoreLabel, { color: theme.textSecondary }]}>Overall Score</Text>
          <Text style={[styles.scoreValue, { color: getScoreColor(session.overallScore) }]}>
            {session.overallScore} / 100
          </Text>
        </View>

        {/* Individual Questions Feedback */}
        {questions.map((q, index) => {
          const a = answers.find(ans => ans.questionId === q.id);
          if (!a) return null;

          return (
            <PremiumCard key={q.id} style={styles.qaCard}>
              <View style={styles.qHeader}>
                <Text style={[styles.qNumber, { color: theme.text }]}>Q{index + 1}</Text>
                <View style={[styles.qScoreBadge, { backgroundColor: getScoreColor(a.score) + '20' }]}>
                  <Text style={[styles.qScoreText, { color: getScoreColor(a.score) }]}>{a.score}/100</Text>
                </View>
              </View>

              <Text style={[styles.questionText, { color: theme.text }]}>{q.question}</Text>

              <View style={[styles.answerBox, { backgroundColor: theme.background }]}>
                <Text style={[styles.answerLabel, { color: theme.textSecondary }]}>Your Answer:</Text>
                <Text style={[styles.answerText, { color: theme.text }]}>{a.answer}</Text>
              </View>

              {renderFeedbackBlock('Strengths', a.strengths, 'checkmark-circle-outline', theme.success)}
              {renderFeedbackBlock('Areas for Improvement', a.weaknesses, 'alert-circle-outline', theme.warning)}
              {renderFeedbackBlock('Recommendations', a.recommendations, 'bulb-outline', theme.primary)}

              {a.feedback?.betterAnswer && (
                 <View style={[styles.answerBox, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30', borderWidth: 1 }]}>
                   <Text style={[styles.answerLabel, { color: theme.primary }]}>Suggested Better Answer:</Text>
                   <Text style={[styles.answerText, { color: theme.text }]}>{a.feedback.betterAnswer}</Text>
                 </View>
              )}
            </PremiumCard>
          );
        })}

      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.surface }]}>
        <Button title="Done" onPress={handleFinish} />
      </View>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  scoreLabel: {
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  qaCard: {
    padding: 16,
    marginBottom: 24,
  },
  qHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  qNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  qScoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  qScoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 24,
  },
  answerBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  answerText: {
    fontSize: 15,
    lineHeight: 22,
  },
  feedbackBlock: {
    marginBottom: 16,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  feedbackItem: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 28,
    marginBottom: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  }
});

export default InterviewFeedbackScreen;
