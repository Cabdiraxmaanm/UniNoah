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

export default function AdminAnalyticsScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [analytics, setAnalytics] = useState({
    revenue: {
      total: 45678,
      growth: 15.2,
      daily: [1200, 1350, 1100, 1600, 1800, 2000, 2200],
    },
    rides: {
      total: 3456,
      growth: 8.5,
      daily: [45, 52, 38, 67, 72, 85, 89],
    },
    users: {
      total: 1247,
      growth: 12.3,
      daily: [8, 12, 6, 15, 18, 22, 25],
    },
    ratings: {
      average: 4.8,
      distribution: {
        '5': 65,
        '4': 25,
        '3': 7,
        '2': 2,
        '1': 1,
      },
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const MetricCard = ({ title, value, growth, icon, color, subtitle }) => (
    <View style={styles.metricCard}>
      <LinearGradient
        colors={[color, `${color}CC`]}
        style={styles.metricGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.metricContent}>
          <View style={styles.metricHeader}>
            <View style={styles.metricIconContainer}>
              <Ionicons name={icon} size={24} color="#FFFFFF" />
            </View>
            <View style={styles.growthContainer}>
              <Ionicons name="trending-up" size={16} color="#FFFFFF" />
              <Text style={styles.growthText}>+{growth}%</Text>
            </View>
          </View>
          <Text style={styles.metricValue}>{value}</Text>
          <Text style={styles.metricTitle}>{title}</Text>
          {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
        </View>
      </LinearGradient>
    </View>
  );

  const ChartCard = ({ title, data, type }) => (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartContainer}>
        {type === 'bar' ? (
          <View style={styles.barChart}>
            {data.map((value, index) => (
              <View key={index} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (value / Math.max(...data)) * 100,
                      backgroundColor: '#10B981',
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.pieChart}>
            <View style={styles.pieChartPlaceholder}>
              <Ionicons name="pie-chart" size={48} color="#10B981" />
              <Text style={styles.pieChartText}>Chart Visualization</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const TopDriverCard = ({ driver, rank }) => (
    <View style={styles.topDriverCard}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>#{rank}</Text>
      </View>
      <View style={styles.driverInfo}>
        <Text style={styles.driverName}>{driver.name}</Text>
        <Text style={styles.driverStats}>
          {driver.rides} rides • {driver.rating}★ • ${driver.earnings}
        </Text>
      </View>
      <View style={styles.driverRating}>
        <Ionicons name="star" size={16} color="#F59E0B" />
        <Text style={styles.ratingText}>{driver.rating}</Text>
      </View>
    </View>
  );

  const periodOptions = [
    { key: 'day', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
  ];

  const topDrivers = [
    { name: 'Sarah Wilson', rides: 156, rating: 4.9, earnings: 2340 },
    { name: 'David Brown', rides: 142, rating: 4.8, earnings: 2130 },
    { name: 'Lisa Davis', rides: 128, rating: 4.7, earnings: 1920 },
    { name: 'Mike Johnson', rides: 115, rating: 4.6, earnings: 1725 },
    { name: 'Emily Chen', rides: 98, rating: 4.5, earnings: 1470 },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#34D399']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics</Text>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download-outline" size={24} color="#FFFFFF" />
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
        {/* Period Selector */}
        <View style={styles.periodContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.periodContent}
          >
            {periodOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[styles.periodTab, selectedPeriod === option.key && styles.activePeriodTab]}
                onPress={() => setSelectedPeriod(option.key)}
              >
                <Text style={[styles.periodTabText, selectedPeriod === option.key && styles.activePeriodTabText]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total Revenue"
              value={`$${analytics.revenue.total.toLocaleString()}`}
              growth={analytics.revenue.growth}
              icon="cash"
              color="#10B981"
              subtitle="This period"
            />
            <MetricCard
              title="Total Rides"
              value={analytics.rides.total.toLocaleString()}
              growth={analytics.rides.growth}
              icon="car"
              color="#3B82F6"
              subtitle="Completed"
            />
            <MetricCard
              title="Active Users"
              value={analytics.users.total.toLocaleString()}
              growth={analytics.users.growth}
              icon="people"
              color="#F59E0B"
              subtitle="Registered"
            />
            <MetricCard
              title="Avg Rating"
              value={analytics.ratings.average.toFixed(1)}
              growth={2.1}
              icon="star"
              color="#8B5CF6"
              subtitle="Out of 5.0"
            />
          </View>
        </View>

        {/* Charts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Trends</Text>
          <ChartCard
            title="Revenue Trend"
            data={analytics.revenue.daily}
            type="bar"
          />
          <ChartCard
            title="Rides Trend"
            data={analytics.rides.daily}
            type="bar"
          />
        </View>

        {/* Rating Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rating Distribution</Text>
          <View style={styles.ratingCard}>
            <View style={styles.ratingHeader}>
              <Text style={styles.ratingTitle}>Customer Satisfaction</Text>
              <Text style={styles.ratingAverage}>{analytics.ratings.average}/5.0</Text>
            </View>
            <View style={styles.ratingBars}>
              {Object.entries(analytics.ratings.distribution).map(([rating, percentage]) => (
                <View key={rating} style={styles.ratingBarContainer}>
                  <Text style={styles.ratingLabel}>{rating}★</Text>
                  <View style={styles.ratingBarBackground}>
                    <View
                      style={[
                        styles.ratingBar,
                        {
                          width: `${percentage}%`,
                          backgroundColor: rating >= 4 ? '#10B981' : rating >= 3 ? '#F59E0B' : '#EF4444',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.ratingPercentage}>{percentage}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Top Drivers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Drivers</Text>
          <View style={styles.topDriversCard}>
            {topDrivers.map((driver, index) => (
              <TopDriverCard key={index} driver={driver} rank={index + 1} />
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          <View style={styles.insightsCard}>
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#10B981' }]}>
                <Ionicons name="trending-up" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Revenue Growth</Text>
                <Text style={styles.insightDescription}>
                  Revenue increased by 15.2% compared to last period
                </Text>
              </View>
            </View>
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="people" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>User Growth</Text>
                <Text style={styles.insightDescription}>
                  New user registrations up by 12.3% this month
                </Text>
              </View>
            </View>
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="star" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>High Satisfaction</Text>
                <Text style={styles.insightDescription}>
                  90% of users rate their experience 4+ stars
                </Text>
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
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: '#FFFFFF',
  },
  exportButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  periodContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  periodContent: {
    paddingHorizontal: Spacing.xs,
  },
  periodTab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  activePeriodTab: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  periodTabText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  activePeriodTabText: {
    color: '#FFFFFF',
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  metricGradient: {
    padding: Spacing.lg,
  },
  metricContent: {
    flex: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: '#FFFFFF',
    marginLeft: Spacing.xs,
  },
  metricValue: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  metricTitle: {
    fontSize: Typography.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  metricSubtitle: {
    fontSize: Typography.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  chartTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  chartContainer: {
    height: 200,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingHorizontal: Spacing.sm,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  bar: {
    width: '100%',
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  barLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  pieChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieChartPlaceholder: {
    alignItems: 'center',
  },
  pieChartText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  ratingCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  ratingTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  ratingAverage: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: '#10B981',
  },
  ratingBars: {
    gap: Spacing.md,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    width: 30,
  },
  ratingBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.md,
  },
  ratingBar: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  ratingPercentage: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    width: 40,
    textAlign: 'right',
  },
  topDriversCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  topDriverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  rankText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  driverStats: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginLeft: Spacing.xs,
  },
  insightsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  insightDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
