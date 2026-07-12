import { palettes } from './palettes';

export const lightTheme = {
  primary: palettes.blue[600],
  secondary: palettes.purple[700], // Changed from 900 to 700 to match #7C3AED
  accent: palettes.cyan[500],
  success: palettes.green[500],
  warning: palettes.yellow[500],
  danger: palettes.red[500],
  info: palettes.blue[500],
  background: '#F8FAFC', // Background (Light)
  surface: '#FFFFFF', // Surface
  card: '#FFFFFF', // Card
  border: palettes.gray[200],
  divider: palettes.gray[200],
  textPrimary: '#111827', // Text Primary
  textSecondary: '#6B7280', // Text Secondary
  disabled: palettes.gray[300],
  placeholder: palettes.gray[400],
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const darkTheme = {
  primary: palettes.blue[700], // Primary Dark
  secondary: palettes.purple[700], // Changed from 900 to 700 to match #7C3AED
  accent: palettes.cyan[500],
  success: palettes.green[500],
  warning: palettes.yellow[500],
  danger: palettes.red[500],
  info: palettes.blue[500],
  background: '#0F172A', // Background (Dark)
  surface: '#1E293B', // Surface (Dark)
  card: '#1E293B', // Card (Dark)
  border: '#334155',
  divider: '#334155',
  textPrimary: '#F8FAFC', // Dark Text
  textSecondary: '#94A3B8',
  disabled: '#475569',
  placeholder: '#64748B',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',
};
