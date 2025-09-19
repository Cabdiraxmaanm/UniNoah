import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen({ navigation }) {
  return (
    <LinearGradient
      colors={Colors.gradients.ocean}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/splash.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Join UniNoah</Text>
          <Text style={styles.subtitle}>Choose your role to get started</Text>
        </View>

        {/* Cards Section */}
        <View style={styles.cardsSection}>
          <TouchableOpacity
            style={[styles.card, styles.studentCard]}
            activeOpacity={0.9}
            onPress={() => {
              navigation.navigate('StudentAuth');
            }}
          >
            <LinearGradient
              colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="school-outline" size={28} color={Colors.textInverse} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Student</Text>
                  <Text style={styles.cardSubtitle}>Book rides to campus</Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textInverse} />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.driverCard]}
            activeOpacity={0.9}
            onPress={() => {
              navigation.navigate('DriverAuth');
            }}
          >
            <LinearGradient
              colors={['#10B981', '#34D399', '#6EE7B7']}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="car-outline" size={28} color={Colors.textInverse} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Driver</Text>
                  <Text style={styles.cardSubtitle}>Offer rides to students</Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textInverse} />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Features Section removed as requested */}

        {/* Footer removed as requested */}
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
    paddingHorizontal: Spacing.lg,
    paddingTop: 80,
    paddingBottom: Spacing.lg,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
  },
  logoContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    padding: 15,
    marginBottom: 24,
    ...Shadows.md,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  title: {
    fontSize: 32,
    color: Colors.textInverse,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
    lineHeight: 36,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  cardsSection: {
    marginBottom: 32,
    marginTop: 20,
  },
  card: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.lg,
  },
  studentCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  driverCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  cardGradient: {
    padding: 0,
  },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      height: 80,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 20,
      ...Shadows.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
  icon: {
    fontSize: 28,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: Colors.textInverse,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    lineHeight: 24,
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 18,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    color: Colors.textInverse,
    fontSize: 20,
    fontWeight: Typography.bold,
  },
  featuresSection: {
    marginBottom: Spacing['2xl'],
  },
  featuresTitle: {
    fontSize: Typography.xl,
    color: Colors.textInverse,
    fontWeight: Typography.semibold,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  featureText: {
    color: Colors.textInverse,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.base,
    marginRight: Spacing.xs,
  },
  loginLink: {
    color: Colors.textInverse,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    textDecorationLine: 'underline',
  },
}); 