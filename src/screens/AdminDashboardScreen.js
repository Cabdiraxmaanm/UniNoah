import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeDrivers: 89,
    totalRides: 3456,
    todayRides: 127,
    revenue: 45678,
    rating: 4.8,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const StatCard = ({ title, value, icon, color, subtitle, onPress }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[color, `${color}CC`]}
        style={styles.statCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.statCardContent}>
          <View style={styles.statIconContainer}>
            <Ionicons name={icon} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.statTextContainer}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
            {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ title, icon, color, onPress, description }) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.actionCardContent}>
        <View style={[styles.actionIconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon} size={28} color="#FFFFFF" />
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#34D399']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome back, Admin</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={40} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
        }
      >
        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              icon="people"
              color="#10B981"
              subtitle="+12% this month"
              onPress={() => navigation.navigate('AdminUsers')}
            />
            <StatCard
              title="Active Drivers"
              value={stats.activeDrivers}
              icon="car"
              color="#3B82F6"
              subtitle="89 online now"
              onPress={() => navigation.navigate('AdminDrivers')}
            />
            <StatCard
              title="Total Rides"
              value={stats.totalRides.toLocaleString()}
              icon="map"
              color="#F59E0B"
              subtitle="+8% this week"
              onPress={() => navigation.navigate('AdminRides')}
            />
            <StatCard
              title="Today's Rides"
              value={stats.todayRides}
              icon="today"
              color="#EF4444"
              subtitle="127 completed"
              onPress={() => navigation.navigate('AdminRides')}
            />
          </View>
        </View>

        {/* Revenue & Rating */}
        <View style={styles.section}>
          <View style={styles.revenueContainer}>
            <View style={styles.revenueCard}>
              <LinearGradient
                colors={['#059669', '#10B981']}
                style={styles.revenueGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.revenueContent}>
                  <Ionicons name="cash" size={32} color="#FFFFFF" />
                  <View style={styles.revenueText}>
                    <Text style={styles.revenueValue}>${stats.revenue.toLocaleString()}</Text>
                    <Text style={styles.revenueLabel}>Total Revenue</Text>
                    <Text style={styles.revenueSubtext}>+15% from last month</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
            <View style={styles.ratingCard}>
              <View style={styles.ratingContent}>
                <Ionicons name="star" size={32} color="#F59E0B" />
                <View style={styles.ratingText}>
                  <Text style={styles.ratingValue}>{stats.rating}</Text>
                  <Text style={styles.ratingLabel}>Average Rating</Text>
                  <Text style={styles.ratingSubtext}>Based on 2,847 reviews</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <QuickActionCard
              title="User Management"
              icon="people-outline"
              color="#10B981"
              description="Manage students and drivers"
              onPress={() => navigation.navigate('AdminUsers')}
            />
            <QuickActionCard
              title="Ride Management"
              icon="map-outline"
              color="#3B82F6"
              description="Monitor and manage rides"
              onPress={() => navigation.navigate('AdminRides')}
            />
            <QuickActionCard
              title="Analytics"
              icon="analytics-outline"
              color="#F59E0B"
              description="View detailed reports"
              onPress={() => navigation.navigate('AdminAnalytics')}
            />
            <QuickActionCard
              title="Support"
              icon="help-circle-outline"
              color="#EF4444"
              description="Handle user support"
              onPress={() => navigation.navigate('AdminSupport')}
            />
            <QuickActionCard
              title="Settings"
              icon="settings-outline"
              color="#8B5CF6"
              description="App configuration"
              onPress={() => navigation.navigate('AdminSettings')}
            />
            <QuickActionCard
              title="Notifications"
              icon="notifications-outline"
              color="#06B6D4"
              description="Send announcements"
              onPress={() => navigation.navigate('AdminNotifications')}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#10B981' }]}>
                <Ionicons name="person-add" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New driver registered</Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Ride completed successfully</Text>
                <Text style={styles.activityTime}>5 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="warning" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Payment issue reported</Text>
                <Text style={styles.activityTime}>10 minutes ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: Typography.base,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: Spacing.xs,
  },
  profileButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  statCardGradient: {
    padding: Spacing.lg,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: '#FFFFFF',
  },
  statTitle: {
    fontSize: Typography.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: Spacing.xs,
  },
  statSubtitle: {
    fontSize: Typography.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  revenueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  revenueCard: {
    flex: 1,
    marginRight: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  revenueGradient: {
    padding: Spacing.lg,
  },
  revenueContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  revenueText: {
    marginLeft: Spacing.md,
  },
  revenueValue: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: '#FFFFFF',
  },
  revenueLabel: {
    fontSize: Typography.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: Spacing.xs,
  },
  revenueSubtext: {
    fontSize: Typography.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  ratingCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: Spacing.md,
  },
  ratingValue: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  ratingLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  ratingSubtext: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  actionsContainer: {
    gap: Spacing.md,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  actionDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  activityCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
  activityTime: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
