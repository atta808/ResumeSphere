import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme';
import Icon from '../../components/common/Icon';
import { portfolioService } from '../../services/portfolio/PortfolioService';

export default function PortfolioHistoryScreen() {
  const route = useRoute();
  const { theme } = useTheme();
  const { portfolioId } = route.params;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await portfolioService.getPortfolioHistory(portfolioId);
        setHistory(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load portfolio history.');
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [portfolioId]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
        <Text style={{ color: theme.textPrimary, textAlign: 'center' }}>Loading history...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Publish History</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Previous versions of your portfolio architecture.
        </Text>

        <View style={styles.timeline}>
          {history.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No publish history yet.</Text>
          ) : (
            history.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.dot, { backgroundColor: index === 0 ? theme.primary : theme.border }]} />
                  {index !== history.length - 1 && <View style={[styles.line, { backgroundColor: theme.border }]} />}
                </View>
                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.versionText, { color: theme.textPrimary }]}>Version {item.version}</Text>
                    <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={[styles.detailsText, { color: theme.textSecondary }]}>
                    Theme: {item.snapshot.settings.theme} | Template: {item.snapshot.portfolio.templateId}
                  </Text>
                </View>
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 32 },
  timeline: { paddingLeft: 8 },
  timelineItem: { flexDirection: 'row', marginBottom: 20 },
  timelineLeft: { alignItems: 'center', marginRight: 16 },
  dot: { width: 12, height: 12, borderRadius: 6, zIndex: 1 },
  line: { width: 2, flex: 1, marginTop: 4, marginBottom: -20 },
  card: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  versionText: { fontSize: 16, fontWeight: 'bold' },
  dateText: { fontSize: 12 },
  detailsText: { fontSize: 14 },
  emptyText: { fontStyle: 'italic' }
});
