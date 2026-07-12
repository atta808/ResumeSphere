import React from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import PremiumModal from './PremiumModal';
import { useTheme } from '../../theme';
import Icon from './Icon';
import EmptyState from './EmptyState';

const ResumePickerModal = ({ visible, onClose, resumes, onSelect }) => {
  const { theme } = useTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.resumeItem, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.resumeInfo}>
        <Icon name="document-text-outline" size={24} color={theme.primary} />
        <View style={styles.textContainer}>
          <Text style={[styles.resumeName, { color: theme.text }]}>{item.resumeName || 'Untitled Resume'}</Text>
          <Text style={[styles.targetJob, { color: theme.textSecondary }]}>
            {item.targetJobTitle || 'No target role specified'}
          </Text>
        </View>
      </View>
      <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <PremiumModal visible={visible} onClose={onClose} title="Select a Resume">
      {resumes && resumes.length > 0 ? (
        <FlatList
          data={resumes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title="No Resumes Found"
          subtitle="You need to create a resume first to use AI features tailored to a specific job."
          icon="document-text-outline"
        />
      )}
    </PremiumModal>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },
  resumeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  resumeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  resumeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  targetJob: {
    fontSize: 14,
  }
});

export default ResumePickerModal;
