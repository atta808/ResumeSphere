import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  PremiumHeader,
  EmptyState,
  PremiumButton,
  PremiumCard,
  Icon,
  SearchBar,
  PremiumChip,
  PremiumInput,
  PremiumModal
} from '../../components/common';
import { useTheme } from '../../theme';
import { ROUTES } from '../../navigation/routes';
import { useResumes } from '../../hooks/useResumes';
import { spacing, typography, radius } from '../../theme';
import { formatDate } from '../../utils/helpers';

const ResumeDashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { resumes, loading, loadResumes, searchResumes, createResume, duplicateResume, archiveResume, deleteResume, updateResume } = useResumes();

  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Rename Modal State
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [resumeToRename, setResumeToRename] = useState(null);
  const [newResumeName, setNewResumeName] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (searchQuery) {
        searchResumes(searchQuery);
      } else {
        loadResumes(showArchived);
      }
    }, [showArchived, loadResumes, searchResumes, searchQuery])
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      searchResumes(text);
    } else {
      loadResumes(showArchived);
    }
  };

  const handleCreateNew = async () => {
    try {
      const newResume = await createResume({ resumeName: 'New Resume' });
      navigation.navigate(ROUTES.RESUME_EDITOR, { resumeId: newResume.id });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to create resume.');
    }
  };

  const handleEdit = (id) => {
    navigation.navigate(ROUTES.RESUME_EDITOR, { resumeId: id });
  };

  const handleDuplicate = async (id, currentName) => {
    try {
      await duplicateResume(id, `${currentName} (Copy)`);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to duplicate resume.');
    }
  };

  const handleArchiveToggle = async (id, currentlyArchived) => {
    try {
      await archiveResume(id, !currentlyArchived);
    } catch(e) {
      Alert.alert('Error', 'Failed to update resume status.');
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Resume",
      "Are you sure you want to delete this resume? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
          try {
             await deleteResume(id);
          } catch(e) {
             Alert.alert('Error', 'Failed to delete resume.');
          }
        }}
      ]
    );
  };

  const openRenameModal = (resume) => {
      setResumeToRename(resume);
      setNewResumeName(resume.resumeName);
      setRenameModalVisible(true);
  };

  const handleRename = async () => {
      if (!newResumeName.trim() || !resumeToRename) return;
      try {
          await updateResume(resumeToRename.id, { resumeName: newResumeName.trim() });
          setRenameModalVisible(false);
          setResumeToRename(null);
          setNewResumeName('');
      } catch (e) {
          Alert.alert('Error', 'Failed to rename resume.');
      }
  };


  const renderResumeCard = ({ item }) => (
    <PremiumCard
      style={styles.card}
      onPress={() => handleEdit(item.id)}
      shadowLevel="small"
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={[typography.h3, { color: theme.textPrimary }]} numberOfLines={1}>
            {item.resumeName}
          </Text>
          <Text style={[typography.caption, { color: theme.textSecondary, marginTop: 4 }]}>
            Updated: {formatDate(item.updatedAt)}
          </Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => openRenameModal(item)} accessibilityLabel="Rename Resume">
           <Icon name="pencil-outline" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardActions}>
         <TouchableOpacity
            style={[styles.actionBtn, {backgroundColor: theme.surface}]}
            onPress={() => handleDuplicate(item.id, item.resumeName)}
         >
             <Icon name="content-copy" size={16} color={theme.primary} />
             <Text style={[typography.caption, { color: theme.primary, marginLeft: 4 }]}>Duplicate</Text>
         </TouchableOpacity>

         <TouchableOpacity
            style={[styles.actionBtn, {backgroundColor: theme.surface}]}
            onPress={() => handleArchiveToggle(item.id, item.isArchived === 1)}
         >
             <Icon name={item.isArchived === 1 ? "package-up" : "archive-outline"} size={16} color={theme.secondary} />
             <Text style={[typography.caption, { color: theme.secondary, marginLeft: 4 }]}>{item.isArchived === 1 ? 'Unarchive' : 'Archive'}</Text>
         </TouchableOpacity>

         <TouchableOpacity
            style={[styles.actionBtn, {backgroundColor: theme.surface}]}
            onPress={() => handleDelete(item.id)}
         >
             <Icon name="trash-can-outline" size={16} color={theme.danger} />
         </TouchableOpacity>

         <TouchableOpacity
            style={[styles.actionBtn, {backgroundColor: theme.primary + '15'}]}
            onPress={() => navigation.navigate(ROUTES.ATS_SCORE, { resumeId: item.id })}
         >
             <Icon name="chart-line" size={16} color={theme.primary} />
             <Text style={[typography.caption, { color: theme.primary, marginLeft: 4, fontWeight: 'bold' }]}>ATS</Text>
         </TouchableOpacity>

         <TouchableOpacity
            style={[styles.actionBtn, {backgroundColor: theme.success + '15'}]}
            onPress={() => navigation.navigate(ROUTES.JOB_DESCRIPTION_INPUT, { resumeId: item.id })}
         >
             <Icon name="briefcase-search-outline" size={16} color={theme.success} />
             <Text style={[typography.caption, { color: theme.success, marginLeft: 4, fontWeight: 'bold' }]}>Match Job</Text>
         </TouchableOpacity>
      </View>
    </PremiumCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="My Resumes" />

      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search resumes..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <View style={styles.filterContainer}>
           <PremiumChip
              label="Active"
              selected={!showArchived}
              onPress={() => setShowArchived(false)}
              style={styles.chip}
           />
           <PremiumChip
              label="Archived"
              selected={showArchived}
              onPress={() => setShowArchived(true)}
              style={styles.chip}
           />
        </View>
      </View>

      <FlatList
        data={resumes}
        keyExtractor={(item) => item.id}
        renderItem={renderResumeCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <EmptyState
              title={showArchived ? "No Archived Resumes" : "No Resumes Yet"}
              subtitle={searchQuery ? "Try a different search query." : "Create your first professional resume to get started."}
              icon="file-document-outline"
              actionButton={!showArchived && !searchQuery ? <PremiumButton title="Create Resume" onPress={handleCreateNew} /> : null}
            />
          )
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={handleCreateNew}
        accessibilityRole="button"
        accessibilityLabel="Create New Resume"
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <PremiumModal
         visible={renameModalVisible}
         onClose={() => setRenameModalVisible(false)}
         title="Rename Resume"
      >
         <PremiumInput
            label="Resume Name"
            value={newResumeName}
            onChangeText={setNewResumeName}
            placeholder="e.g. Software Engineer Resume"
         />
         <PremiumButton
            title="Save Name"
            onPress={handleRename}
            style={{marginTop: spacing.md}}
         />
      </PremiumModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterContainer: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  chip: {
    marginRight: spacing.sm,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100, // Space for FAB
    flexGrow: 1,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardTitleContainer: {
    flex: 1,
  },
  iconButton: {
    padding: spacing.xs,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.small,
    marginRight: spacing.sm,
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

export default ResumeDashboardScreen;
