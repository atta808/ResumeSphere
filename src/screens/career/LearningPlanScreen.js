import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, Icon, EmptyState, ProgressBar } from '../../components/common';
import { useTheme } from '../../theme';
import CareerCoachService from '../../services/career/CareerCoachService';
import { useProfile } from '../../hooks/useProfile';

const LearningPlanScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { profile } = useProfile();

  const [learningPlan, setLearningPlan] = useState([]);

  const loadPlan = async () => {
      if (profile?.id) {
          const data = await CareerCoachService.getDashboardState(profile.id);
          setLearningPlan(data?.learningPlan || []);
      }
  };

  useEffect(() => {
    loadPlan();
  }, [profile?.id]);

  const toggleStatus = async (item) => {
      const newStatus = item.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
      await CareerCoachService.updateLearningProgress(item.id, { status: newStatus });
      loadPlan(); // reload
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Learning Plan" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>

        {learningPlan.length === 0 ? (
            <EmptyState title="No Learning Plan Generated" subtitle="Go to the Career Dashboard to generate your plan." icon="book-outline" />
        ) : (
            learningPlan.map((item) => {
                const isCompleted = item.status === 'COMPLETED';
                return (
                <PremiumCard key={item.id} style={styles.card}>
                    <View style={styles.header}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.skillName, { color: theme.text, textDecorationLine: isCompleted ? 'line-through' : 'none' }]}>
                                {item.skillName}
                            </Text>
                            <Text style={[styles.resourceName, { color: theme.textSecondary }]}>
                                {item.resourceType}: {item.resourceName || 'Various Resources'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => toggleStatus(item)}>
                            <Icon
                                name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
                                size={28}
                                color={isCompleted ? theme.success : theme.border}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.meta}>
                         <View style={styles.metaItem}>
                             <Icon name="time-outline" size={14} color={theme.textSecondary} />
                             <Text style={[styles.metaText, { color: theme.textSecondary }]}>{item.estimatedHours} hrs</Text>
                         </View>
                    </View>
                </PremiumCard>
            )})
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  card: { padding: 16, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  skillName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  resourceName: { fontSize: 13 },
  meta: { flexDirection: 'row', marginTop: 8, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, marginLeft: 4 }
});

export default LearningPlanScreen;
