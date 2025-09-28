import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, StatusBar } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../utils/AppContext';

const { width, height } = Dimensions.get('window');

export default function StudentHomeScreen({ navigation }) {
  const { user } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  
  // Calculate user stats
  const getUserStats = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = currentDate.getDate();
    
    // Mock data - in real app this would come from API
    const totalRides = 28; // Total rides completed
    const rating = 4.9; // User rating
    const activeDays = Math.floor(currentDay * 0.7); // Active days this month
    
    return { totalRides, rating, activeDays, daysInMonth };
  };
  
  const stats = getUserStats();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003B73" />
      
      {/* Header Section */}
      <LinearGradient
        colors={['#003B73', '#0074D9', '#00BFFF']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{firstName}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('StudentSettings')}
            >
              <View style={styles.profileIcon}>
                <Ionicons name="settings" size={24} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Enhanced Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatNumber}>{stats.totalRides}</Text>
              <Text style={styles.miniStatLabel}>Total Rides</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatNumber}>{stats.rating}★</Text>
              <Text style={styles.miniStatLabel}>Rating</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatNumber}>{stats.activeDays}/{stats.daysInMonth}</Text>
              <Text style={styles.miniStatLabel}>Active Days</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim },
                { scale: scaleAnim }
              ],
            },
          ]}
        >
          {/* Main Action Cards */}
          <View style={styles.mainCards}>
            <TouchableOpacity 
              style={styles.primaryCard}
              onPress={() => navigation.navigate('StudentSearchRides')}
              activeOpacity={0.95}
            >
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.primaryCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.primaryCardContent}>
                  <View style={styles.primaryCardLeft}>
                    <Ionicons name="search-circle" size={48} color="#FFFFFF" />
                    <View style={styles.primaryCardText}>
                      <Text style={styles.primaryCardTitle}>Find Rides</Text>
                      <Text style={styles.primaryCardSubtitle}>Search available rides near you</Text>
                    </View>
                  </View>
                  <Ionicons name="arrow-forward-circle" size={32} color="rgba(255,255,255,0.8)" />
          </View>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.secondaryCards}>
              <TouchableOpacity 
                style={styles.secondaryCard}
                onPress={() => navigation.navigate('StudentRideHistory')}
                activeOpacity={0.95}
              >
                <View style={styles.secondaryCardContent}>
                  <View style={styles.secondaryIconContainer}>
                    <Ionicons name="time-outline" size={28} color={Colors.primary} />
                  </View>
                  <Text style={styles.secondaryCardTitle}>History</Text>
                  <Text style={styles.secondaryCardSubtitle}>View past rides</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryCard}
                onPress={() => navigation.navigate('StudentRequests')}
                activeOpacity={0.95}
              >
                <View style={styles.secondaryCardContent}>
                  <View style={styles.secondaryIconContainer}>
                    <Ionicons name="mail-outline" size={28} color={Colors.primary} />
                  </View>
                  <Text style={styles.secondaryCardTitle}>Requests</Text>
                  <Text style={styles.secondaryCardSubtitle}>Manage requests</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>


          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            
            {/* Primary Quick Actions */}
            <View style={styles.primaryQuickActions}>
              <TouchableOpacity style={styles.primaryQuickAction}>
                <LinearGradient
                  colors={[Colors.primaryLight, Colors.primary]}
                  style={styles.primaryQuickActionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="location" size={24} color="#FFFFFF" />
                  <Text style={styles.primaryQuickActionText}>Live Tracking</Text>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
            </LinearGradient>
          </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryQuickAction}
                onPress={() => navigation.navigate('StudentSupport')}
              >
                <LinearGradient
                  colors={[Colors.accent, Colors.accentDark]}
                  style={styles.primaryQuickActionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="headset" size={24} color="#FFFFFF" />
                  <Text style={styles.primaryQuickActionText}>Get Support</Text>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
            </LinearGradient>
          </TouchableOpacity>
            </View>

            {/* Secondary Quick Actions */}
            <View style={styles.secondaryQuickActions}>
              <TouchableOpacity 
                style={styles.secondaryQuickAction}
                onPress={() => navigation.navigate('StudentRideHistory')}
              >
                <View style={styles.secondaryQuickActionContent}>
                  <View style={styles.secondaryQuickActionIcon}>
                    <Ionicons name="star" size={22} color={Colors.accent} />
                  </View>
                  <View style={styles.secondaryQuickActionText}>
                    <Text style={styles.secondaryQuickActionTitle}>Rate Experience</Text>
                    <Text style={styles.secondaryQuickActionSubtitle}>Share your feedback</Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryQuickAction}>
                <View style={styles.secondaryQuickActionContent}>
                  <View style={styles.secondaryQuickActionIcon}>
                    <Ionicons name="settings" size={22} color={Colors.primary} />
                  </View>
                  <View style={styles.secondaryQuickActionText}>
                    <Text style={styles.secondaryQuickActionTitle}>Preferences</Text>
                    <Text style={styles.secondaryQuickActionSubtitle}>Customize app</Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryQuickAction}>
                <View style={styles.secondaryQuickActionContent}>
                  <View style={styles.secondaryQuickActionIcon}>
                    <Ionicons name="shield-checkmark" size={22} color={Colors.success} />
                  </View>
                  <View style={styles.secondaryQuickActionText}>
                    <Text style={styles.secondaryQuickActionTitle}>Safety</Text>
                    <Text style={styles.secondaryQuickActionSubtitle}>Emergency contacts</Text>
                  </View>
                  </View>
          </TouchableOpacity>
            </View>
        </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background,
  },
  
  // Header Styles
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  profileButton: {
    
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  
  // Mini Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  miniStat: {
    alignItems: 'center',
  },
  miniStatNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  miniStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },

  // Content Styles
  scrollView: { 
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  content: { 
    padding: 20,
    marginTop: -12,
  },

  // Main Cards
  mainCards: {
    marginBottom: 24,
  },
  primaryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    ...Shadows.xl,
  },
  primaryCardGradient: {
    padding: 24,
  },
  primaryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  primaryCardText: {
    marginLeft: 16,
    flex: 1,
  },
  primaryCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  primaryCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },

  // Secondary Cards
  secondaryCards: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: `${Colors.primary}15`,
  },
  secondaryCardContent: {
    alignItems: 'center',
  },
  secondaryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  secondaryCardSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Section Styles
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 16,
  },


  // Quick Actions
  primaryQuickActions: {
    marginBottom: 16,
    gap: 12,
  },
  primaryQuickAction: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  primaryQuickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingVertical: 18,
  },
  primaryQuickActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 16,
  },

  secondaryQuickActions: {
    gap: 12,
  },
  secondaryQuickAction: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: `${Colors.primary}10`,
  },
  secondaryQuickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryQuickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  secondaryQuickActionText: {
    flex: 1,
  },
  secondaryQuickActionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  secondaryQuickActionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});


