import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PremiumHeader, EmptyState, PremiumButton } from '../../components/common';
import { useTheme } from '../../theme';

const ResumeBuilderScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Resume Builder" />
      <View style={styles.content}>
        <EmptyState
          title="No Resumes Yet"
          subtitle="Create your first professional resume to get started."
          icon="file-document-outline"
          actionButton={<PremiumButton title="Create Resume" />}
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

export default ResumeBuilderScreen;
