import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, EmptyState, PremiumButton, Icon } from '../../components/common';
import { useTheme, spacing, typography } from '../../theme';
import { ROUTES } from '../../navigation/routes';
import { DocumentService } from '../../services/documents';
import { useProfile } from '../../hooks/useProfile';
import Logger from '../../utils/logger';

const DocumentsHomeScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { profile } = useProfile();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const docs = await DocumentService.getDocumentsByProfile(profile.id);
      setDocuments(docs);
    } catch (error) {
      Logger.error(error);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchDocuments();
    }, [fetchDocuments])
  );

  const renderItem = ({ item }) => (
    <PremiumCard
      style={styles.card}
      onPress={() => navigation.navigate(ROUTES.DOCUMENT_PREVIEW, { documentId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={[typography.h3, { color: theme.textPrimary }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[typography.caption, { color: theme.textSecondary, marginTop: 4 }]}>
          {item.documentType.replace(/_/g, ' ')}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <Text style={[typography.caption, { color: theme.textSecondary }]}>
          Updated: {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
        <Icon name="chevron-forward" size={16} color={theme.border} />
      </View>
    </PremiumCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader
        title="Professional Documents"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={documents}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <EmptyState
              title="No Documents Yet"
              subtitle="Generate cover letters, emails, and more using AI."
              icon="document-text-outline"
              actionButton={
                <PremiumButton
                  title="Create Document"
                  onPress={() => navigation.navigate(ROUTES.DOCUMENT_GENERATOR)}
                />
              }
            />
          )
        }
      />

      {documents.length > 0 && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate(ROUTES.DOCUMENT_GENERATOR)}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: spacing.md, paddingBottom: 100 },
  card: { marginBottom: spacing.md },
  cardHeader: { marginBottom: spacing.md },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: spacing.sm,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default DocumentsHomeScreen;
