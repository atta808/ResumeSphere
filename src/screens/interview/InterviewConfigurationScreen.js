import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumHeader, Button } from '../../components/common';
import { useTheme } from '../../theme';
import { ROUTES } from '../../navigation/routes';
import { useProfile } from '../../hooks/useProfile';
import { useResumes } from '../../hooks/useResumes';
import InterviewEngine from '../../services/interview/InterviewEngine';
import Logger from '../../utils/logger';

const INTERVIEW_TYPES = ['Behavioral', 'Technical', 'HR', 'STAR', 'Executive'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const InterviewConfigurationScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { profile } = useProfile();
  const route = useRoute();
  const { resumes } = useResumes();

  const [companyName, setCompanyName] = useState(route.params?.companyName || '');
  const [position, setPosition] = useState(route.params?.position || '');
  const [selectedType, setSelectedType] = useState('Behavioral');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    if (!profile) {
      Alert.alert('Error', 'Profile not found. Please create a profile first.');
      return;
    }
    if (!resumes || resumes.length === 0) {
      Alert.alert('Error', 'Please create at least one resume.');
      return;
    }
    if (!position.trim()) {
      Alert.alert('Error', 'Please enter a target position.');
      return;
    }

    setIsLoading(true);
    try {
      // Use the first active resume by default for phase 12 scope,
      // can be enhanced with a picker later
      const defaultResumeId = route.params?.resumeId || resumes[0].id;
      const jobDescriptionId = route.params?.jobDescriptionId || null;

      const session = await InterviewEngine.startNewSession({
        profileId: profile.id,
        resumeId: defaultResumeId,
        jobDescriptionId,
        companyName,
        position,
        interviewType: selectedType,
        difficulty: selectedDifficulty
      });

      // Navigate to the session passing the created ID
      navigation.replace(ROUTES.INTERVIEW_SESSION, { sessionId: session.id });
    } catch (error) {
      Logger.error(error);
      Alert.alert('Error', 'Failed to start interview session.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderChips = (options, selected, onSelect) => (
    <View style={styles.chipContainer}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[
            styles.chip,
            { borderColor: theme.border, backgroundColor: selected === opt ? theme.primary : theme.surface }
          ]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.chipText, { color: selected === opt ? '#fff' : theme.text }]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Setup Interview" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Target Position *</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            placeholder="e.g. Senior Software Engineer"
            placeholderTextColor={theme.textSecondary}
            value={position}
            onChangeText={setPosition}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Target Company (Optional)</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            placeholder="e.g. Google, Tech Startup"
            placeholderTextColor={theme.textSecondary}
            value={companyName}
            onChangeText={setCompanyName}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Interview Type</Text>
          {renderChips(INTERVIEW_TYPES, selectedType, setSelectedType)}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Difficulty</Text>
          {renderChips(DIFFICULTIES, selectedDifficulty, setSelectedDifficulty)}
        </View>

      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.surface }]}>
        <Button
          title="Start Mock Interview"
          onPress={handleStart}
          loading={isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  }
});

export default InterviewConfigurationScreen;
