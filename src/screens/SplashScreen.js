import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../utils/AppContext';
import { Colors, Typography, Spacing } from '../styles/DesignSystem';

export default function SplashScreen({ navigation }) {
  const { isAuthenticated, userType } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // User is logged in, redirect to appropriate panel
        if (userType === 'student') {
          navigation.replace('StudentPanel');
        } else if (userType === 'driver') {
          navigation.replace('DriverPanel');
        } else if (userType === 'admin') {
          navigation.replace('AdminPanel');
        } else {
          // Fallback to sign up if userType is not set
          navigation.replace('SignUp');
        }
      } else {
        // User is not logged in, go to sign up screen first
        navigation.replace('SignUp');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated, userType]);

  return (
    <LinearGradient
      colors={['#003B73', '#0074D9', '#00BFFF']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('../../assets/splash.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View 
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              })}],
            },
          ]}
        >
          <Text style={styles.appName}>UniNoah</Text>
          <Text style={styles.tagline}>Your Campus Ride Companion</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['2xl'],
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: Colors.textInverse,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: Typography.lg,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: Typography.medium,
  },
}); 