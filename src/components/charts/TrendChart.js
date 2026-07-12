import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme, typography, spacing } from '../../theme';

// A simple sparkline/bar chart using standard View components for the trend
const TrendChart = ({ data = [], height = 60 }) => {
  const { theme } = useTheme();

  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height, backgroundColor: theme.surface }]}>
         <Text style={[typography.caption, { color: theme.textSecondary }]}>No history available</Text>
      </View>
    );
  }

  // Reverse data if it's newest first, to show oldest left to newest right
  const chartData = [...data].reverse();

  const getScoreColor = (val) => {
    if (val >= 90) return theme.success;
    if (val >= 75) return theme.info;
    if (val >= 60) return theme.warning;
    return theme.danger;
  };

  return (
    <View style={[styles.container, { height }]}>
      {chartData.map((item, index) => {
         const score = item.overallScore || 0;
         const barHeight = Math.max(10, (score / 100) * height);
         return (
             <View key={item.id || index} style={styles.barContainer}>
                 <View style={styles.barWrapper}>
                    <View
                        style={[
                            styles.bar,
                            {
                                height: barHeight,
                                backgroundColor: getScoreColor(score),
                                opacity: index === chartData.length - 1 ? 1 : 0.6 // highlight latest
                            }
                        ]}
                    />
                 </View>
                 {/* Only show label for the last one or occasionally if needed, here just keeping it clean */}
                 {index === chartData.length - 1 && (
                     <Text style={[typography.caption, { color: theme.textSecondary, fontSize: 10, marginTop: 4 }]}>
                         Latest
                     </Text>
                 )}
             </View>
         );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
  },
  bar: {
    width: '60%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  }
});

export default TrendChart;
