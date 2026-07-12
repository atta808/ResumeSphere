import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  PremiumHeader,
  PremiumInput,
  PremiumButton,
  PremiumCard,
  Icon,
  EmptyState
} from '../../components/common';
import { useTheme } from '../../theme';
import { SECTION_TYPES } from '../../constants/appConstants';
import { useDebounce } from '../../hooks/useDebounce';
import ValidationService from '../../services/profile/ValidationService';
import { spacing, typography, radius } from '../../theme';
import { useProfile } from '../../hooks/useProfile';
import {
  useEducation,
  useExperience,
  useProjects,
  useSkills,
  useLanguages,
  useCertificates,
  useAwards
} from '../../hooks/sectionHooks';

const SectionEditorScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const { resumeId, profileId, sectionType, sectionTitle } = route.params || {};

  // Form state
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingArray, setIsEditingArray] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const debouncedFormData = useDebounce(formData, 1000);

  // Hook mappings
  const { profile, loadProfile, saveProfile } = useProfile(profileId);
  const eduHook = useEducation();
  const expHook = useExperience();
  const projHook = useProjects();
  const skillHook = useSkills();
  const langHook = useLanguages();
  const certHook = useCertificates();
  const awardHook = useAwards();

  // Pick the right hook for arrays
  const getArrayHook = useCallback(() => {
    switch (sectionType) {
      case SECTION_TYPES.EDUCATION: return eduHook;
      case SECTION_TYPES.EXPERIENCE: return expHook;
      case SECTION_TYPES.PROJECTS: return projHook;
      case SECTION_TYPES.SKILLS: return skillHook;
      case SECTION_TYPES.LANGUAGES: return langHook;
      case SECTION_TYPES.CERTIFICATES: return certHook;
      case SECTION_TYPES.AWARDS: return awardHook;
      default: return null;
    }
  }, [sectionType, eduHook, expHook, projHook, skillHook, langHook, certHook, awardHook]);

  const arrayHook = getArrayHook();

  useEffect(() => {
    if (sectionType === SECTION_TYPES.PERSONAL_INFO || sectionType === SECTION_TYPES.SUMMARY) {
      if (profile && Object.keys(formData).length === 0) {
        setFormData(profile);
      }
    } else if (arrayHook && profileId) {
      arrayHook.loadItems(profileId);
    }
  }, [profileId, sectionType, profile]); // Added profile, but condition prevents loop

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSave = async (forceSaveData = null) => {
    const dataToSave = forceSaveData || formData;
    const { isValid, errors: validationErrors } = ValidationService.validate(dataToSave, sectionType);

    setErrors(validationErrors);

    if (!isValid) return false;

    setIsSaving(true);
    try {
      if (sectionType === SECTION_TYPES.PERSONAL_INFO || sectionType === SECTION_TYPES.SUMMARY) {
        await saveProfile({ ...profile, ...dataToSave, id: profileId });
      } else if (arrayHook) {
        await arrayHook.saveItem({ ...dataToSave, profileId });
        setIsEditingArray(false);
        setFormData({});
        setEditingItemId(null);
      }
      return true;
    } catch (e) {
      Alert.alert('Error', 'Failed to save data.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save effect
  useEffect(() => {
    // Only auto-save if we're editing the main profile (Personal Info / Summary)
    // For arrays, wait for explicit "Save" click to add/update item to avoid incomplete entries
    if ((sectionType === SECTION_TYPES.PERSONAL_INFO || sectionType === SECTION_TYPES.SUMMARY) && Object.keys(debouncedFormData).length > 0) {
      if (profile && JSON.stringify(debouncedFormData) !== JSON.stringify(profile)) {
          handleSave(debouncedFormData);
      }
    }
  }, [debouncedFormData, sectionType]);

  const renderFormFields = () => {
    switch (sectionType) {
      case SECTION_TYPES.PERSONAL_INFO:
        return (
          <>
            <PremiumInput label="Full Name" value={formData.fullName} onChangeText={t => handleChange('fullName', t)} error={errors.fullName} />
            <PremiumInput label="Professional Title" value={formData.professionalTitle} onChangeText={t => handleChange('professionalTitle', t)} />
            <PremiumInput label="Email" value={formData.email} onChangeText={t => handleChange('email', t)} error={errors.email} keyboardType="email-address" />
            <PremiumInput label="Phone" value={formData.phone} onChangeText={t => handleChange('phone', t)} error={errors.phone} keyboardType="phone-pad" />
            <PremiumInput label="Website" value={formData.website} onChangeText={t => handleChange('website', t)} error={errors.website} keyboardType="url" />
            <PremiumInput label="LinkedIn" value={formData.linkedIn} onChangeText={t => handleChange('linkedIn', t)} error={errors.linkedIn} keyboardType="url" />
          </>
        );
      case SECTION_TYPES.SUMMARY:
        return (
          <PremiumInput label="Professional Summary" value={formData.summary} onChangeText={t => handleChange('summary', t)} multiline inputStyle={{ minHeight: 120, textAlignVertical: 'top' }} />
        );
      case SECTION_TYPES.EDUCATION:
        return (
          <>
             <PremiumInput label="Institution" value={formData.institution} onChangeText={t => handleChange('institution', t)} error={errors.institution} />
             <PremiumInput label="Degree" value={formData.degree} onChangeText={t => handleChange('degree', t)} error={errors.degree} />
             <PremiumInput label="Field of Study" value={formData.fieldOfStudy} onChangeText={t => handleChange('fieldOfStudy', t)} />
             <View style={styles.row}>
                <PremiumInput label="Start Date" value={formData.startDate} onChangeText={t => handleChange('startDate', t)} style={{flex: 1, marginRight: 8}} placeholder="YYYY-MM-DD" />
                <PremiumInput label="End Date" value={formData.endDate} onChangeText={t => handleChange('endDate', t)} error={errors.endDate} style={{flex: 1, marginLeft: 8}} placeholder="YYYY-MM-DD" />
             </View>
          </>
        );
      case SECTION_TYPES.EXPERIENCE:
        return (
          <>
             <PremiumInput label="Company" value={formData.company} onChangeText={t => handleChange('company', t)} error={errors.company} />
             <PremiumInput label="Position" value={formData.position} onChangeText={t => handleChange('position', t)} error={errors.position} />
             <View style={styles.row}>
                <PremiumInput label="Start Date" value={formData.startDate} onChangeText={t => handleChange('startDate', t)} style={{flex: 1, marginRight: 8}} placeholder="YYYY-MM-DD" />
                <PremiumInput label="End Date" value={formData.endDate} onChangeText={t => handleChange('endDate', t)} error={errors.endDate} style={{flex: 1, marginLeft: 8}} placeholder="YYYY-MM-DD" />
             </View>
             <PremiumInput label="Description" value={formData.description} onChangeText={t => handleChange('description', t)} multiline inputStyle={{ minHeight: 100, textAlignVertical: 'top' }} />
          </>
        );
      case SECTION_TYPES.SKILLS:
        return (
           <PremiumInput label="Skill Name" value={formData.name} onChangeText={t => handleChange('name', t)} error={errors.name} />
        );
      default:
        return <Text style={{color: theme.textSecondary}}>Form implementation pending for {sectionTitle}</Text>;
    }
  };

  const renderArrayItems = () => {
    if (!arrayHook || !arrayHook.items) return null;

    return (
      <View style={{ marginTop: spacing.md }}>
        {arrayHook.items.map(item => (
           <PremiumCard key={item.id} style={styles.arrayItemCard} shadowLevel="small">
              <View style={styles.arrayItemContent}>
                 <Text style={[typography.h4, {color: theme.textPrimary}]}>{item.institution || item.company || item.name || item.title || 'Untitled'}</Text>
                 <Text style={[typography.body, {color: theme.textSecondary}]}>{item.degree || item.position || item.level || ''}</Text>
              </View>
              <View style={styles.arrayItemActions}>
                 <TouchableOpacity onPress={() => { setFormData(item); setEditingItemId(item.id); setIsEditingArray(true); }}>
                    <Icon name="pencil" size={20} color={theme.primary} />
                 </TouchableOpacity>
                 <TouchableOpacity style={{marginLeft: spacing.md}} onPress={() => arrayHook.deleteItem(item.id)}>
                    <Icon name="delete" size={20} color={theme.danger} />
                 </TouchableOpacity>
              </View>
           </PremiumCard>
        ))}
        {!isEditingArray && (
           <PremiumButton
              title="Add New"
              variant="outline"
              leftIcon="plus"
              onPress={() => { setFormData({}); setEditingItemId(null); setIsEditingArray(true); }}
              style={{marginTop: spacing.md}}
           />
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title={sectionTitle} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>

        {/* If it's a singleton section like Personal Info, just show the form */}
        {(!arrayHook || isEditingArray) && (
          <View style={styles.formContainer}>
             {renderFormFields()}

             {isSaving && <Text style={{color: theme.primary, alignSelf: 'flex-end', marginTop: spacing.xs}}>Saving...</Text>}

             {/* For array items being edited, show explicit save/cancel buttons */}
             {arrayHook && isEditingArray && (
                <View style={styles.row}>
                   <PremiumButton title="Cancel" variant="outline" onPress={() => setIsEditingArray(false)} style={{flex: 1, marginRight: 8}} />
                   <PremiumButton title="Save" onPress={() => handleSave()} style={{flex: 1, marginLeft: 8}} loading={isSaving} />
                </View>
             )}
          </View>
        )}

        {/* List of items if it's an array section (Education, Exp, etc) */}
        {arrayHook && !isEditingArray && renderArrayItems()}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  formContainer: {
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  arrayItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  arrayItemContent: {
    flex: 1,
  },
  arrayItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default SectionEditorScreen;
