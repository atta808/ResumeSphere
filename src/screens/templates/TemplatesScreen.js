import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { PremiumHeader, SkeletonLoader } from '../../components/common';
import { useTheme } from '../../theme';

const TemplatesScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Templates" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          <View style={styles.gridItem}><SkeletonLoader type="card" /></View>
          <View style={styles.gridItem}><SkeletonLoader type="card" /></View>
          <View style={styles.gridItem}><SkeletonLoader type="card" /></View>
          <View style={styles.gridItem}><SkeletonLoader type="card" /></View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
});

export default TemplatesScreen;
