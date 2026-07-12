import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PremiumHeader, EmptyState, PremiumButton } from '../../components/common';
import { useTheme } from '../../theme';

const InterviewPrepScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader
        title="Interview Prep"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <EmptyState
          title="Ready to Practice?"
          subtitle="Mock interviews and generated questions based on your target role."
          icon="microphone-outline"
          actionButton={<PremiumButton title="Start Practice" />}
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

export default InterviewPrepScreen;
