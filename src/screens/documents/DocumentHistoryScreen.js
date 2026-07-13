import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumHeader, PremiumCard } from '../../components/common';
import { useTheme, spacing, typography } from '../../theme';
import { DocumentHistoryService } from '../../services/documents';

const DocumentHistoryScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const documentId = route.params?.documentId;

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!documentId) return;
      try {
        const records = await DocumentHistoryService.getHistory(documentId);
        setHistory(records);
      } catch (error) {
        console.error(error);
      }
    };
    loadHistory();
  }, [documentId]);

  const renderItem = ({ item }) => (
    <PremiumCard style={styles.card}>
      <Text style={[typography.h3, { color: theme.textPrimary }]}>Version {item.version}</Text>
      <Text style={[typography.body, { color: theme.textSecondary, marginVertical: 4 }]}>
        Action: {item.action}
      </Text>
      <Text style={[typography.caption, { color: theme.textSecondary }]}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
      {item.provider && (
        <Text style={[typography.caption, { color: theme.primary, marginTop: 4 }]}>
          AI: {item.provider} ({item.model})
        </Text>
      )}
    </PremiumCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Document History" showBackButton onBackPress={() => navigation.goBack()} />
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.md },
  card: { marginBottom: spacing.md },
});

export default DocumentHistoryScreen;
