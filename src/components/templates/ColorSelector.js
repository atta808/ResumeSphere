import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useTheme, spacing, typography } from '../../theme';

const COLORS = ['#000000', '#2C3E50', '#0056B3', '#E74C3C', '#27AE60', '#8E44AD', '#F39C12'];

const ColorSelector = ({ label, selectedColor, onSelectColor }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[typography.subtitle2, { color: theme.text, marginBottom: spacing.s }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {COLORS.map(color => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              selectedColor === color && styles.selected
            ]}
            onPress={() => onSelectColor(color)}
            accessibilityLabel={`Select color ${color}`}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.s,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.m,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selected: {
    borderWidth: 3,
    borderColor: '#007BFF',
  }
});

export default ColorSelector;
