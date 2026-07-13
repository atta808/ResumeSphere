import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme, spacing, typography } from '../../../theme';
import { PremiumHeader, PremiumCard, PremiumButton, Icon } from '../../../components/common';
import AIService from '../../../services/ai/AIService';
import ResumeService from '../../../services/resume/ResumeService';
import ProfileService from '../../../services/profile/ProfileService';
import { useJobDescriptions } from '../../../hooks/useJobDescriptions';
import { AI_ACTION_TYPES } from '../../../config/ai';

const AITailoringPreviewScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { resumeId, jobDescriptionId, aiAction, title } = route.params;
  const { getJobDescription } = useJobDescriptions();

  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    generateTailoredSuggestion();
  }, []);

  const generateTailoredSuggestion = async () => {
    setLoading(true);
    try {
      const resume = await ResumeService.getResumeById(resumeId);
      const jobDescription = await getJobDescription(jobDescriptionId);

      // We need a session ID for AI history
      const sessionId = `job_tailor_${Date.now()}`;

      let result;
      switch (aiAction) {
        case AI_ACTION_TYPES.TAILOR_SUMMARY:
           result = await AIService.tailorResumeSummary(resume.profileId, resumeId, jobDescription, sessionId);
           break;
        case AI_ACTION_TYPES.TAILOR_EXPERIENCE:
           result = await AIService.tailorResumeExperience(resume.profileId, resumeId, jobDescription, sessionId);
           break;
        case AI_ACTION_TYPES.TAILOR_SKILLS:
           result = await AIService.tailorResumeSkills(resume.profileId, resumeId, jobDescription, sessionId);
           break;
        default:
           // Generic fallback
           result = await AIService.processRequest({
              actionType: aiAction,
              profileId: resume.profileId,
              resumeId,
              jobDescriptionContext: jobDescription,
              sessionId
           });
           break;
      }

      setSuggestion(result.text);

    } catch (error) {
       Alert.alert('AI Error', 'Failed to generate tailored suggestion.');
       navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
     setSaving(true);
     try {
       const resume = await ResumeService.getResumeById(resumeId);

       // In a full implementation, you might want a specialized UI to apply changes section by section.
       // For now we will update the master profile's summary for demo purposes.
       if (aiAction === AI_ACTION_TYPES.TAILOR_SUMMARY) {
         await ProfileService.updateProfile(resume.profileId, { summary: suggestion });
         Alert.alert('Success', 'Summary has been updated in your profile.');
       } else {
         Alert.alert('Suggestion Generated', 'Please copy this suggestion and apply it manually to your specific sections.');
       }

       navigation.goBack();

     } catch (e) {
       Alert.alert('Error', 'Failed to apply changes.');
     } finally {
       setSaving(false);
     }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title={title || "AI Tailoring"} onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[typography.body, { color: theme.textSecondary, marginTop: spacing.md }]}>
             AI is rewriting your content to match the job description...
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
           <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.md }]}>
              Suggested Changes
           </Text>

           <PremiumCard>
              <Text style={[typography.body, { color: theme.textPrimary }]}>
                 {suggestion}
              </Text>
           </PremiumCard>

           <View style={styles.actions}>
              <PremiumButton
                 title="Discard"
                 variant="outline"
                 onPress={() => navigation.goBack()}
                 style={styles.btn}
                 disabled={saving}
              />
              <PremiumButton
                 title={saving ? "Applying..." : "Apply Changes"}
                 onPress={handleAccept}
                 style={styles.btn}
                 disabled={saving}
              />
           </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    padding: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  btn: {
    flex: 0.48,
  }
});

export default AITailoringPreviewScreen;
