import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import Header from '../components/Header';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function StudentHomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Student Home" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.welcomeSection}>
        <Text style={styles.welcome}>Welcome to UniNoah</Text>
            <Text style={styles.subtitle}>Your campus ride companion</Text>
          </View>

          <View style={styles.statsContainer}>
            <Animated.View 
              style={[
                styles.statCard,
                {
                  opacity: fadeAnim,
                  transform: [{ 
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [0, 20],
                    })
                  }],
                },
              ]}
            >
              <Ionicons name="car-outline" size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Rides Taken</Text>
            </Animated.View>
            <Animated.View 
              style={[
                styles.statCard,
                {
                  opacity: fadeAnim,
                  transform: [{ 
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [0, 30],
                    })
                  }],
                },
              ]}
            >
              <Ionicons name="time-outline" size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Active Bookings</Text>
            </Animated.View>
            <Animated.View 
              style={[
                styles.statCard,
                {
                  opacity: fadeAnim,
                  transform: [{ 
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [0, 40],
                    })
                  }],
                },
              ]}
            >
              <Ionicons name="star-outline" size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </Animated.View>
          </View>

        <View style={styles.grid}>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ 
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 50],
                  })
                }],
              }}
            >
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('StudentSearchRides')}>
            <LinearGradient colors={Colors.gradients.primary} style={styles.cardGradient}>
                  <View style={styles.cardIconContainer}>
                    <Ionicons name="search-outline" size={32} color={Colors.textInverse} />
                  </View>
              <Text style={styles.cardTitle}>Search Rides</Text>
              <Text style={styles.cardText}>Find available rides to campus</Text>
            </LinearGradient>
          </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ 
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 60],
                  })
                }],
              }}
            >
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('StudentRideHistory')}>
            <LinearGradient colors={Colors.gradients.secondary} style={styles.cardGradient}>
                  <View style={styles.cardIconContainer}>
                    <Ionicons name="time-outline" size={32} color={Colors.textInverse} />
                  </View>
              <Text style={styles.cardTitle}>Ride History</Text>
              <Text style={styles.cardText}>View your past and current bookings</Text>
            </LinearGradient>
          </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ 
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 70],
                  })
                }],
              }}
            >
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('StudentRequests')}>
            <LinearGradient colors={Colors.gradients.accent} style={styles.cardGradient}>
                  <View style={styles.cardIconContainer}>
                    <Ionicons name="mail-outline" size={32} color={Colors.textInverse} />
                  </View>
              <Text style={styles.cardTitle}>My Requests</Text>
              <Text style={styles.cardText}>Track requests awaiting driver action</Text>
            </LinearGradient>
          </TouchableOpacity>
            </Animated.View>
        </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  scrollView: { 
    flex: 1 
  },
  content: { 
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  welcomeSection: {
    marginBottom: Spacing['2xl'],
    alignItems: 'center',
  },
  welcome: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(30, 58, 138, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 36,
  },
  subtitle: { 
    color: Colors.textSecondary, 
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing['2xl'],
    paddingHorizontal: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors.gray100,
    height: 100,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 8,
    lineHeight: 28,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
    lineHeight: 16,
  },
  grid: { 
    gap: Spacing.xl 
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    ...Shadows.xl,
    marginHorizontal: 8,
    height: 180,
  },
  cardGradient: { 
    padding: 32,
    alignItems: 'center',
    height: 180,
    justifyContent: 'center',
  },
  cardIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  cardTitle: {
    color: Colors.textInverse,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  cardText: { 
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },
});


