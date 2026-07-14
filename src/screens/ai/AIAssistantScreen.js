import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, Icon, ResumePickerModal, EmptyState } from '../../components/common';
import { useTheme } from '../../theme';
import { ROUTES } from '../../navigation/routes';
import { useResumes } from '../../hooks/useResumes';
import { useProfile } from '../../hooks/useProfile';
import { useAIHistory } from '../../hooks/useAIHistory';
import { AI_ACTION_TYPES } from '../../config/ai';

const ACTION_CARDS = [
  { id: AI_ACTION_TYPES.GENERATE_SUMMARY, title: 'Professional Summary', icon: 'person-outline', description: 'Craft a compelling summary' },
  { id: AI_ACTION_TYPES.IMPROVE_RESUME, title: 'Improve Resume', icon: 'trending-up-outline', description: 'Get suggestions for your resume' },
  { id: AI_ACTION_TYPES.REWRITE_EXPERIENCE, title: 'Rewrite Experience', icon: 'briefcase-outline', description: 'Make bullet points stronger' },
  { id: AI_ACTION_TYPES.GENERATE_COVER_LETTER, title: 'Cover Letter', icon: 'document-text-outline', description: 'Generate a personalized cover letter' },
  { id: AI_ACTION_TYPES.PREPARE_INTERVIEW, title: 'Interview Coach', icon: 'chatbubbles-outline', description: 'Practice with tailored mock interviews', isModule: true },
  { id: AI_ACTION_TYPES.SUGGEST_SKILLS, title: 'Skills Suggestions', icon: 'star-outline', description: 'Discover skills you should add' },
  { id: 'CAREER_COACH_NAV', title: 'Career Coach', icon: 'compass-outline', description: 'Long-term career planning & roadmap', isModule: true },
];

const AIAssistantScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { profile } = useProfile();
  const { resumes, fetchResumes } = useResumes();
  const { sessions, fetchSessions } = useAIHistory(profile?.id);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchResumes();
      if (profile?.id) {
        fetchSessions();
      }
    }, [profile?.id, fetchResumes, fetchSessions])
  );

  const handleActionPress = (action) => {
    if (action.isModule) {
      if (action.id === AI_ACTION_TYPES.PREPARE_INTERVIEW) {
         navigation.navigate(ROUTES.INTERVIEW_NAVIGATOR);
      } else if (action.id === 'CAREER_COACH_NAV') {
         navigation.navigate(ROUTES.CAREER_NAVIGATOR);
      }
      return;
    }

    if (!resumes || resumes.length === 0) {
      // Need at least one resume context (could alternatively navigate to create one)
      alert("Please create a resume first to use AI features.");
      return;
    }

    if (resumes.length === 1) {
      // Auto-select the only resume
      startConversation(action, resumes[0]);
    } else {
      setSelectedAction(action);
      setPickerVisible(true);
    }
  };

  const startConversation = (action, resume) => {
    setPickerVisible(false);
    navigation.navigate(ROUTES.AI_CONVERSATION, {
      actionType: action.id,
      resumeId: resume.id,
      profileId: profile.id,
      title: `${action.title} - ${resume.resumeName || 'Resume'}`
    });
  };

  const openExistingSession = (session) => {
    navigation.navigate(ROUTES.AI_CONVERSATION, {
      sessionId: session.id,
      profileId: profile.id,
    });
  };

  const renderActionCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={() => handleActionPress(item)}
      activeOpacity={0.7}
    >
      <PremiumCard style={styles.actionCard}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
          <Icon name={item.icon} size={24} color={theme.primary} />
        </View>
        <Text style={[styles.actionTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.actionDescription, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      </PremiumCard>
    </TouchableOpacity>
  );

  const renderSessionItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.sessionItem, { borderBottomColor: theme.border }]}
      onPress={() => openExistingSession(item)}
    >
      <Icon name="chatbubble-ellipses-outline" size={20} color={theme.textSecondary} />
      <View style={styles.sessionInfo}>
        <Text style={[styles.sessionTitle, { color: theme.text }]} numberOfLines={1}>
          {item.title || 'Conversation'}
        </Text>
        <Text style={[styles.sessionDate, { color: theme.textSecondary }]}>
          {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>
      <Icon name="chevron-forward" size={16} color={theme.border} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="AI Assistant" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
          <View style={styles.grid}>
            {ACTION_CARDS.map(item => (
              <View key={item.id} style={styles.gridItem}>
                {renderActionCard({ item })}
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Conversations</Text>
          {sessions && sessions.length > 0 ? (
            <View style={[styles.sessionsList, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {sessions.slice(0, 5).map(session => (
                <View key={session.id}>
                  {renderSessionItem({ item: session })}
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              title="No Recent Activity"
              subtitle="Start a new conversation or use a quick action above."
              icon="time-outline"
            />
          )}
        </View>

      </ScrollView>

      <ResumePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        resumes={resumes}
        onSelect={(resume) => startConversation(selectedAction, resume)}
      />
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
  section: {
    padding: 16,
    paddingTop: 24,
  },
  lastSection: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  cardWrapper: {
    flex: 1,
  },
  actionCard: {
    padding: 16,
    alignItems: 'flex-start',
    height: 140,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  sessionsList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  sessionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 12,
  }
});

export default AIAssistantScreen;
