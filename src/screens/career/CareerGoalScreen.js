import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumHeader, PremiumButton, PremiumCard, Icon } from '../../components/common';
import { useTheme } from '../../theme';
import CareerCoachService from '../../services/career/CareerCoachService';
import { useProfile } from '../../hooks/useProfile';

const CareerGoalScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { profile } = useProfile();

  const goalId = route.params?.goalId;

  const [title, setTitle] = useState('');
  const [goalType, setGoalType] = useState('PROMOTION');
  const [targetRole, setTargetRole] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (goalId && profile?.id) {
      CareerCoachService.getDashboardState(profile.id, goalId).then(state => {
        const goal = state?.currentGoal;
        if (goal) {
          setTitle(goal.title);
          setGoalType(goal.goalType);
          setTargetRole(goal.targetRole || '');
        }
      });
    }
  }, [goalId, profile?.id]);

  const handleSave = async () => {
    if (!profile?.id) return;
    if (!title.trim()) {
        alert("Please enter a goal title");
        return;
    }

    setSaving(true);
    try {
      const goalData = {
        title,
        goalType,
        targetRole
      };

      if (goalId) {
        await CareerCoachService.updateGoal(goalId, goalData);
      } else {
        await CareerCoachService.createGoal(profile.id, goalData);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save goal:', error);
      alert('Failed to save career goal');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title={goalId ? "Edit Career Goal" : "New Career Goal"} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>

        <PremiumCard style={styles.card}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Goal Title</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Become a Senior Developer"
            placeholderTextColor={theme.textSecondary}
          />

          <Text style={[styles.label, { color: theme.textSecondary, marginTop: 16 }]}>Goal Type</Text>
          <View style={styles.typeSelector}>
             {['PROMOTION', 'CAREER_SWITCH', 'FIRST_JOB'].map(type => (
                 <PremiumButton
                    key={type}
                    title={type.replace('_', ' ')}
                    onPress={() => setGoalType(type)}
                    style={[
                        styles.typeBtn,
                        { backgroundColor: goalType === type ? theme.primary : theme.surface, borderColor: theme.primary, borderWidth: 1 }
                    ]}
                    textStyle={{ color: goalType === type ? '#FFF' : theme.primary, fontSize: 12 }}
                 />
             ))}
          </View>

          <Text style={[styles.label, { color: theme.textSecondary, marginTop: 16 }]}>Target Role (Optional)</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            value={targetRole}
            onChangeText={setTargetRole}
            placeholder="e.g. Lead Engineer"
            placeholderTextColor={theme.textSecondary}
          />
        </PremiumCard>

      </ScrollView>
      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <PremiumButton
          title={saving ? "Saving..." : "Save Goal"}
          onPress={handleSave}
          disabled={saving}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { padding: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  typeSelector: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
  },
  typeBtn: {
      flex: 1,
      minWidth: '30%',
      paddingVertical: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    paddingBottom: 32,
  }
});

export default CareerGoalScreen;
