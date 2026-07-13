import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { ThemeProvider } from './src/theme';
import { ToastProvider } from './src/components/common';
import { RootNavigator } from './src/navigation';
import AppErrorBoundary from './src/components/common/AppErrorBoundary';
import dbManager from './src/database/sqlite';
import SyncScheduler from './src/services/cloud/SyncScheduler';
import AuthService from './src/services/auth/AuthService';

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    async function initializeApp() {
      try {
        await dbManager.init();
        await AuthService.initialize(); // Initialize Auth before rendering
      } catch (e) {
        console.error("Initialization failed", e);
      } finally {
        setDbInitialized(true);
      }
    }
    initializeApp();
  }, []);

  useEffect(() => {
    if (dbInitialized) {
      SyncScheduler.start();
    }
    return () => {
      SyncScheduler.stop();
    };
  }, [dbInitialized]);

  if (!dbInitialized) {
    return null; // Or a splash screen / loading component
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppErrorBoundary>
              <RootNavigator />
            </AppErrorBoundary>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
