import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions, TextInput, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { bookingsAPI, requestsAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function StudentBookRideScreen({ navigation, route }) {
  const { ride } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const { user, addBooking } = useApp();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
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
        '🎉 Request Sent Successfully!',
        `Your ride request has been sent to ${ride.driverName}. You'll receive a notification once the driver responds.\n\n📍 Route: ${ride.route.from} → ${ride.route.to}\n💰 Price: $${ride.price}\n⏰ Departure: ${formatTime(ride.departureTime)}`,
        [
          {
            text: 'View My Requests',
            onPress: () => navigation.navigate('StudentRequests'),
          },
          {
            text: 'Find More Rides',
            onPress: () => navigation.navigate('StudentSearchRides'),
          },
          {
            text: 'Go Home',
            onPress: () => navigation.navigate('StudentTabs'),
            style: 'default'
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
            <Text style={styles.headerTitle}>Book Ride</Text>
            <View style={styles.placeholder} />
          </View>
          
          {/* Route Display */}
          <Animated.View 
            style={[
              styles.routeSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.routeInfo}>
              <View style={styles.routeLine}>
                <View style={styles.locationDot}>
                  <Ionicons name="location" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.fromText}>{ride.route.from}</Text>
              </View>
              <View style={styles.routeDivider}>
                <View style={styles.dividerLine} />
                <Ionicons name="arrow-down" size={16} color="#FFFFFF" />
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.routeLine}>
                <View style={[styles.locationDot, styles.destinationDot]}>
                  <Ionicons name="flag" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.toText}>{ride.route.to}</Text>
              </View>
            </View>
            <View style={styles.priceSection}>
              <Text style={styles.price}>${ride.price}</Text>
              <Text style={styles.priceLabel}>per seat</Text>
            </View>
          </Animated.View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Elegant Ride Details Card */}
        <Animated.View 
          style={[
            styles.elegantRideDetailsCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.elegantCardHeader}>
            <Text style={styles.elegantCardTitle}>Ride Details</Text>
            <View style={styles.elegantDivider} />
          </View>
          
          <View style={styles.elegantDetailsContainer}>
            {/* Date & Time Row */}
            <View style={styles.elegantDetailRow}>
              <View style={styles.elegantDetailItem}>
                <View style={styles.elegantIconWrapper}>
                  <Ionicons name="calendar-outline" size={20} color="#003B73" />
                </View>
                <View style={styles.elegantDetailText}>
                  <Text style={styles.elegantDetailLabel}>Date</Text>
                  <Text style={styles.elegantDetailValue}>{formatDate(ride.departureTime)}</Text>
                </View>
              </View>
              
              <View style={styles.elegantDetailItem}>
                <View style={styles.elegantIconWrapper}>
                  <Ionicons name="time-outline" size={20} color="#0074D9" />
                </View>
                <View style={styles.elegantDetailText}>
                  <Text style={styles.elegantDetailLabel}>Time</Text>
                  <Text style={styles.elegantDetailValue}>{formatTime(ride.departureTime)}</Text>
                </View>
              </View>
            </View>

            {/* Seats & Price Row */}
            <View style={styles.elegantDetailRow}>
              <View style={styles.elegantDetailItem}>
                <View style={styles.elegantIconWrapper}>
                  <Ionicons name="people-outline" size={20} color="#00BFFF" />
                </View>
                <View style={styles.elegantDetailText}>
                  <Text style={styles.elegantDetailLabel}>Seats</Text>
                  <Text style={styles.elegantDetailValue}>{ride.availableSeats} left</Text>
                </View>
              </View>
              
              <View style={styles.elegantDetailItem}>
                <View style={styles.elegantIconWrapper}>
                  <Ionicons name="cash-outline" size={20} color="#F59E0B" />
                </View>
                <View style={styles.elegantDetailText}>
                  <Text style={styles.elegantDetailLabel}>Price</Text>
                  <Text style={styles.elegantDetailValue}>${ride.price}</Text>
            </View>
            </View>
            </View>
          </View>
        </Animated.View>

        {/* Driver Information Card */}
        <Animated.View 
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Driver Information</Text>
          </View>
          
          <View style={styles.driverCard}>
            <View style={styles.driverInfo}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverInitial}>{ride.driverName.charAt(0)}</Text>
            </View>
              <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{ride.driverName}</Text>
                <View style={styles.vehicleRow}>
                  <Ionicons name="car" size={14} color={Colors.textSecondary} />
                  <Text style={styles.vehicleText}>{ride.vehicle.model} • {ride.vehicle.plate}</Text>
                </View>
                <View style={styles.ratingRow}>
                  <Text style={styles.vehicleColor}>{ride.vehicle.color}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.ratingText}>4.8</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Your Information Card */}
        <Animated.View 
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle" size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Your Information</Text>
          </View>
          
          <View style={styles.passengerCard}>
            <View style={styles.passengerInfo}>
            <View style={styles.passengerAvatar}>
              <Text style={styles.passengerInitial}>{user?.name?.charAt(0) || 'S'}</Text>
            </View>
              <View style={styles.passengerDetails}>
              <Text style={styles.passengerName}>{user?.name || 'Student'}</Text>
                <Text style={styles.passengerDetail}>{user?.email || 'student@example.com'}</Text>
                <Text style={styles.passengerDetail}>{user?.phone || 'N/A'}</Text>
                <Text style={styles.passengerDetail}>{user?.university || 'University'}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Pickup Address Card */}
        <Animated.View 
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Pickup Address (Optional)</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Where should the driver pick you up?</Text>
            <Text style={styles.inputHint}>Example: House 12, Sha'ab Area, Hargeisa</Text>
            <TextInput
              style={[
                styles.textInput,
                focusedInput === 'pickup' && styles.textInputFocused
              ]}
              placeholder="Enter pickup address (optional)"
              placeholderTextColor={Colors.textTertiary}
              value={pickupAddress}
              onChangeText={setPickupAddress}
              onFocus={() => setFocusedInput('pickup')}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="words"
            />
          </View>
        </Animated.View>

        {/* Booking Summary Card */}
        <Animated.View 
          style={[
            styles.summaryCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={Colors.gradients.secondary}
            style={styles.summaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.summaryHeader}>
              <Ionicons name="receipt" size={24} color="#FFFFFF" />
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
        </Animated.View>

         {/* Confirm Booking Section */}
         <Animated.View
           style={[
             styles.confirmBookingSection,
             {
               opacity: fadeAnim,
               transform: [{ translateY: slideAnim }],
             },
           ]}
         >
           <TouchableOpacity 
             style={styles.bookButton} 
             onPress={handleBookRide}
             disabled={ride.availableSeats === 0}
           >
             <LinearGradient
                 colors={ride.availableSeats === 0 ? ['#9CA3AF', '#6B7280'] : Colors.gradients.primary}
               style={styles.bookButtonGradient}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 1 }}
             >
                 <Ionicons 
                   name={ride.availableSeats === 0 ? "close-circle" : "checkmark-circle"} 
                   size={24} 
                   color="#FFFFFF" 
                 />
               <Text style={styles.bookButtonText}>
                 {ride.availableSeats === 0 ? 'No Seats Available' : 'Confirm Booking'}
               </Text>
             </LinearGradient>
           </TouchableOpacity>
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
  placeholder: {
    width: 40,
  },
  
  // Route Section
  routeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...Shadows.sm,
  },
  destinationDot: {
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
  },
  fromText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  toText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priceLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  
  // Content Styles
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 150, // Adjusted for floating navigation bar
  },
  
  // Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...Shadows.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  
  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  
  // Elegant Ride Details Styles
  elegantRideDetailsCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    borderRadius: 16,
    padding: 24,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 59, 115, 0.08)',
  },
  elegantCardHeader: {
    marginBottom: 20,
  },
  elegantCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  elegantDivider: {
    height: 2,
    backgroundColor: 'rgba(0, 59, 115, 0.1)',
    borderRadius: 1,
    width: 40,
  },
  elegantDetailsContainer: {
    gap: 16,
  },
  elegantDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  elegantDetailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 59, 115, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 59, 115, 0.06)',
  },
  elegantIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 59, 115, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  elegantDetailText: {
    flex: 1,
  },
  elegantDetailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  elegantDetailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  
  // Driver Card
  driverCard: {
    backgroundColor: Colors.surfaceSecondary,
    padding: 16,
    borderRadius: 12,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  vehicleColor: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  
  // Passenger Card
  passengerCard: {
    backgroundColor: Colors.surfaceSecondary,
    padding: 16,
    borderRadius: 12,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...Shadows.sm,
  },
  passengerInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  passengerDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  passengerDetail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  
  // Input Styles
  inputContainer: {
    backgroundColor: Colors.surfaceSecondary,
    padding: 16,
    borderRadius: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  inputHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  textInputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  
  // Summary Card
  summaryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  summaryGradient: {
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  summaryContent: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
   totalPrice: {
     fontSize: 18,
     color: '#FFFFFF',
     fontWeight: 'bold',
   },
   
   // Confirm Booking Section
   confirmBookingSection: {
     marginTop: 20,
   },
   
   // Book Button
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  bookButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 