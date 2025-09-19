import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, Polyline } from '../components/MapView';
import { locationAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';

export default function DriverNavigationScreen({ navigation, route }) {
  const { booking } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const mapRef = useRef(null);
  const { user } = useApp();

  useEffect(() => {
    initializeNavigation();
    const interval = setInterval(updateLocation, 15000);
    return () => clearInterval(interval);
  }, []);

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

  const handleArrivedPickup = () => {
    Alert.alert(
      'Arrived at Pickup',
      'Mark that you have arrived at the pickup location?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Arrived', 
          onPress: () => {
            Alert.alert('Success', 'Passenger has been notified that you have arrived.');
          }
        }
      ]
    );
  };

  const handleArrivedDestination = () => {
    Alert.alert(
      'Arrived at Destination',
      'Mark that you have arrived at the destination?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Arrived', 
          onPress: () => {
            Alert.alert('Success', 'Ride completed!');
            navigation.goBack();
          }
        }
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Initializing navigation..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Navigation" showBack onBack={() => navigation.goBack()} />
      
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: booking.route.fromCoords.latitude,
            longitude: booking.route.fromCoords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={booking.route.fromCoords}
            title="Pickup Location"
            description={booking.route.from}
            pinColor={Colors.primary}
          />
          
          <Marker
            coordinate={booking.route.toCoords}
            title="Destination"
            description={booking.route.to}
            pinColor={Colors.secondary}
          />
          
          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="Your Location"
              description="Driver"
              pinColor={Colors.accent}
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

      <View style={styles.infoPanel}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
          style={styles.panelGradient}
        >
          {/* Ride Info */}
          <View style={styles.rideInfo}>
            <View style={styles.routeContainer}>
              <View style={styles.routeLine}>
                <View style={styles.locationDot} />
                <Text style={styles.routeText}>{booking.route.from}</Text>
              </View>
              <View style={styles.routeLine}>
                <View style={[styles.locationDot, styles.destinationDot]} />
                <Text style={styles.routeText}>{booking.route.to}</Text>
              </View>
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.departureText}>
                Departure: {formatTime(booking.departureTime)}
              </Text>
              {estimatedTime && (
                <Text style={styles.estimatedText}>
                  ⏱️ {estimatedTime}
                </Text>
              )}
            </View>
          </View>

          {/* Passenger Info */}
          <View style={styles.passengerInfo}>
            <View style={styles.passengerAvatar}>
              <Text style={styles.passengerInitial}>{booking.passengerName.charAt(0)}</Text>
            </View>
            <View style={styles.passengerDetails}>
              <Text style={styles.passengerName}>{booking.passengerName}</Text>
              <Text style={styles.passengerPhone}>{booking.passengerPhone}</Text>
            </View>
            <TouchableOpacity style={styles.contactButton} onPress={handleContactPassenger}>
              <Text style={styles.contactButtonText}>📞</Text>
            </TouchableOpacity>
          </View>

          {/* Route Details */}
          <View style={styles.routeDetails}>
            {routeInfo && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Distance:</Text>
                  <Text style={styles.detailValue}>{routeInfo.distance}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Duration:</Text>
                  <Text style={styles.detailValue}>{routeInfo.duration}</Text>
                </View>
              </>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Price:</Text>
              <Text style={styles.detailValue}>${booking.price}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.arrivedButton} onPress={handleArrivedPickup}>
              <LinearGradient
                colors={Colors.gradients.accent}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>📍 Arrived at Pickup</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.destinationButton} onPress={handleArrivedDestination}>
              <LinearGradient
                colors={Colors.gradients.secondary}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>✅ Arrived at Destination</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoPanel: {
    backgroundColor: 'transparent',
    padding: Spacing.lg,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    ...Shadows.lg,
  },
  panelGradient: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
  },
  rideInfo: {
    marginBottom: Spacing.lg,
  },
  routeContainer: {
    marginBottom: Spacing.md,
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
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  departureText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  estimatedText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  passengerInfo: {
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
  passengerDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  passengerPhone: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  contactButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  contactButtonText: {
    fontSize: 20,
    color: Colors.textInverse,
  },
  routeDetails: {
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  detailValue: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },
  actionButtons: {
    gap: Spacing.md,
  },
  arrivedButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  destinationButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  buttonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.textInverse,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
}); 