import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PremiumHeader, EmptyState, PremiumButton } from '../../components/common';
import { useTheme } from '../../theme';

const ATSScoreScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader
        title="ATS Score"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <EmptyState
          title="Analyze Your Resume"
          subtitle="Check how well your resume matches job descriptions for ATS optimization."
          icon="chart-line"
          actionButton={<PremiumButton title="Scan Resume" />}
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

export default ATSScoreScreen;
