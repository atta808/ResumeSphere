import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';

import DocumentsHomeScreen from '../screens/documents/DocumentsHomeScreen';
import DocumentGeneratorScreen from '../screens/documents/DocumentGeneratorScreen';
import DocumentPreviewScreen from '../screens/documents/DocumentPreviewScreen';
import DocumentEditorScreen from '../screens/documents/DocumentEditorScreen';
import DocumentHistoryScreen from '../screens/documents/DocumentHistoryScreen';

const Stack = createNativeStackNavigator();

const DocumentNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.DOCUMENTS_HOME} component={DocumentsHomeScreen} />
      <Stack.Screen name={ROUTES.DOCUMENT_GENERATOR} component={DocumentGeneratorScreen} />
      <Stack.Screen name={ROUTES.DOCUMENT_PREVIEW} component={DocumentPreviewScreen} />
      <Stack.Screen name={ROUTES.DOCUMENT_EDITOR} component={DocumentEditorScreen} />
      <Stack.Screen name={ROUTES.DOCUMENT_HISTORY} component={DocumentHistoryScreen} />
    </Stack.Navigator>
  );
};

export default DocumentNavigator;
