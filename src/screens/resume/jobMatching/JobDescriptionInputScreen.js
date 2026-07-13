import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme, spacing, typography } from '../../../theme';
import { ROUTES } from '../../../navigation/routes';
import { PremiumHeader, PremiumButton, PremiumInput, PremiumCard, Icon } from '../../../components/common';
import { useJobDescriptions } from '../../../hooks/useJobDescriptions';
import OCRService from '../../../services/ocr/OCRService';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const JobDescriptionInputScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { resumeId } = route.params;

  const { importJobDescription, loading } = useJobDescriptions();

  const [pastedText, setPastedText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [processingOCR, setProcessingOCR] = useState(false);

  const handleMatch = async () => {
    if (!pastedText.trim()) {
      Alert.alert('Error', 'Please paste the job description text.');
      return;
    }

    try {
      const metadata = {
        jobTitle: jobTitle.trim() || 'Unknown Title',
        companyName: companyName.trim() || 'Unknown Company',
      };
      const newJob = await importJobDescription(pastedText, metadata);

      // Navigate to match analysis
      navigation.navigate(ROUTES.JOB_MATCH_ANALYSIS, {
        resumeId,
        jobDescriptionId: newJob.id,
      });
    } catch (e) {
       Alert.alert('Error', 'Failed to process the job description.');
    }
  };

  const handleImportImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProcessingOCR(true);
        const { uri } = result.assets[0];

        // Very basic mock of OCR for job description:
        // Ideally we pass this to OCRService which would extract raw text.
        // For phase 10 MVP, assuming OCRService has a method to get raw text:
        const extractedText = await OCRService.extractRawText(uri);
        setPastedText(extractedText);
      }
    } catch (e) {
      Alert.alert('Import Failed', e.message);
    } finally {
      setProcessingOCR(false);
    }
  };

  const handleImportPDF = async () => {
     try {
        const result = await DocumentPicker.getDocumentAsync({
          type: ['application/pdf'],
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
           setProcessingOCR(true);
           const { uri } = result.assets[0];
           const extractedText = await OCRService.extractRawText(uri);
           setPastedText(extractedText);
        }
     } catch (e) {
        Alert.alert('Import Failed', e.message);
     } finally {
        setProcessingOCR(false);
     }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Job Match Setup" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
           <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.sm }]}>
              Target Job Information
           </Text>
           <Text style={[typography.body, { color: theme.textSecondary, marginBottom: spacing.lg }]}>
              Paste the job description below or import it from a file. We'll compare it against your resume.
           </Text>

           <PremiumInput
              label="Company Name (Optional)"
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="e.g. Acme Corp"
           />

           <PremiumInput
              label="Job Title (Optional)"
              value={jobTitle}
              onChangeText={setJobTitle}
              placeholder="e.g. Senior Software Engineer"
           />

           <View style={styles.importActions}>
              <PremiumButton
                 title="Import PDF"
                 icon="file-pdf-box"
                 variant="outline"
                 style={styles.importBtn}
                 onPress={handleImportPDF}
                 disabled={loading || processingOCR}
              />
              <PremiumButton
                 title="Import Image"
                 icon="image"
                 variant="outline"
                 style={styles.importBtn}
                 onPress={handleImportImage}
                 disabled={loading || processingOCR}
              />
           </View>

           <PremiumInput
              label="Job Description"
              value={pastedText}
              onChangeText={setPastedText}
              placeholder="Paste the full job description here..."
              multiline
              numberOfLines={10}
              style={styles.textArea}
           />

           <PremiumButton
              title={loading || processingOCR ? "Processing..." : "Analyze Match"}
              onPress={handleMatch}
              disabled={loading || processingOCR || !pastedText.trim()}
              style={styles.analyzeBtn}
              icon="chart-line"
           />

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  importActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  importBtn: {
    flex: 0.48,
  },
  textArea: {
    height: 250,
    textAlignVertical: 'top',
  },
  analyzeBtn: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  }
});

export default JobDescriptionInputScreen;
