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

export default function DriverNavigationScreen({ navigation, route }) {
  const { booking } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'navigation'
  const mapRef = useRef(null);
  const { user } = useApp();

  useEffect(() => {
    loadAllBookings();
    if (viewMode === 'navigation') {
      initializeNavigation();
      const interval = setInterval(updateLocation, 15000);
      return () => clearInterval(interval);
    }
  }, [viewMode]);

  const loadAllBookings = async () => {
    try {
      const bookings = await bookingsAPI.getBookings(user.id, 'driver');
      setAllBookings(bookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const initializeNavigation = async () => {
    try {
      setIsLoading(true);
      
      const routeData = await locationAPI.getRoute(
        booking.route.fromCoords,
        booking.route.toCoords
      );
      setRouteInfo(routeData);

      const location = await locationAPI.getCurrentLocation();
      setCurrentLocation(location);

      setEstimatedTime(routeData.duration);

    } catch (error) {
      console.error('Error initializing navigation:', error);
      Alert.alert('Error', 'Failed to initialize navigation');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocation = async () => {
    try {
      const newLocation = await locationAPI.getCurrentLocation();
      setCurrentLocation(newLocation);
    } catch (error) {
      console.error('Error updating location:', error);
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

  const handleContactPassenger = () => {
    Alert.alert(
      'Contact Passenger',
      `Call ${booking.passengerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling passenger...') }
      ]
    );
  };

  const handleCompleteRide = () => {
    Alert.alert(
      'Complete Ride',
      'Mark this ride as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete', 
          onPress: () => {
            // Handle ride completion
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
    setViewMode(viewMode === 'calendar' ? 'navigation' : 'calendar');
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
    return <LoadingSpinner message="Initializing navigation..." />;
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
              {viewMode === 'calendar' ? 'Monthly Schedule' : 'Navigation'}
            </Text>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={toggleViewMode}
            >
              <Ionicons 
                name={viewMode === 'calendar' ? 'navigate' : 'calendar'} 
                size={24} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
          
          {/* Quick Stats */}
          <View style={styles.statsCard}>
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
          </View>
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
            <View style={styles.calendarSection}>
              <MonthlyTrackingCalendar
                bookings={allBookings}
                userType="driver"
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </View>

            {/* Selected Date Details */}
            {selectedDate && (
              <View style={styles.selectedDateSection}>
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
                        <Text style={styles.passengerName}>
                          Passenger: {ride.passengerName}
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
              </View>
            )}
          </>
        ) : (
          <>
            {/* Navigation View */}
            <View style={styles.mapSection}>
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
                {currentLocation && (
                  <Marker
                    coordinate={currentLocation}
                    title="Your Location"
                    description="Current position"
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
            </View>
            
            {/* Navigation Info */}
            <View style={styles.navigationSection}>
              <View style={styles.navigationCard}>
                <View style={styles.passengerInfo}>
                  <View style={styles.passengerAvatar}>
                    <Text style={styles.passengerInitial}>
                      {booking.passengerName.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.passengerDetails}>
                    <Text style={styles.passengerName}>{booking.passengerName}</Text>
                    <Text style={styles.passengerPhone}>{booking.passengerPhone}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={handleContactPassenger}
                  >
                    <Ionicons name="call" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.routeInfo}>
                  <View style={styles.routeItem}>
                    <View style={styles.routeDot} />
                    <Text style={styles.routeText}>{booking.route.from}</Text>
                  </View>
                  <View style={styles.routeLine} />
                  <View style={styles.routeItem}>
                    <View style={[styles.routeDot, styles.routeDotDestination]} />
                    <Text style={styles.routeText}>{booking.route.to}</Text>
                  </View>
                </View>
                
                <View style={styles.navigationInfo}>
                  <View style={styles.navigationItem}>
                    <Ionicons name="time" size={16} color={Colors.textSecondary} />
                    <Text style={styles.navigationText}>
                      Departure: {formatTime(booking.departureTime)}
                    </Text>
                  </View>
                  <View style={styles.navigationItem}>
                    <Ionicons name="navigate" size={16} color={Colors.primary} />
                    <Text style={styles.navigationText}>
                      ETA: {estimatedTime || 'Calculating...'}
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.completeButton}
                  onPress={handleCompleteRide}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.completeButtonText}>Complete Ride</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    marginBottom: 4,
  },
  passengerName: {
    fontSize: 12,
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
  navigationSection: {
    marginBottom: 20,
  },
  navigationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    ...Shadows.sm,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  passengerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  passengerInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  passengerDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  passengerPhone: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeInfo: {
    marginBottom: 20,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    marginRight: 12,
  },
  routeDotDestination: {
    backgroundColor: Colors.error,
  },
  routeText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.gray300,
    marginLeft: 5,
    marginBottom: 8,
  },
  navigationInfo: {
    marginBottom: 20,
  },
  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  navigationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    borderRadius: 12,
    padding: 16,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});