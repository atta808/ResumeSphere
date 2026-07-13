import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useTheme, spacing, typography } from '../../theme';
import TemplateRegistry from '../../services/templates/TemplateRegistry';

const TemplatePicker = ({ selectedId, onSelect }) => {
  const { theme } = useTheme();
  const templates = TemplateRegistry.getAllTemplates();

  return (
    <View style={styles.container}>
      <Text style={[typography.subtitle2, { color: theme.text, marginBottom: spacing.s }]}>Select Template</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {templates.map(tmpl => (
          <TouchableOpacity
            key={tmpl.id}
            style={[
              styles.card,
              { backgroundColor: theme.surface, borderColor: theme.border },
              selectedId === tmpl.id && { borderColor: theme.primary, borderWidth: 2 }
            ]}
            onPress={() => onSelect(tmpl.id)}
          >
            <View style={styles.thumbnailPlaceholder}>
              <Text style={{ color: theme.textSecondary }}>{tmpl.name[0]}</Text>
            </View>
            <Text style={[typography.caption, { color: theme.text, marginTop: spacing.xs, textAlign: 'center' }]}>
              {tmpl.name}
            </Text>
            {tmpl.ATSFriendly && <Text style={{ fontSize: 10, color: 'green', textAlign: 'center' }}>ATS</Text>}
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
  card: {
    width: 100,
    padding: spacing.s,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: spacing.m,
    alignItems: 'center',
  },
  thumbnailPlaceholder: {
    width: 60,
    height: 80,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default TemplatePicker;
