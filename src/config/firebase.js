import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENV from './env';

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY || 'MISSING_API_KEY',
  authDomain: ENV.FIREBASE_AUTH_DOMAIN || 'MISSING_DOMAIN',
  projectId: ENV.FIREBASE_PROJECT_ID || 'MISSING_PROJECT_ID',
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET || 'MISSING_BUCKET',
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID || 'MISSING_SENDER_ID',
  appId: ENV.FIREBASE_APP_ID || 'MISSING_APP_ID'
};

let app;
let auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

export { auth };
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export default app;
