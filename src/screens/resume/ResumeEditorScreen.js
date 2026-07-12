import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumHeader, Icon, PremiumCard } from '../../components/common';
import { useTheme } from '../../theme';
import { ROUTES } from '../../navigation/routes';
import { SECTION_TYPES } from '../../constants/appConstants';
import ResumeService from '../../services/resume/ResumeService';
import { spacing, typography, radius } from '../../theme';

const SECTIONS_CONFIG = [
  { id: SECTION_TYPES.PERSONAL_INFO, title: 'Personal Information', icon: 'account-outline' },
  { id: SECTION_TYPES.SUMMARY, title: 'Professional Summary', icon: 'text-box-outline' },
  { id: SECTION_TYPES.EDUCATION, title: 'Education', icon: 'school-outline' },
  { id: SECTION_TYPES.EXPERIENCE, title: 'Experience', icon: 'briefcase-outline' },
  { id: SECTION_TYPES.PROJECTS, title: 'Projects', icon: 'folder-outline' },
  { id: SECTION_TYPES.SKILLS, title: 'Skills', icon: 'star-outline' },
  { id: SECTION_TYPES.LANGUAGES, title: 'Languages', icon: 'translate' },
  { id: SECTION_TYPES.CERTIFICATES, title: 'Certificates', icon: 'certificate-outline' },
  { id: SECTION_TYPES.AWARDS, title: 'Awards', icon: 'trophy-outline' },
  { id: SECTION_TYPES.REFERENCES, title: 'References', icon: 'account-group-outline' },
  { id: SECTION_TYPES.CUSTOM, title: 'Custom Sections', icon: 'plus-box-outline' }
];

const ResumeEditorScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const resumeId = route.params?.resumeId;

  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      if (resumeId) {
        const data = await ResumeService.getResumeById(resumeId);
        setResume(data);
      }
    };
    fetchResume();
  }, [resumeId]);

  const handleSectionPress = (sectionId, title) => {
    navigation.navigate(ROUTES.SECTION_EDITOR, {
      resumeId,
      profileId: resume?.profileId,
      sectionType: sectionId,
      sectionTitle: title
    });
  };

  const handlePreview = () => {
    navigation.navigate(ROUTES.RESUME_PREVIEW, { resumeId });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader
        title={resume?.resumeName || 'Resume Editor'}
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={handlePreview} style={styles.previewBtn} accessibilityLabel="Preview Resume">
             <Icon name="eye-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerInfo}>
           <Text style={[typography.h3, {color: theme.textPrimary}]}>Content Sections</Text>
           <Text style={[typography.body, {color: theme.textSecondary, marginTop: spacing.xs}]}>
              Select a section to add or edit content. This updates your master profile.
           </Text>
        </View>

        {SECTIONS_CONFIG.map((section) => (
          <TouchableOpacity
             key={section.id}
             style={[styles.sectionRow, { backgroundColor: theme.surface, borderBottomColor: theme.divider }]}
             onPress={() => handleSectionPress(section.id, section.title)}
             activeOpacity={0.7}
          >
             <View style={[styles.iconContainer, { backgroundColor: theme.primary + '15' }]}>
                <Icon name={section.icon} size={24} color={theme.primary} />
             </View>
             <Text style={[typography.body, styles.sectionTitle, { color: theme.textPrimary }]}>
               {section.title}
             </Text>
             <Icon name="chevron-right" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewBtn: {
    padding: spacing.xs,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  headerInfo: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  sectionTitle: {
    flex: 1,
    fontWeight: '500',
  }
});

export default ResumeEditorScreen;
