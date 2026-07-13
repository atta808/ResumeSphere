import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, Icon, EmptyState } from '../../components/common';
import { ProgressBar } from '../../components/charts';
import { useTheme } from '../../theme';
import CareerCoachService from '../../services/career/CareerCoachService';
import { useProfile } from '../../hooks/useProfile';

const CareerProgressScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { profile } = useProfile();

  const [learningPlan, setLearningPlan] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (profile?.id) {
       CareerCoachService.getDashboardState(profile.id).then(data => {
           setLearningPlan(data?.learningPlan || []);
           setHistory(data?.history || []);
       });
    }
  }, [profile?.id]);

  const completedCount = learningPlan.filter(i => i.status === 'COMPLETED').length;
  const totalCount = learningPlan.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Career Progress" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>

        <PremiumCard style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Learning Progress</Text>
            <ProgressBar progress={progressPercent / 100} color={theme.primary} height={12} />
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                {completedCount} of {totalCount} topics completed ({Math.round(progressPercent)}%)
            </Text>
        </PremiumCard>

        <PremiumCard style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
            {history && history.length > 0 ? (
                history.map(item => (
                    <View key={item.id} style={styles.historyItem}>
                        <Icon name="time-outline" size={20} color={theme.textSecondary} />
                        <View style={styles.historyContent}>
                            <Text style={[styles.historyAction, { color: theme.text }]}>{item.action}</Text>
                            <Text style={[styles.historyDesc, { color: theme.textSecondary }]}>{item.description}</Text>
                            <Text style={[styles.historyDate, { color: theme.textSecondary }]}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                        </View>
                    </View>
                ))
            ) : (
                <EmptyState title="No History" subtitle="Your career actions will appear here." icon="time-outline" />
            )}
        </PremiumCard>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  card: { padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  progressText: { marginTop: 12, fontSize: 14, textAlign: 'center' },
  historyItem: { flexDirection: 'row', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 16 },
  historyContent: { marginLeft: 12, flex: 1 },
  historyAction: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  historyDesc: { fontSize: 14, marginBottom: 4 },
  historyDate: { fontSize: 12 }
});

export default CareerProgressScreen;
