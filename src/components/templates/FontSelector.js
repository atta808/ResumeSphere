import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useTheme, spacing, typography } from '../../theme';

const FONTS = ['Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Garamond', 'Roboto', 'Poppins'];

const FontSelector = ({ selectedFont, onSelectFont }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[typography.subtitle2, { color: theme.text, marginBottom: spacing.s }]}>Font Family</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {FONTS.map(font => (
          <TouchableOpacity
            key={font}
            style={[
              styles.fontBtn,
              { borderColor: theme.border, backgroundColor: theme.surface },
              selectedFont === font && { borderColor: theme.primary, backgroundColor: theme.primary + '20' }
            ]}
            onPress={() => onSelectFont(font)}
          >
            <Text style={{ color: theme.text }}>{font}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.s,
  },
  fontBtn: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: spacing.m,
  }
});

export default FontSelector;
