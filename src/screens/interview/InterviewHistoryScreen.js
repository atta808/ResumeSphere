import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, Icon, EmptyState } from '../../components/common';
import { useTheme } from '../../theme';
import { ROUTES } from '../../navigation/routes';
import InterviewEngine from '../../services/interview/InterviewEngine';

const InterviewHistoryScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const data = await InterviewEngine.getHistory();
        if (isMounted) {
          setSessions(data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) setLoading(false);
      }
    };
    fetchHistory();
    return () => { isMounted = false; };
  }, []);

  const renderItem = ({ item }) => {
    const isCompleted = item.status === 'completed';
    return (
      <TouchableOpacity
        onPress={() => isCompleted
          ? navigation.navigate(ROUTES.INTERVIEW_FEEDBACK, { sessionId: item.id })
          : navigation.navigate(ROUTES.INTERVIEW_SESSION, { sessionId: item.id })
        }
        activeOpacity={0.7}
      >
        <PremiumCard style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.title, { color: theme.text }]}>{item.position}</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {item.interviewType} • {item.difficulty}
              </Text>
            </View>
            {isCompleted ? (
              <View style={[styles.scoreBadge, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.scoreText, { color: theme.primary }]}>{item.overallScore}</Text>
              </View>
            ) : (
              <View style={[styles.statusBadge, { backgroundColor: theme.warning + '20' }]}>
                <Text style={[styles.statusText, { color: theme.warning }]}>In Progress</Text>
              </View>
            )}
          </View>
          <View style={styles.cardFooter}>
            <Text style={[styles.date, { color: theme.textSecondary }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <Icon name="chevron-forward" size={16} color={theme.border} />
          </View>
        </PremiumCard>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="History" onBack={() => navigation.goBack()} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : sessions.length === 0 ? (
        <EmptyState
          title="No Interviews Yet"
          subtitle="Complete your first mock interview to see your history here."
          icon="time-outline"
        />
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  scoreBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
  },
});

export default InterviewHistoryScreen;
