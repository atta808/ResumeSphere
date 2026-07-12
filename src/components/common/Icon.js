import React, { memo } from 'react';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';

// Simple wrapper to swap icon libraries centrally later
const Icon = ({ family = 'MaterialCommunityIcons', name, size, color, style }) => {
  switch (family) {
    case 'Ionicons':
      return <Ionicons name={name} size={size} color={color} style={style} />;
    case 'Feather':
      return <Feather name={name} size={size} color={color} style={style} />;
    case 'MaterialCommunityIcons':
    default:
      return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />;
  }
};

export default memo(Icon);
