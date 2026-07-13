import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../theme';
import Icon from '../../components/common/Icon';
import { portfolioService } from '../../services/portfolio/PortfolioService';

export default function PortfolioAnalyticsScreen() {
  const { theme } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const rows = await portfolioService.getAnalyticsEvents();
        setEvents(rows);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
        <Text style={{ color: theme.textPrimary, textAlign: 'center' }}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Icon name="chart-bar" size={48} color={theme.primary} />
          <Text style={[styles.title, { color: theme.textPrimary }]}>Analytics Dashboard</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Track engagement across your portfolio and QR codes.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          {events.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No analytics data available yet.</Text>
          ) : (
            events.map((event, index) => (
              <View key={index} style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.statCount, { color: theme.primary }]}>{event.count}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{event.eventType}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  subtitle: { fontSize: 14, textAlign: 'center', marginTop: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statCount: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  statLabel: { fontSize: 12, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 },
  emptyText: { width: '100%', textAlign: 'center', fontStyle: 'italic', marginTop: 20 }
});
