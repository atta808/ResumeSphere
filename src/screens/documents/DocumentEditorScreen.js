import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumHeader, PremiumButton } from '../../components/common';
import { useTheme, spacing } from '../../theme';
import { DocumentService } from '../../services/documents';
import Logger from '../../utils/logger';

const DocumentEditorScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const documentId = route.params?.documentId;

  const [document, setDocument] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    const loadDoc = async () => {
      try {
        const doc = await DocumentService.getDocumentById(documentId);
        setDocument(doc);
        setContent(doc.content);
      } catch (error) {
        Logger.error(error);
        Alert.alert('Error', 'Could not load document for editing.');
      }
    };
    if (documentId) loadDoc();
  }, [documentId]);

  const handleSave = async () => {
    if (!document) return;
    try {
      await DocumentService.saveDocument({ ...document, content });
      navigation.goBack();
    } catch (error) {
      Logger.error(error);
      Alert.alert('Error', 'Failed to save edits.');
    }
  };

  if (!document) return <View style={[styles.container, { backgroundColor: theme.background }]} />;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader
        title="Edit Document"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={[styles.editor, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.surface }]}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
        <PremiumButton
          title="Save Changes"
          onPress={handleSave}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, flexGrow: 1 },
  editor: {
    flex: 1,
    minHeight: 400,
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    lineHeight: 24,
  },
});

export default DocumentEditorScreen;
