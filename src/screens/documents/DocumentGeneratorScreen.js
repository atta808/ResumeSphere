import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PremiumHeader, PremiumInput, PremiumButton, LoadingOverlay } from '../../components/common';
import { useTheme, spacing, typography } from '../../theme';
import { ROUTES } from '../../navigation/routes';
import { DocumentEngine } from '../../services/documents';
import { useProfile } from '../../hooks/useProfile';
import { DOCUMENT_TYPES } from '../../config/documents';
import Logger from '../../utils/logger';

const DocumentGeneratorScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { profile } = useProfile();

  const [docType, setDocType] = useState(DOCUMENT_TYPES.COVER_LETTER);
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!profile?.id) return;
    setIsGenerating(true);

    try {
      const doc = await DocumentEngine.generateDocument({
        profileId: profile.id,
        resumeId: null, // Should ideally let user select one
        documentType: docType,
        title: title || `${docType.replace(/_/g, ' ')}`,
        userInstructions: instructions
      });

      navigation.replace(ROUTES.DOCUMENT_PREVIEW, { documentId: doc.id });
    } catch (error) {
      Logger.error(error);
      Alert.alert('Error', 'Failed to generate document');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Generate Document" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.md }]}>Document Details</Text>

        <PremiumInput
          label="Document Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Google Cover Letter"
        />

        <PremiumInput
          label="Document Type (e.g. COVER_LETTER, FOLLOW_UP)"
          value={docType}
          onChangeText={setDocType}
          placeholder="Enter exact DOCUMENT_TYPE constant for now"
        />

        <PremiumInput
          label="Custom Instructions (Optional)"
          value={instructions}
          onChangeText={setInstructions}
          placeholder="e.g., Make it confident and mention my leadership skills."
          multiline
          numberOfLines={4}
        />

        <PremiumButton
          title="Generate with AI"
          onPress={handleGenerate}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
      <LoadingOverlay visible={isGenerating} message="Generating Document..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
});

export default DocumentGeneratorScreen;
