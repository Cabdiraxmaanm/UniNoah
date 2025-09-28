import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, Dimensions, Animated, StatusBar, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { bookingsAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function StudentRideHistoryScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filter, setFilter] = useState('All'); // All | active | pending | completed | cancelled
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, bookings: contextBookings } = useApp();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const loadBookings = async () => {
    try {
      const userBookings = await bookingsAPI.getBookings(user.id, 'student');
      setBookings(userBookings);
      setFilteredBookings(userBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
    
    // Start animations
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Filter bookings based on selected filter
  useEffect(() => {
    if (filter === 'All') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === filter));
    }
  }, [bookings, filter]);

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const handleCalendarView = () => {
    Alert.alert(
      'Calendar View',
      'View your ride history in calendar format',
      [
        { text: 'This Month', onPress: () => console.log('Show this month') },
        { text: 'Last Month', onPress: () => console.log('Show last month') },
        { text: 'All Time', onPress: () => console.log('Show all time') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'active':
        return Colors.primary;
      case 'pending':
        return Colors.warning;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.gray500;
    }
  };

  const getBadgeVariantForStatus = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'active':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const renderBooking = ({ item, index }) => (
    <Animated.View 
      style={[
        styles.bookingCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Status Header */}
        <View style={styles.statusHeader}>
          <View style={styles.statusInfo}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(item.status) }
            ]} />
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
          <Text style={styles.bookingDate}>{formatDate(item.createdAt)}</Text>
        </View>

        {/* Route Section */}
        <View style={styles.routeSection}>
          <View style={styles.routeInfo}>
            <View style={styles.routeLine}>
              <View style={styles.locationDot}>
                <Ionicons name="location" size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.fromText}>{item.route.from}</Text>
            </View>
            <View style={styles.routeDivider}>
              <View style={styles.dividerLine} />
              <Ionicons name="arrow-down" size={16} color={Colors.primary} />
              <View style={styles.dividerLine} />
            </View>
            <View style={styles.routeLine}>
              <View style={[styles.locationDot, styles.destinationDot]}>
                <Ionicons name="flag" size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.toText}>{item.route.to}</Text>
            </View>
          </View>
          <View style={styles.priceSection}>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.priceLabel}>paid</Text>
          </View>
        </View>
        
        {/* Driver Card */}
        <View style={styles.driverCard}>
          <View style={styles.driverInfo}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverInitial}>{item.driverName.charAt(0)}</Text>
          </View>
            <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{item.driverName}</Text>
              <View style={styles.vehicleRow}>
                <Ionicons name="car" size={14} color={Colors.textSecondary} />
                <Text style={styles.vehicleText}>{item.vehicle?.model} • {item.vehicle?.plate}</Text>
              </View>
            </View>
          </View>
          <View style={styles.departureInfo}>
            <Text style={styles.departureLabel}>Departure</Text>
            <Text style={styles.departureTime}>{formatTime(item.departureTime)}</Text>
          </View>
        </View>
        
        {/* Trip Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(item.departureTime)}</Text>
          </View>
          <View style={styles.detailCard}>
            <Ionicons name="time" size={20} color={Colors.primary} />
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{formatTime(item.departureTime)}</Text>
          </View>
          <View style={styles.detailCard}>
            <Ionicons name="person" size={20} color={Colors.primary} />
            <Text style={styles.detailLabel}>Driver</Text>
            <Text style={styles.detailValue}>{item.driverName.split(' ')[0]}</Text>
          </View>
        </View>
        
        {/* Action Button */}
          {item.status === 'active' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('StudentLiveTracking', { booking: item })}
            >
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
              <Ionicons name="navigate" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Track Ride</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          
          {item.status === 'completed' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('StudentRateExperience', { booking: item })}
            >
              <LinearGradient
                colors={Colors.gradients.secondary}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
              <Ionicons name="star" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Rate Driver</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          
          {item.status === 'pending' && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelBooking(item.id)}
            >
              <LinearGradient
              colors={['#EF4444', '#DC2626']}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
              <Ionicons name="close-circle" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Cancel Ride</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
      </LinearGradient>
    </Animated.View>
  );

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsAPI.updateBooking(bookingId, { status: 'cancelled' });
      onRefresh();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your ride history..." />;
  }

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
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ride History</Text>
          <TouchableOpacity
              style={styles.calendarButton}
              onPress={() => Alert.alert('Calendar', 'Calendar view coming soon!')}
            >
              <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Filter Chips */}
          <Animated.View 
            style={[
              styles.filterContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { key: 'All', label: 'All Rides', icon: 'grid' },
                { key: 'active', label: 'Active', icon: 'play-circle' },
                { key: 'pending', label: 'Pending', icon: 'time' },
              ].map((filterOption) => (
                <TouchableOpacity
                  key={filterOption.key}
                  style={[
                    styles.filterChip,
                    filter === filterOption.key && styles.filterChipActive
                  ]}
                  onPress={() => setFilter(filterOption.key)}
                >
                  <Ionicons 
                    name={filterOption.icon} 
                    size={16} 
                    color={filter === filterOption.key ? '#FFFFFF' : Colors.primary} 
                  />
                  <Text style={[
                    styles.filterChipText,
                    filter === filterOption.key && styles.filterChipTextActive
                  ]}>
                    {filterOption.label}
            </Text>
          </TouchableOpacity>
        ))}
            </ScrollView>
          </Animated.View>
      </View>
      </LinearGradient>
      
      {/* Content */}
      <View style={styles.content}>
        {filteredBookings.length === 0 ? (
          <Animated.View 
            style={[
              styles.emptyState,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.emptyIconContainer}>
              <Ionicons name="receipt-outline" size={64} color={Colors.primary} />
      </View>
            <Text style={styles.emptyTitle}>
              {filter === 'All' ? 'No ride history' : `No ${filter} rides`}
            </Text>
          <Text style={styles.emptySubtitle}>
              {filter === 'All' 
                ? 'You haven\'t booked any rides yet. Start by searching for available rides!'
                : `You don't have any ${filter} rides at the moment.`
              }
          </Text>
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={() => navigation.navigate('StudentSearchRides')}
          >
            <LinearGradient
              colors={Colors.gradients.primary}
              style={styles.searchButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
                <Ionicons name="search" size={20} color="#FFFFFF" />
              <Text style={styles.searchButtonText}>Search Rides</Text>
            </LinearGradient>
          </TouchableOpacity>
          </Animated.View>
      ) : (
        <FlatList
            data={filteredBookings}
          keyExtractor={item => item.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
      </View>
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
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Filter Styles
  filterContainer: {
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterChipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  
  // Content Styles
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 150, // Adjusted for floating navigation bar
  },
  
  // Booking Card Styles
  bookingCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  cardGradient: {
    padding: 20,
  },
  
  // Status Header
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  bookingDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  
  // Route Section
  routeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  routeInfo: {
    flex: 1,
    marginRight: 16,
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...Shadows.sm,
  },
  destinationDot: {
    backgroundColor: Colors.secondary,
  },
  fromText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  toText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  routeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray300,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.success,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  
  // Driver Card
  driverCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...Shadows.sm,
  },
  driverInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  departureInfo: {
    alignItems: 'flex-end',
  },
  departureLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  departureTime: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  
  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  
  // Action Buttons
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Shadows.md,
  },
  cancelButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Shadows.md,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  searchButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Shadows.md,
  },
  searchButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
}); 