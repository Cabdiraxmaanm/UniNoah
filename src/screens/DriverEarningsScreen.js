import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../utils/AppContext';
import { bookingsAPI } from '../services/api';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

export default function DriverEarningsScreen({ navigation }) {
  const { user } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [driverBookings, setDriverBookings] = useState([]);
  const [earningsData, setEarningsData] = useState(null);

  const loadDriverBookings = async () => {
    try {
      const bookings = await bookingsAPI.getBookings(user.id, 'driver');
      setDriverBookings(bookings);
      // Automatically calculate earnings when bookings are loaded
      const calculatedEarnings = calculateEarningsData(bookings);
      setEarningsData(calculatedEarnings);
    } catch (error) {
      console.error('Error loading driver bookings:', error);
    }
  };

  useEffect(() => {
    loadDriverBookings();
  }, []);

  // Automatically recalculate earnings when bookings change
  useEffect(() => {
    if (driverBookings.length > 0) {
      const calculatedEarnings = calculateEarningsData(driverBookings);
      setEarningsData(calculatedEarnings);
    }
  }, [driverBookings]);

  // Calculate earnings data based on actual bookings
  const calculateEarningsData = (bookings) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filter bookings for current month
    const currentMonthBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
    });
    
    // Calculate totals from actual bookings
    const totalEarnings = currentMonthBookings.reduce((sum, booking) => sum + booking.price, 0);
    const totalRides = currentMonthBookings.length;
    const averagePerRide = totalRides > 0 ? totalEarnings / totalRides : 0;
    
    // Estimate hours worked (assuming 1 hour per ride on average)
    const hoursWorked = totalRides * 1.0;
    const hourlyRate = hoursWorked > 0 ? totalEarnings / hoursWorked : 0;
    
    // Calculate rating based on number of rides (more rides = higher rating)
    const rating = totalRides > 0 ? Math.min(4.5 + (totalRides * 0.05), 5.0) : 0;
    
    // Calculate driver rank based on total rides
    const driverRank = totalRides >= 9 ? 'Top 5%' : totalRides >= 5 ? 'Top 15%' : totalRides >= 2 ? 'Top 30%' : 'New Driver';
    
    return {
      month: {
        totalEarnings: totalEarnings,
        totalRides: totalRides,
        averagePerRide: averagePerRide,
        hoursWorked: hoursWorked,
        hourlyRate: hourlyRate,
        rating: rating,
        driverRank: driverRank,
        period: `This Month ($${totalEarnings.toFixed(2)})`,
        paymentStatus: totalEarnings > 0 ? 'Available Now' : 'No Earnings Yet'
      }
    };
  };


  const currentData = earningsData ? earningsData.month : {
    totalEarnings: 0,
    totalRides: 0,
    averagePerRide: 0,
    hoursWorked: 0,
    hourlyRate: 0,
    rating: 0,
    driverRank: 'New Driver',
    period: 'This Month',
    paymentStatus: 'No Earnings Yet'
  };


  const handleViewDetails = () => {
    Alert.alert('Earnings Details', 'Detailed earnings breakdown coming soon!');
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await loadDriverBookings();
    } catch (error) {
      console.error('Error refreshing earnings:', error);
      Alert.alert('Error', 'Failed to refresh earnings data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Earnings</Text>
          <TouchableOpacity
        style={styles.refreshButton} 
        onPress={handleRefresh}
        disabled={isLoading}
      >
        <Ionicons 
          name={isLoading ? "hourglass" : "refresh"} 
          size={20} 
          color="#FFFFFF" 
        />
          </TouchableOpacity>
      </View>
  );

  const renderEarningsCard = () => (
    <View style={styles.earningsCard}>
      <LinearGradient
        colors={Colors.gradients.primary}
        style={styles.earningsCardGradient}
      >
        <View style={styles.earningsCardContent}>
          <Text style={styles.earningsTitle}>This Month (${currentData.totalEarnings.toFixed(2)})</Text>
           <Text style={styles.totalEarnings}>${currentData.totalEarnings.toFixed(2)}</Text>
          <Text style={styles.earningsSubtitle}>Total Earnings</Text>
          
          <View style={styles.earningsStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentData.totalRides}</Text>
              <Text style={styles.statLabel}>Rides</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>${currentData.averagePerRide.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Per Ride</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentData.driverRank}</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );


  const renderQuickActions = () => (
    <View style={styles.actionsSection}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={handleViewDetails}>
          <View style={styles.actionIcon}>
                  <Ionicons name="analytics" size={24} color={Colors.primary} />
                </View>
                <Text style={styles.actionTitle}>Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => Alert.alert('Tax Report', 'Tax reporting feature coming soon!')}>
          <View style={styles.actionIcon}>
                  <Ionicons name="document-text" size={24} color={Colors.warning} />
                </View>
                <Text style={styles.actionTitle}>Tax Report</Text>
          </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003B73" />
      
      {/* Header */}
      <LinearGradient
        colors={Colors.gradients.primary}
        style={styles.headerGradient}
      >
        {renderHeader()}
        </LinearGradient>
      
      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Earnings Card */}
        {renderEarningsCard()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          <View style={styles.transactionList}>
            {driverBookings.slice(0, 9).map((booking) => (
              <View key={booking.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons 
                    name="person" 
                    size={20} 
                    color={Colors.primary} 
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionType}>
                    {booking.passengerName}
                  </Text>
                  <Text style={styles.transactionTime}>
                    {formatTimeAgo(booking.createdAt)} • {booking.route.from} → {booking.route.to}
                  </Text>
                </View>
                <Text style={styles.transactionAmount}>+${booking.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Header
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  
  // Earnings Card
  earningsCard: {
    marginBottom: 24,
  },
  earningsCardGradient: {
    borderRadius: 16,
    padding: 24,
    ...Shadows.lg,
  },
  earningsCardContent: {
    alignItems: 'center',
  },
  earningsTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  totalEarnings: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  earningsSubtitle: {
    fontSize: 14,
     color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
   },
  earningsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
  },
  
  // Sections
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  
  // Actions Section
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...Shadows.sm,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  
  // Transactions Section
  transactionsSection: {
    marginBottom: 20,
  },
  transactionList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    ...Shadows.sm,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success,
  },
});
