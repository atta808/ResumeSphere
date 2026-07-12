import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { lightTheme, darkTheme } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Icon from '../../components/common/Icon';
import ProfileService from '../../services/profile/ProfileService';
import ImportService from '../../services/ocr/ImportService';

const ConfidenceBadge = ({ confidence, source }) => {
  let color = '#ef4444'; // Red
  let text = 'Needs Review';
  if (confidence >= 90) {
    color = '#22c55e'; // Green
    text = 'High';
  } else if (confidence >= 70) {
    color = '#f97316'; // Orange
    text = 'Review';
  }

  return (
    <View style={[styles.badgeContainer, { backgroundColor: color + '20' }]}>
      <Text style={[styles.badgeText, { color }]}>
        {confidence}% - {source}
      </Text>
    </View>
  );
};

const EditableField = ({ label, field, onChange, theme }) => {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>{label}</Text>
        {field && field.confidence !== undefined && (
          <ConfidenceBadge confidence={field.confidence} source={field.source} />
        )}
      </View>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardBackground }]}
        value={field?.value || ''}
        onChangeText={onChange}
        multiline={label === 'Summary' || label === 'Experience' || label === 'Education'}
      />
    </View>
  );
};

const ImportReviewScreen = ({ route, navigation }) => {
  const { session } = route.params;
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  // Local state for editing before saving
  const [profile, setProfile] = useState(session.parsedProfile || {});

  const handleFieldChange = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const handleArrayFieldChange = (key, index, value) => {
    setProfile((prev) => {
      const arr = [...(prev[key] || [])];
      if (!arr[index]) arr[index] = { value: '', confidence: 100, source: 'Manual' };
      arr[index] = { ...arr[index], value };
      return { ...prev, [key]: arr };
    });
  };

  const [checkingDuplicates, setCheckingDuplicates] = useState(false);

  const saveProfileData = async (dataToSave, profileIdToOverwrite = null) => {
      try {
          const newProfile = {
            ...dataToSave,
            id: profileIdToOverwrite || require('expo-crypto').randomUUID()
          };
          await ProfileService.saveProfile(newProfile);
          Alert.alert('Success', 'Profile imported successfully!', [
            { text: 'OK', onPress: () => navigation.popToTop() }
          ]);
      } catch (error) {
          Alert.alert('Error', 'Failed to save profile.');
      }
  };

  const mergeProfiles = async (newData, existingId) => {
    try {
        const fullProfile = await ProfileService.getFullProfile(existingId);
        if (!fullProfile) {
            throw new Error("Could not load full profile for merging.");
        }

        // Extremely naive merge: prefer existing fields unless empty,
        // concat arrays. A real app would provide a detailed merge UI.
        const mergedProfile = {
            id: existingId,
            firstName: fullProfile.firstName || newData.firstName,
            lastName: fullProfile.lastName || newData.lastName,
            email: fullProfile.email || newData.email,
            phone: fullProfile.phone || newData.phone,
            linkedinUrl: fullProfile.linkedinUrl || newData.linkedinUrl,
            githubUrl: fullProfile.githubUrl || newData.githubUrl,
            summary: fullProfile.summary || newData.summary,
            // For demo, just taking imported items directly since array merge logic
            // without IDs is complex and potentially creates duplicates
            experience: newData.experience,
            education: newData.education,
            skills: newData.skills
        };

        await ProfileService.saveProfile(mergedProfile);
        Alert.alert('Success', 'Profile merged successfully!', [
            { text: 'OK', onPress: () => navigation.popToTop() }
        ]);
    } catch (error) {
         Alert.alert('Error', 'Failed to merge profile.');
    }
  }

  const handleSave = async () => {
    try {
      setCheckingDuplicates(true);

      const dataToSave = {
        firstName: profile.fullName?.value?.split(' ')[0] || '',
        lastName: profile.fullName?.value?.split(' ').slice(1).join(' ') || '',
        email: profile.email?.value || '',
        phone: profile.phone?.value || '',
        linkedinUrl: profile.linkedin?.value || '',
        githubUrl: profile.github?.value || '',
        summary: profile.summary?.value || '',
        experience: profile.experience?.map(e => e.value) || [],
        education: profile.education?.map(e => e.value) || [],
        skills: profile.skills?.map(s => s.value) || [],
      };

      const result = await ImportService.detectDuplicates(dataToSave);

      setCheckingDuplicates(false);

      if (result.duplicateFound) {
          Alert.alert(
              'Duplicate Detected',
              `We found an existing profile that closely matches this import (${Math.round(result.highestScore)}% match).`,
              [
                  {
                      text: 'Merge',
                      onPress: () => mergeProfiles(dataToSave, result.duplicateFound.id)
                  },
                  {
                      text: 'Replace',
                      onPress: () => saveProfileData(dataToSave, result.duplicateFound.id)
                  },
                  {
                      text: 'Import as New',
                      onPress: () => saveProfileData(dataToSave)
                  },
                  {
                      text: 'Cancel',
                      style: 'cancel'
                  }
              ]
          );
      } else {
          await saveProfileData(dataToSave);
      }

    } catch (error) {
      setCheckingDuplicates(false);
      Alert.alert('Error', 'An error occurred while validating duplicates.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Review Import</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <EditableField label="Full Name" field={profile.fullName} onChange={(v) => handleFieldChange('fullName', v)} theme={theme} />
        <EditableField label="Email" field={profile.email} onChange={(v) => handleFieldChange('email', v)} theme={theme} />
        <EditableField label="Phone" field={profile.phone} onChange={(v) => handleFieldChange('phone', v)} theme={theme} />
        <EditableField label="LinkedIn" field={profile.linkedin} onChange={(v) => handleFieldChange('linkedin', v)} theme={theme} />
        <EditableField label="GitHub" field={profile.github} onChange={(v) => handleFieldChange('github', v)} theme={theme} />
        <EditableField label="Summary" field={profile.summary} onChange={(v) => handleFieldChange('summary', v)} theme={theme} />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Experience</Text>
        {(profile.experience || []).map((exp, index) => (
          <EditableField key={`exp-${index}`} label={`Experience ${index + 1}`} field={exp} onChange={(v) => handleArrayFieldChange('experience', index, v)} theme={theme} />
        ))}

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Education</Text>
        {(profile.education || []).map((edu, index) => (
           <EditableField key={`edu-${index}`} label={`Education ${index + 1}`} field={edu} onChange={(v) => handleArrayFieldChange('education', index, v)} theme={theme} />
        ))}

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Skills</Text>
        {(profile.skills || []).map((skill, index) => (
           <EditableField key={`skill-${index}`} label={`Skill ${index + 1}`} field={skill} onChange={(v) => handleArrayFieldChange('skills', index, v)} theme={theme} />
        ))}

      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Confirm & Import</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    ...typography.h3,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  fieldLabel: {
    ...typography.caption,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.sm,
    ...typography.body1,
    minHeight: 48,
  },
  badgeContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
  },
  saveButton: {
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    ...typography.button,
    color: '#fff',
  },
});

export default ImportReviewScreen;
