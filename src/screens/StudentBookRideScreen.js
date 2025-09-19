import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { bookingsAPI, requestsAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';

const { width } = Dimensions.get('window');

export default function StudentBookRideScreen({ navigation, route }) {
  const { ride } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const { user, addBooking } = useApp();

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBookRide = async () => {
    setIsLoading(true);
    try {
      // Create a request first so driver can accept; include optional pickup address
      const requestData = {
        rideId: ride.id,
        passengerId: user.id,
        passengerName: user.name,
        passengerPhone: user.phone,
        driverId: ride.driverId,
        driverName: ride.driverName,
        route: { ...ride.route, pickupAddress: pickupAddress || undefined },
        departureTime: ride.departureTime,
        price: ride.price,
      };
      await requestsAPI.createRequest(requestData);
      
      Alert.alert(
        'Request Sent!',
        `Your request was sent to ${ride.driverName}. You will see the booking once accepted.`,
        [
          {
            text: 'View Requests',
            onPress: () => navigation.navigate('StudentRideHistory'),
          },
          {
            text: 'Continue',
            onPress: () => navigation.navigate('StudentSearchRides'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to book ride. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Booking your ride..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Book Ride" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={Colors.gradients.primary}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.routeContainer}>
              <View style={styles.routePoint}>
                <View style={styles.routeDot} />
                <Text style={styles.routeText}>{ride.route.from}</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, styles.routeDotDestination]} />
                <Text style={styles.routeText}>{ride.route.to}</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Total Price</Text>
              <Text style={styles.price}>${ride.price}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Ride Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            
            <Text style={styles.cardTitle}>Ride Details</Text>
          </View>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📅</Text>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(ride.departureTime)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🕒</Text>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{formatTime(ride.departureTime)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>💺</Text>
              <Text style={styles.detailLabel}>Seats</Text>
              <Text style={styles.detailValue}>{ride.availableSeats} available</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>💰</Text>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>${ride.price}</Text>
            </View>
          </View>
        </View>

        {/* Driver Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            
            <Text style={styles.cardTitle}>Driver Information</Text>
          </View>
          
          <View style={styles.driverSection}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverInitial}>{ride.driverName.charAt(0)}</Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{ride.driverName}</Text>
              <Text style={styles.vehicleInfo}>
                {ride.vehicle.model} • {ride.vehicle.plate}
              </Text>
              <Text style={styles.vehicleColor}>{ride.vehicle.color}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ 4.8</Text>
            </View>
          </View>
        </View>

        {/* Passenger Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            
            <Text style={styles.cardTitle}>Your Information</Text>
          </View>
          
          <View style={styles.passengerSection}>
            <View style={styles.passengerAvatar}>
              <Text style={styles.passengerInitial}>{user.name.charAt(0)}</Text>
            </View>
            <View style={styles.passengerInfo}>
              <Text style={styles.passengerName}>{user.name}</Text>
              <Text style={styles.passengerDetails}>{user.email}</Text>
              <Text style={styles.passengerDetails}>{user.phone}</Text>
              <Text style={styles.passengerDetails}>{user.university}</Text>
            </View>
          </View>
        </View>

        {/* Optional Pickup Address */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📍</Text>
            <Text style={styles.cardTitle}>Pickup Address (Optional)</Text>
          </View>
          <View style={{
            backgroundColor: Colors.surfaceSecondary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
          }}>
            <Text style={{
              fontSize: Typography.xs,
              color: Colors.textSecondary,
              marginBottom: Spacing.xs,
            }}>
              Example: House 12, Sha’ab Area, Hargeisa
            </Text>
            <TextInput
              style={{
                backgroundColor: Colors.white,
                borderRadius: BorderRadius.md,
                borderWidth: 1,
                borderColor: Colors.gray200,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.sm,
                fontSize: Typography.base,
                color: Colors.textPrimary,
              }}
              placeholder="Enter pickup address (optional)"
              placeholderTextColor={Colors.textTertiary}
              value={pickupAddress}
              onChangeText={setPickupAddress}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Booking Summary Card */}
        <View style={styles.summaryCard}>
          <LinearGradient
            colors={Colors.gradients.secondary}
            style={styles.summaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.summaryHeader}>
            
              <Text style={styles.summaryTitle}>Booking Summary</Text>
            </View>
            
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Route:</Text>
                <Text style={styles.summaryValue}>{ride.route.from} → {ride.route.to}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date:</Text>
                <Text style={styles.summaryValue}>{formatDate(ride.departureTime)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time:</Text>
                <Text style={styles.summaryValue}>{formatTime(ride.departureTime)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Price:</Text>
                <Text style={styles.totalPrice}>${ride.price}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Book Button */}
        <TouchableOpacity 
          style={styles.bookButton} 
          onPress={handleBookRide}
          disabled={ride.availableSeats === 0}
        >
          <LinearGradient
            colors={ride.availableSeats === 0 ? [Colors.gray400, Colors.gray500] : Colors.gradients.primary}
            style={styles.bookButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.bookButtonIcon}>🚀</Text>
            <Text style={styles.bookButtonText}>
              {ride.availableSeats === 0 ? 'No Seats Available' : 'Confirm Booking'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  heroSection: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.lg,
  },
  heroGradient: {
    padding: Spacing.lg,
  },
  routeContainer: {
    marginBottom: Spacing.lg,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.textInverse,
    marginRight: Spacing.md,
    ...Shadows.sm,
  },
  routeDotDestination: {
    backgroundColor: Colors.secondary,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginLeft: 5,
    marginVertical: 4,
  },
  routeText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textInverse,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  priceContainer: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.xs,
  },
  price: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: Colors.textInverse,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.lg,
  },
  detailIcon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  detailLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
    ...Shadows.sm,
  },
  driverInitial: {
    color: Colors.textInverse,
    fontSize: Typography.xl,
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
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  vehicleColor: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
  },
  ratingContainer: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  ratingText: {
    color: Colors.textInverse,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  passengerSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
    ...Shadows.sm,
  },
  passengerInitial: {
    color: Colors.textInverse,
    fontSize: Typography.xl,
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
  passengerDetails: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  summaryCard: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.lg,
  },
  summaryGradient: {
    padding: Spacing.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  summaryIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  summaryTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textInverse,
  },
  summaryContent: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: Typography.medium,
  },
  summaryValue: {
    fontSize: Typography.sm,
    color: Colors.textInverse,
    fontWeight: Typography.semibold,
    flex: 1,
    textAlign: 'right',
  },
  totalPrice: {
    fontSize: Typography.lg,
    color: Colors.textInverse,
    fontWeight: Typography.bold,
  },
  bookButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  bookButtonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  bookButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
}); 