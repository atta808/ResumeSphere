import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, Icon, EmptyState } from '../../components/common';
import { useTheme } from '../../theme';
import CareerCoachService from '../../services/career/CareerCoachService';
import { useProfile } from '../../hooks/useProfile';

const CareerRoadmapScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { profile } = useProfile();

  const [roadmap, setRoadmap] = useState([]);

  useEffect(() => {
    if (profile?.id) {
       CareerCoachService.getDashboardState(profile.id).then(data => {
           setRoadmap(data?.roadmap || []);
       });
    }
  }, [profile?.id]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Career Roadmap" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>

        {roadmap.length === 0 ? (
            <EmptyState title="No Roadmap Generated" subtitle="Go to the Career Dashboard to generate your plan." icon="map-outline" />
        ) : (
            <View style={styles.timeline}>
                {roadmap.map((step, index) => (
                    <View key={step.id} style={styles.stepContainer}>
                        <View style={styles.timelineGraphic}>
                            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
                            {index !== roadmap.length - 1 && <View style={[styles.line, { backgroundColor: theme.border }]} />}
                        </View>
                        <PremiumCard style={styles.stepCard}>
                            <View style={styles.stepHeader}>
                                <Text style={[styles.stepTitle, { color: theme.text }]}>{step.title}</Text>
                                <Text style={[styles.priority, { color: theme.primary }]}>{step.priority}</Text>
                            </View>
                            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>{step.description}</Text>
                            {step.estimatedImpact && (
                                <View style={styles.metaInfo}>
                                    <Icon name="time-outline" size={14} color={theme.textSecondary} />
                                    <Text style={[styles.metaText, { color: theme.textSecondary }]}>{step.estimatedImpact}</Text>
                                </View>
                            )}
                        </PremiumCard>
                    </View>
                ))}
            </View>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  timeline: { paddingVertical: 10 },
  stepContainer: { flexDirection: 'row', marginBottom: 20 },
  timelineGraphic: { width: 40, alignItems: 'center' },
  dot: { width: 16, height: 16, borderRadius: 8, marginTop: 4, zIndex: 2 },
  line: { width: 2, flex: 1, marginTop: -4, marginBottom: -10, zIndex: 1 },
  stepCard: { flex: 1, padding: 16 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  stepTitle: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 10 },
  priority: { fontSize: 12, fontWeight: '700' },
  stepDesc: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  metaInfo: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, marginLeft: 4 }
});

export default CareerRoadmapScreen;
