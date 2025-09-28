import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar, Animated, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, Polyline } from '../components/MapView';
import MonthlyTrackingCalendar from '../components/MonthlyTrackingCalendar';
import { locationAPI, bookingsAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function StudentLiveTrackingScreen({ navigation, route }) {
  const { booking } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState(null);
  const [estimatedArrival, setEstimatedArrival] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'live'
  const mapRef = useRef(null);
  const { user } = useApp();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    loadAllBookings();
    if (viewMode === 'live') {
      initializeTracking();
      const interval = setInterval(updateDriverLocation, 10000);
      return () => clearInterval(interval);
    }
    
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
  }, [viewMode]);

  const loadAllBookings = async () => {
    try {
      const bookings = await bookingsAPI.getBookings(user.id, 'student');
      setAllBookings(bookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const initializeTracking = async () => {
    try {
      setIsLoading(true);
      
      // Get route information
      const routeData = await locationAPI.getRoute(
        booking.route.fromCoords,
        booking.route.toCoords
      );
      setRouteInfo(routeData);

      // Get initial driver location (simulated)
      const location = await locationAPI.getCurrentLocation();
      setDriverLocation(location);

      // Calculate estimated arrival with emojis
      const now = new Date();
      const departureTime = new Date(booking.departureTime);
      const timeDiff = departureTime.getTime() - now.getTime();
      const minutesUntilDeparture = Math.floor(timeDiff / (1000 * 60));
      
      if (minutesUntilDeparture > 0) {
        setEstimatedArrival(`🚗 Departing in ${minutesUntilDeparture} minutes`);
      } else if (minutesUntilDeparture > -30) {
        setEstimatedArrival('🔄 Driver is on the way');
      } else {
        setEstimatedArrival('📍 Arriving soon');
      }

    } catch (error) {
      console.error('Error initializing tracking:', error);
      Alert.alert('Error', 'Failed to initialize tracking');
    } finally {
      setIsLoading(false);
    }
  };

  const updateDriverLocation = async () => {
    try {
      // Simulate driver movement
      const newLocation = await locationAPI.getCurrentLocation();
      setDriverLocation(newLocation);
      
      // Update estimated arrival
      const now = new Date();
      const departureTime = new Date(booking.departureTime);
      const timeDiff = departureTime.getTime() - now.getTime();
      const minutesUntilDeparture = Math.floor(timeDiff / (1000 * 60));
      
      if (minutesUntilDeparture > 0) {
        setEstimatedArrival(`${minutesUntilDeparture} minutes until departure`);
      } else {
        setEstimatedArrival('Driver is on the way');
      }
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleContactDriver = () => {
    Alert.alert(
      'Contact Driver',
      `Call ${booking.driverName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling driver...') }
      ]
    );
  };

  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: () => {
            // Handle cancellation
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleDateSelect = (dayData) => {
    if (dayData.hasRides) {
      setSelectedDate(dayData.date);
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'calendar' ? 'live' : 'calendar');
  };

  const getSelectedDateRides = () => {
    if (!selectedDate) return [];
    return allBookings.filter(booking => {
      const bookingDate = new Date(booking.departureTime);
      return bookingDate.getDate() === selectedDate.getDate() &&
             bookingDate.getMonth() === selectedDate.getMonth() &&
             bookingDate.getFullYear() === selectedDate.getFullYear();
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="Initializing tracking..." />;
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
            <Text style={styles.headerTitle}>
              {viewMode === 'calendar' ? 'Monthly Tracking' : 'Live Tracking'}
            </Text>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={toggleViewMode}
            >
              <Ionicons 
                name={viewMode === 'calendar' ? 'location' : 'calendar'} 
                size={24} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
          
          {/* Quick Stats */}
          <Animated.View 
            style={[
              styles.statsCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{allBookings.length}</Text>
              <Text style={styles.statLabel}>Total Rides</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {allBookings.filter(b => new Date(b.departureTime) > new Date()).length}
              </Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {allBookings.filter(b => b.status === 'completed').length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === 'calendar' ? (
          <>
            {/* Monthly Calendar */}
            <Animated.View 
              style={[
                styles.calendarSection,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <MonthlyTrackingCalendar
                bookings={allBookings}
                userType="student"
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </Animated.View>

            {/* Selected Date Details */}
            {selectedDate && (
              <Animated.View 
                style={[
                  styles.selectedDateSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <Text style={styles.selectedDateTitle}>
                  Rides for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
                
                {getSelectedDateRides().map((ride, index) => (
                  <View key={index} style={styles.rideCard}>
                    <View style={styles.rideHeader}>
                      <View style={styles.rideInfo}>
                        <Text style={styles.rideTime}>
                          {formatTime(ride.departureTime)}
                        </Text>
                        <Text style={styles.rideRoute}>
                          {ride.route.from} → {ride.route.to}
                        </Text>
                      </View>
                      <View style={styles.rideStatus}>
                        <Text style={[
                          styles.statusText,
                          { color: ride.status === 'completed' ? Colors.success : Colors.warning }
                        ]}>
                          {ride.status}
                        </Text>
                        <Text style={styles.ridePrice}>${ride.price.toFixed(2)}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </Animated.View>
            )}
          </>
        ) : (
          <>
            {/* Live Tracking View */}
            <Animated.View 
              style={[
                styles.mapSection,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                  latitude: booking.route.fromCoords.latitude,
                  longitude: booking.route.fromCoords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={booking.route.fromCoords}
                  title="Pickup Location"
                  description={booking.route.from}
                  pinColor={Colors.success}
                />
                <Marker
                  coordinate={booking.route.toCoords}
                  title="Destination"
                  description={booking.route.to}
                  pinColor={Colors.error}
                />
                {driverLocation && (
                  <Marker
                    coordinate={driverLocation}
                    title="Driver Location"
                    description="Your driver"
                    pinColor={Colors.primary}
                  />
                )}
                {routeInfo && (
                  <Polyline
                    coordinates={routeInfo.coordinates}
                    strokeColor={Colors.primary}
                    strokeWidth={3}
                  />
                )}
              </MapView>
            </Animated.View>
            
            {/* Live Status */}
            <Animated.View 
              style={[
                styles.statusSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.statusCard}>
                <Text style={styles.estimatedArrival}>
                  {estimatedArrival || 'Calculating...'}
                </Text>
              </View>
            </Animated.View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  calendarSection: {
    marginBottom: 20,
  },
  selectedDateSection: {
    marginBottom: 20,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  rideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Shadows.sm,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rideInfo: {
    flex: 1,
  },
  rideTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  rideRoute: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  rideStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  ridePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  mapSection: {
    marginBottom: 20,
  },
  map: {
    height: 300,
    borderRadius: 16,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...Shadows.sm,
  },
  estimatedArrival: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});