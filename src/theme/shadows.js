import { Platform } from 'react-native';

export const shadows = {
  small: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
    },
    android: {
      elevation: 1,
    },
    default: {
      boxShadow: '0px 1px 1.0px rgba(0, 0, 0, 0.18)',
    }
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 3,
    },
    default: {
      boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    }
  }),
  large: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
    },
    android: {
      elevation: 6,
    },
    default: {
      boxShadow: '0px 4px 4.65px rgba(0, 0, 0, 0.30)',
    }
  }),
  xl: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
    },
    android: {
      elevation: 12,
    },
    default: {
      boxShadow: '0px 6px 7.49px rgba(0, 0, 0, 0.37)',
    }
  }),
};
