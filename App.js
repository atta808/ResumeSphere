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

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    async function initializeApp() {
      try {
        await dbManager.init();
      } catch (e) {
        console.error("Database initialization failed", e);
      } finally {
        setDbInitialized(true);
      }
    }
    initializeApp();
  }, []);

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
