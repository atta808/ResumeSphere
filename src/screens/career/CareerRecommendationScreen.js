import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, Icon, EmptyState } from '../../components/common';
import { useTheme } from '../../theme';
import CareerCoachService from '../../services/career/CareerCoachService';
import { useProfile } from '../../hooks/useProfile';

const CareerRecommendationScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { profile } = useProfile();

  const [skillGaps, setSkillGaps] = useState([]);

  useEffect(() => {
    if (profile?.id) {
       CareerCoachService.getDashboardState(profile.id).then(data => {
           setSkillGaps(data?.skillGaps || []);
       });
    }
  }, [profile?.id]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Skill Gap Analysis" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>

        {skillGaps.length === 0 ? (
            <EmptyState title="No Skill Gaps Detected" subtitle="Generate your career plan first." icon="star-outline" />
        ) : (
            skillGaps.map((item) => (
                <PremiumCard key={item.id} style={styles.card}>
                    <View style={styles.header}>
                        <Icon name="star" size={24} color={theme.warning} />
                        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                    </View>
                    <Text style={[styles.provider, { color: theme.textSecondary }]}>{item.description}</Text>
                    {item.estimatedImpact && (
                        <View style={styles.impactBadge}>
                            <Text style={styles.impactText}>Est. Time: {item.estimatedImpact}</Text>
                        </View>
                    )}
                </PremiumCard>
            ))
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  card: { padding: 16, marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '600', marginLeft: 10, flex: 1 },
  provider: { fontSize: 14, marginBottom: 12, lineHeight: 20 },
  impactBadge: { backgroundColor: '#Fef9C3', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  impactText: { color: '#854D0E', fontSize: 12, fontWeight: '600' }
});

export default CareerRecommendationScreen;
