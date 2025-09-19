import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Badge from '../components/Badge';
import { bookingsAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';

export default function StudentRideHistoryScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All'); // All | active | pending | completed | cancelled
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, bookings: contextBookings, logout } = useApp();

  const loadBookings = async () => {
    try {
      const userBookings = await bookingsAPI.getBookings(user.id, 'student');
      setBookings(userBookings);
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
        
        {/* Driver Info */}
        <View style={styles.driverSection}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverInitial}>{item.driverName.charAt(0)}</Text>
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{item.driverName}</Text>
            <Text style={styles.vehicleInfo}>
              {item.vehicle?.model} • {item.vehicle?.plate}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        </View>
        
        {/* Trip Details */}
        <View style={styles.tripDetails}>
          <View style={styles.detailItem}><Text style={styles.detailText}>Date: {formatDate(item.departureTime)}</Text></View>
          <View style={styles.detailItem}><Text style={styles.detailText}>Time: {formatTime(item.departureTime)}</Text></View>
          <View style={styles.detailItem}><Text style={styles.detailText}>Requested: {formatDate(item.createdAt)}</Text></View>
        </View>
        
        {/* Actions */}
        <View style={styles.bookingActions}>
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
                  
                <Text style={styles.actionButtonText}>Track Ride</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          
          {item.status === 'completed' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('StudentRateDriver', { booking: item })}
            >
              <LinearGradient
                colors={Colors.gradients.secondary}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                  
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
                colors={Colors.gradients.accent}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                  
                <Text style={styles.actionButtonText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
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
      <Header 
        title="Ride History" 
        showLogout={true}
        onLogout={handleLogout}
      />
      {/* Status Filter */}
      <View style={styles.filterBar}>
        {['All', 'active', 'pending', 'completed', 'cancelled'].map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => setFilter(key)}
            style={[styles.filterChip, filter === key && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>
              {key === 'All' ? 'All' : key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Navigation Menu */}
      <View style={styles.navMenu}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('StudentSearchRides')}
        >
          <Text style={styles.navButtonText}>Search Rides</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, styles.activeNavButton]} 
          onPress={() => navigation.navigate('StudentRideHistory')}
        >
          <Text style={[styles.navButtonText, styles.activeNavButtonText]}>Ride History</Text>
        </TouchableOpacity>
      </View>
      
      {(filter !== 'All' ? bookings.filter(b => b.status === filter) : bookings).length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>📋</View>
          <Text style={styles.emptyTitle}>No ride history</Text>
          <Text style={styles.emptySubtitle}>
            You haven't booked any rides yet. Start by searching for available rides!
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
              <Text style={styles.searchButtonText}>Search Rides</Text>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    ...Shadows.sm,
  },
  navButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  navButtonText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  activeNavButtonText: {
    color: Colors.textInverse,
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
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.lg,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadows.sm,
  },
  driverInitial: {
    color: Colors.textInverse,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  vehicleInfo: {
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
  detailItem: {
    alignItems: 'flex-start',
    flex: 1,
  },
  detailText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'left',
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
  bookingActions: {
    alignItems: 'center',
  },
  actionButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
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
  searchButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  searchButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: Colors.textInverse,
    fontWeight: Typography.bold,
    fontSize: Typography.lg,
  },
}); 