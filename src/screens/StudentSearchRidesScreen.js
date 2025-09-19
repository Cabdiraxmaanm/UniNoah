import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ridesAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';
import Badge from '../components/Badge';

const { width } = Dimensions.get('window');

export default function StudentSearchRidesScreen({ navigation }) {
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useApp();

  const loadRides = async () => {
    try {
      const availableRides = await ridesAPI.getAvailableRides();
      setRides(availableRides);
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRides();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadRides();
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

  const getStatusColor = (seats) => {
    if (seats === 0) return Colors.error;
    if (seats <= 2) return Colors.warning;
    return Colors.success;
  };

  const getStatusText = (seats) => {
    if (seats === 0) return 'FULL';
    if (seats <= 2) return 'FEW SEATS';
    return 'AVAILABLE';
  };

  const renderRide = ({ item }) => (
    <View style={styles.rideCard}>
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
        style={styles.cardGradient}
      >
        {/* Header with route and price */}
        <View style={styles.rideHeader}>
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
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.priceLabel}>per seat</Text>
          </View>
        </View>

        {/* Driver and vehicle info */}
        <View style={styles.driverSection}>
          <View style={styles.driverInfo}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverInitial}>{item.driverName.charAt(0)}</Text>
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{item.driverName}</Text>
              <Text style={styles.vehicleInfo}>
                {item.vehicle.model} • {item.vehicle.plate}
              </Text>
            </View>
          </View>
          <Badge 
            label={getStatusText(item.availableSeats)} 
            variant={item.availableSeats === 0 ? 'error' : item.availableSeats <= 2 ? 'warning' : 'success'}
          />
        </View>

        {/* Trip details */}
        <View style={styles.tripDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>Time: {formatTime(item.departureTime)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>Date: {formatDate(item.departureTime)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>Seats: {item.availableSeats} left</Text>
          </View>
        </View>

        {/* Action button */}
        <TouchableOpacity
          style={[
            styles.bookButton,
            item.availableSeats === 0 && styles.bookButtonDisabled
          ]}
          onPress={() => navigation.navigate('StudentBookRide', { ride: item })}
          disabled={item.availableSeats === 0}
        >
          <LinearGradient
            colors={item.availableSeats === 0 ? [Colors.gray400, Colors.gray500] : Colors.gradients.primary}
            style={styles.bookButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.bookButtonText}>
              {item.availableSeats === 0 ? 'Fully Booked' : 'Book This Ride'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading available rides..." />;
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Available Rides" 
        showLogout={true}
        onLogout={handleLogout}
      />
      
      {/* Navigation Menu */}
      <View style={styles.navMenu}>
        <TouchableOpacity 
          style={[styles.navButton, styles.activeNavButton]} 
          onPress={() => navigation.navigate('StudentSearchRides')}
        >
          <Text style={[styles.navButtonText, styles.activeNavButtonText]}>Search Rides</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('StudentRideHistory')}
        >
          <Text style={styles.navButtonText}>Ride History</Text>
        </TouchableOpacity>
      </View>
      
      {rides.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>🚗</View>
          <Text style={styles.emptyTitle}>No rides available</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new rides or try refreshing
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <LinearGradient
              colors={Colors.gradients.primary}
              style={styles.refreshButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={item => item.id}
          renderItem={renderRide}
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
  rideCard: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.lg,
  },
  cardGradient: {
    padding: Spacing.lg,
  },
  rideHeader: {
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
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.success,
  },
  priceLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  driverSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.lg,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  vehicleInfo: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  statusText: {
    color: Colors.textInverse,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  detailText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bookButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: { 
    color: Colors.textInverse, 
    fontWeight: Typography.bold, 
    fontSize: Typography.lg,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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
  refreshButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  refreshButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonText: {
    color: Colors.textInverse,
    fontWeight: Typography.bold,
    fontSize: Typography.lg,
  },
}); 