/**
 * Environment configuration setup.
 * Accesses Expo's EXPO_PUBLIC_* variables and provides defaults.
 */
const ENV = {
  // API Keys (Note: read from env, never hardcoded here)
  DEEPSEEK_API_KEY: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || '',
  GOOGLE_VISION_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY || '',

  // App Config
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
  API_TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000', 10),


  // Firebase Config
  FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',

  // Database Config
  DB_NAME: 'resumesphere.db',
};

export default ENV;
