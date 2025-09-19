import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/utils/AppContext';

export default function App() {
  return (
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor="#003B73" />
      <AppNavigator />
    </AppProvider>
  );
}
