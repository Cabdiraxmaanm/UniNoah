import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';

export default function LoadingSpinner({ message = 'Loading...', size = 'large', color = Colors.primary }) {
  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={size} color={color} />
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: Spacing['2xl'],
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BorderRadius['2xl'],
    ...Shadows.lg,
  },
  spinnerContainer: {
    marginBottom: Spacing.lg,
  },
  message: {
    fontSize: Typography.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.normal,
  },
}); 