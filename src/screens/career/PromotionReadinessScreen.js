import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, Icon, EmptyState } from '../../components/common';
import { CircularScore } from '../../components/charts';
import { useTheme } from '../../theme';
import CareerCoachService from '../../services/career/CareerCoachService';
import { useProfile } from '../../hooks/useProfile';

const PromotionReadinessScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { profile } = useProfile();

  const [data, setData] = useState(null);

  useEffect(() => {
    if (profile?.id) {
       CareerCoachService.getDashboardState(profile.id).then(state => {
           setData(state?.promotionReadiness || null);
       });
    }
  }, [profile?.id]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Promotion Readiness" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>

        {!data ? (
            <EmptyState title="No Promotion Data" subtitle="Set a Promotion goal and generate a plan." icon="trending-up-outline" />
        ) : (
            <>
                <PremiumCard style={styles.scoreCard}>
                    <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 20 }]}>Readiness Score</Text>
                    <CircularScore score={data.promotionReadinessScore || 0} size={140} strokeWidth={14} />
                </PremiumCard>

                {data.strengths && data.strengths.length > 0 && (
                    <PremiumCard style={styles.card}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Key Strengths</Text>
                        {data.strengths.map((str, i) => (
                            <View key={i} style={styles.bulletRow}>
                                <Icon name="checkmark-circle" size={20} color={theme.success} />
                                <Text style={[styles.bulletText, { color: theme.text }]}>{str}</Text>
                            </View>
                        ))}
                    </PremiumCard>
                )}

                {data.areasForImprovement && data.areasForImprovement.length > 0 && (
                    <PremiumCard style={styles.card}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Areas for Improvement</Text>
                        {data.areasForImprovement.map((area, i) => (
                            <View key={i} style={styles.bulletRow}>
                                <Icon name="alert-circle" size={20} color={theme.warning} />
                                <Text style={[styles.bulletText, { color: theme.text }]}>{area}</Text>
                            </View>
                        ))}
                    </PremiumCard>
                )}

                {data.improvementPlan && data.improvementPlan.length > 0 && (
                    <PremiumCard style={styles.card}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Action Plan</Text>
                        {data.improvementPlan.map((action, i) => (
                            <View key={i} style={styles.actionItem}>
                                <Text style={[styles.actionTitle, { color: theme.text }]}>{action.action}</Text>
                                <Text style={[styles.actionDesc, { color: theme.textSecondary }]}>{action.description}</Text>
                                <Text style={[styles.actionPriority, { color: theme.primary }]}>{action.priority} Priority</Text>
                            </View>
                        ))}
                    </PremiumCard>
                )}
            </>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  card: { padding: 16, marginBottom: 16 },
  scoreCard: { padding: 24, marginBottom: 16, alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  bulletText: { flex: 1, marginLeft: 12, fontSize: 15, lineHeight: 22 },
  actionItem: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  actionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  actionDesc: { fontSize: 14, marginBottom: 8, lineHeight: 20 },
  actionPriority: { fontSize: 12, fontWeight: '700' }
});

export default PromotionReadinessScreen;
