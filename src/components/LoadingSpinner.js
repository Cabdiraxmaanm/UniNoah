import React, { useRef, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

export default function LoadingSpinner({ message = 'Loading...', size = 'large', color = Colors.primary }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Pulse animation for the container
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient
      colors={[Colors.gradients.primary[0] + '15', Colors.gradients.primary[1] + '10', 'rgba(255,255,255,0.98)']}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={Colors.gradients.primary}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="car" size={32} color="#FFFFFF" />
          </LinearGradient>
        </View>
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={size} color={color} />
        </View>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.subMessage}>Please wait while we prepare your experience</Text>
      </Animated.View>
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
    padding: Spacing['3xl'],
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: BorderRadius['3xl'],
    ...Shadows.xl,
    minWidth: 200,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
    borderRadius: 35,
    overflow: 'hidden',
    ...Shadows.md,
  },
  iconGradient: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerContainer: {
    marginBottom: Spacing.lg,
  },
  message: {
    fontSize: Typography.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.normal,
    marginBottom: Spacing.sm,
  },
  subMessage: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.tight,
  },
}); 