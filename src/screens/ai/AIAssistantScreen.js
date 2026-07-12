import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PremiumHeader, EmptyState, PremiumButton } from '../../components/common';
import { useTheme } from '../../theme';

const AIAssistantScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="AI Assistant" />
      <View style={styles.content}>
        <EmptyState
          title="How can I help you today?"
          subtitle="Ask me to rewrite bullet points, generate summaries, or improve your resume."
          icon="robot-outline"
          actionButton={<PremiumButton title="Start Chat" />}
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
    justifyContent: 'center',
    padding: 16,
  },
});

export default AIAssistantScreen;
