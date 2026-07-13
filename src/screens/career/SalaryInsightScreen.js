import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, Icon, EmptyState } from '../../components/common';
import { useTheme } from '../../theme';
import CareerCoachService from '../../services/career/CareerCoachService';
import { useProfile } from '../../hooks/useProfile';

const SalaryInsightScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { profile } = useProfile();

  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        if (!profile?.id) return;
        setLoading(true);
        try {
            const dashboard = await CareerCoachService.getDashboardState(profile.id);
            if (dashboard?.currentGoal) {
                 const data = await CareerCoachService.getSalaryInsights({ profile, goal: dashboard.currentGoal });
                 if (data && data.salaryInsights) {
                     setInsights(data.salaryInsights);
                 }
            }
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [profile?.id]);

  if (loading) return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.primary} />
      </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Salary Insights" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>

        {!insights ? (
            <EmptyState title="No Salary Data Available" subtitle="Make sure you have an active career goal." icon="cash-outline" />
        ) : (
            <>
                <PremiumCard style={styles.card}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Market Estimates ({insights.currency})</Text>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Entry Level:</Text>
                        <Text style={[styles.value, { color: theme.text }]}>{insights.entryLevel}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Mid Level:</Text>
                        <Text style={[styles.value, { color: theme.text }]}>{insights.midLevel}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Senior Level:</Text>
                        <Text style={[styles.value, { color: theme.text }]}>{insights.seniorLevel}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Executive:</Text>
                        <Text style={[styles.value, { color: theme.text }]}>{insights.executiveLevel}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Market Trend:</Text>
                        <Text style={[styles.value, { color: theme.primary, fontWeight: '700' }]}>{insights.marketTrend}</Text>
                    </View>
                </PremiumCard>

                {insights.negotiationTips && insights.negotiationTips.length > 0 && (
                    <PremiumCard style={styles.card}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Negotiation Tips</Text>
                        {insights.negotiationTips.map((tip, i) => (
                            <View key={i} style={styles.tipRow}>
                                <Icon name="bulb-outline" size={20} color={theme.warning} />
                                <Text style={[styles.tipText, { color: theme.text }]}>{tip}</Text>
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 40 },
  card: { padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  label: { fontSize: 15 },
  value: { fontSize: 15, fontWeight: '500' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  tipText: { flex: 1, marginLeft: 12, fontSize: 14, lineHeight: 20 }
});

export default SalaryInsightScreen;
