import React, { memo } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icon';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, radius, typography } from '../../theme';

const SearchBar = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search...',
  style,
  inputStyle,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }, style]}>
      <Icon name="magnify" size={20} color={theme.textSecondary} style={styles.searchIcon} />

      <TextInput
        style={[
          styles.input,
          typography.body,
          { color: theme.textPrimary },
          inputStyle
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        returnKeyType="search"
      />

      {value ? (
        <TouchableOpacity onPress={onClear} style={styles.clearButton} accessibilityLabel="Clear search">
          <Icon name="close-circle" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.round,
    paddingHorizontal: spacing.md,
    height: 40,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    height: '100%',
  },
  clearButton: {
    marginLeft: spacing.sm,
  },
});

export default memo(SearchBar);
