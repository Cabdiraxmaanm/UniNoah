import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { bookingsAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';
import Badge from '../components/Badge';

export default function DriverBookingsScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');
  const { user, logout } = useApp();

  const loadBookings = async () => {
    try {
      const driverBookings = await bookingsAPI.getBookings(user.id, 'driver');
      setBookings(driverBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
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

  const handleStartRide = async (bookingId) => {
    try {
      await bookingsAPI.updateBooking(bookingId, { status: 'active' });
      Alert.alert('Success', 'Ride started! Students can now track your location.');
      onRefresh();
    } catch (error) {
      Alert.alert('Error', 'Failed to start ride. Please try again.');
    }
  };

  const handleCompleteRide = async (bookingId) => {
    try {
      await bookingsAPI.updateBooking(bookingId, { status: 'completed' });
      Alert.alert('Success', 'Ride completed! Students can now rate your service.');
      onRefresh();
    } catch (error) {
      Alert.alert('Error', 'Failed to complete ride. Please try again.');
    }
  };

  const handleCancelRide = async (bookingId) => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: async () => {
            try {
              await bookingsAPI.updateBooking(bookingId, { status: 'cancelled' });
              Alert.alert('Success', 'Ride cancelled.');
              onRefresh();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel ride. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignUp' }],
            });
          }
        }
      ]
    );
  };

  const renderBooking = ({ item }) => (
    <View style={styles.bookingCard}>
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
        style={styles.cardGradient}
      >
        {/* Header */}
        <View style={styles.bookingHeader}>
          <View style={styles.routeContainer}>
            <View style={styles.routeLine}>
              <View style={styles.locationDot} />
              <Text style={styles.routeText}>{item.route.from}</Text>
            </View>
            <View style={styles.routeLine}>
              <View style={[styles.locationDot, styles.destinationDot]} />
              <Text style={styles.routeText}>{item.route.to}</Text>
            </View>
          </View>
          <Badge label={getStatusText(item.status)} variant={getBadgeVariantForStatus(item.status)} />
        </View>
        
        {/* Passenger Info */}
        <View style={styles.passengerSection}>
          <View style={styles.passengerAvatar}>
            <Text style={styles.passengerInitial}>{item.passengerName.charAt(0)}</Text>
          </View>
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{item.passengerName}</Text>
            <Text style={styles.passengerPhone}>{item.passengerPhone}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        </View>
        
        {/* Trip Details */}
        <View style={styles.tripDetails}>
          <View style={styles.detailItem}><Text style={styles.detailText}>Date: {formatDate(item.departureTime)}</Text></View>
          <View style={styles.detailItem}><Text style={styles.detailText}>Time: {formatTime(item.departureTime)}</Text></View>
          <View style={styles.detailItem}><Text style={styles.detailText}>Created: {formatDate(item.createdAt)}</Text></View>
        </View>
        
        {/* Actions */}
        <View style={styles.bookingActions}>
          {item.status === 'pending' && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleStartRide(item.id)}
              >
                <LinearGradient
                  colors={Colors.gradients.secondary}
                  style={styles.actionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  
                  <Text style={styles.actionButtonText}>Start Ride</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelRide(item.id)}
              >
                <LinearGradient
                  colors={Colors.gradients.accent}
                  style={styles.actionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
          
          {item.status === 'active' && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCompleteRide(item.id)}
              >
                <LinearGradient
                  colors={Colors.gradients.secondary}
                  style={styles.actionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  
                  <Text style={styles.actionButtonText}>Complete Ride</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('DriverNavigation', { booking: item })}
              >
                <LinearGradient
                  colors={Colors.gradients.primary}
                  style={styles.actionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  
                  <Text style={styles.actionButtonText}>Navigation</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
          
          {item.status === 'completed' && (
            <View style={styles.completedInfo}>
              
              <Text style={styles.completedText}>Ride completed</Text>
              <Text style={styles.completedSubtext}>Student can now rate your service</Text>
            </View>
          )}
          
          {(item.status === 'pending' || item.status === 'active') && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => Alert.alert('Contact', `Call ${item.passengerName}?`)}
            >
              <LinearGradient
                colors={Colors.gradients.accent}
                style={styles.contactButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.contactButtonIcon}>📞</Text>
                <Text style={styles.contactButtonText}>Contact Passenger</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading bookings..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="My Bookings" showLogout={true} onLogout={handleLogout} />
      {/* Status Filter */}
      <View style={styles.filterBar}>
        {['All', 'active', 'pending', 'completed', 'cancelled'].map((key) => (
          <TouchableOpacity key={key} onPress={() => setFilter(key)} style={[styles.filterChip, filter === key && styles.filterChipActive]}>
            <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>
              {key === 'All' ? 'All' : key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Navigation Menu */}
      <View style={styles.navMenu}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('DriverSetAvailability')}>
          <Text style={styles.navButtonText}>Set Availability</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('DriverRequests')}>
          <Text style={styles.navButtonText}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.activeNavButton]} onPress={() => navigation.navigate('DriverBookings')}>
          <Text style={[styles.navButtonText, styles.activeNavButtonText]}>Bookings</Text>
        </TouchableOpacity>
      </View>
      
      {(filter === 'All' ? bookings : bookings.filter(b => b.status === filter)).length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>🚗</View>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptySubtitle}>
            Your confirmed bookings will appear here once students book your rides
          </Text>
          <TouchableOpacity 
            style={styles.createRideButton} 
            onPress={() => navigation.navigate('DriverSetAvailability')}
          >
            <LinearGradient
              colors={Colors.gradients.primary}
              style={styles.createRideButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.createRideButtonText}>Create a Ride</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filter === 'All' ? bookings : bookings.filter(b => b.status === filter)}
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
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background,
  },
  navMenu: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    ...Shadows.sm,
  },
  navButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    marginHorizontal: 2,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  navButtonText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  activeNavButtonText: {
    color: Colors.textInverse,
  },
  filterBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.surface,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  filterTextActive: {
    color: Colors.textInverse,
    fontWeight: Typography.semibold,
  },
  listContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  bookingCard: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.lg,
  },
  cardGradient: {
    padding: Spacing.lg,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  routeContainer: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: Spacing.md,
  },
  destinationDot: {
    backgroundColor: Colors.secondary,
  },
  routeText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: Spacing.xs,
  },
  statusText: {
    color: Colors.textInverse,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
  passengerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.lg,
  },
  passengerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadows.sm,
  },
  passengerInitial: {
    color: Colors.textInverse,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  passengerPhone: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.success,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  detailItem: { alignItems: 'flex-start', flex: 1 },
  detailText: { fontSize: Typography.xs, color: Colors.textSecondary, textAlign: 'left' },
  bookingActions: {
    alignItems: 'center',
  },
  actionButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
    marginBottom: Spacing.sm,
    width: '100%',
  },
  actionButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  actionButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  cancelButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
    marginBottom: Spacing.sm,
    width: '100%',
  },
  contactButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
    width: '100%',
  },
  contactButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  contactButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  completedInfo: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  completedIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  completedText: {
    fontSize: Typography.lg,
    color: Colors.success,
    fontWeight: Typography.bold,
    marginBottom: Spacing.xs,
  },
  completedSubtext: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    lineHeight: Typography.lineHeight.normal,
  },
  createRideButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  createRideButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createRideButtonText: {
    color: Colors.textInverse,
    fontWeight: Typography.bold,
    fontSize: Typography.lg,
  },
}); 