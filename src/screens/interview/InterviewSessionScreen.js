import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumHeader, Button, LoadingSpinner } from '../../components/common';
import { useTheme } from '../../theme';
import { ROUTES } from '../../navigation/routes';
import InterviewEngine from '../../services/interview/InterviewEngine';
import Logger from '../../utils/logger';

const InterviewSessionScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { sessionId } = route.params;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const initSession = async () => {
      try {
        let existingQuestions = await InterviewEngine.getSessionQuestions(sessionId);

        if (existingQuestions.length === 0) {
          existingQuestions = await InterviewEngine.generateQuestions(sessionId, {});
        }

        if (isMounted) {
          setQuestions(existingQuestions);
          setIsGenerating(false);
          setStartTime(Date.now());
        }
      } catch (error) {
        Logger.error(error);
        if (isMounted) {
          Alert.alert('Error', 'Failed to initialize interview questions.');
          navigation.goBack();
        }
      }
    };
    initSession();
    return () => { isMounted = false; };
  }, [sessionId, navigation]);

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      Alert.alert('Error', 'Please provide an answer.');
      return;
    }

    setIsSubmitting(true);
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds

    try {
      const currentQ = questions[currentIndex];
      const result = await InterviewEngine.submitAnswer({
        sessionId,
        questionId: currentQ.id,
        answer: currentAnswer,
        timeSpent,
      });

      if (currentIndex < questions.length - 1) {
        // Go to next question
        setCurrentAnswer('');
        setCurrentIndex(currentIndex + 1);
        setStartTime(Date.now());
        // Alternatively, we could navigate to feedback immediately and then back, but for flow let's store it all.
      } else {
        // Finish session
        await InterviewEngine.finishSession(sessionId);
        navigation.replace(ROUTES.INTERVIEW_FEEDBACK, { sessionId });
      }
    } catch (error) {
      Logger.error(error);
      Alert.alert('Error', 'Failed to process answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isGenerating) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <PremiumHeader title="Mock Interview" onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <LoadingSpinner text="Generating tailored questions..." />
        </View>
      </View>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title={`Question ${currentIndex + 1} of ${questions.length}`} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>

        <View style={[styles.questionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>{currentQ.category || 'General'}</Text>
          </View>
          <Text style={[styles.questionText, { color: theme.text }]}>{currentQ.question}</Text>
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Your Answer</Text>
        <TextInput
          style={[styles.answerInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
          placeholder="Type your response here... (Take your time)"
          placeholderTextColor={theme.textSecondary}
          multiline
          textAlignVertical="top"
          value={currentAnswer}
          onChangeText={setCurrentAnswer}
          editable={!isSubmitting}
        />

      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.surface }]}>
        <Button
          title={currentIndex < questions.length - 1 ? "Submit & Next" : "Complete Interview"}
          onPress={handleSubmitAnswer}
          loading={isSubmitting}
        />
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
  questionCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  answerInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 200,
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  }
});

export default InterviewSessionScreen;
