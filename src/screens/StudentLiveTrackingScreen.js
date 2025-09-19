import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from '../components/MapView';
import { locationAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';

export default function StudentLiveTrackingScreen({ navigation, route }) {
  const { booking } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState(null);
  const [estimatedArrival, setEstimatedArrival] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const mapRef = useRef(null);
  const { user } = useApp();

  useEffect(() => {
    initializeTracking();
    const interval = setInterval(updateDriverLocation, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

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

      // Calculate estimated arrival
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

  if (isLoading) {
    return <LoadingSpinner message="Initializing tracking..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Live Tracking" showBack onBack={() => navigation.goBack()} />
      
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
          {/* Pickup location marker */}
          <Marker
            coordinate={booking.route.fromCoords}
            title="Pickup Location"
            description={booking.route.from}
            pinColor="#0074D9"
          />
          
          {/* Destination marker */}
          <Marker
            coordinate={booking.route.toCoords}
            title="Destination"
            description={booking.route.to}
            pinColor="#2ECC40"
          />
          
          {/* Driver location marker */}
          {driverLocation && (
            <Marker
              coordinate={driverLocation}
              title="Driver Location"
              description={booking.driverName}
              pinColor="#F39C12"
            />
          )}
          
          {/* Route line */}
          {routeInfo && (
            <Polyline
              coordinates={routeInfo.coordinates}
              strokeColor="#0074D9"
              strokeWidth={3}
            />
          )}
        </MapView>
      </View>

      <View style={styles.infoPanel}>
        <View style={styles.rideInfo}>
          <Text style={styles.routeText}>
            {booking.route.from} → {booking.route.to}
          </Text>
          <Text style={styles.timeText}>
            Departure: {formatTime(booking.departureTime)}
          </Text>
          <Text style={styles.estimatedText}>
            {estimatedArrival}
          </Text>
        </View>

        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{booking.driverName}</Text>
          <Text style={styles.vehicleInfo}>
            {booking.vehicle?.model || 'Vehicle'} • {booking.vehicle?.plate || 'Plate'}
          </Text>
        </View>

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

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactDriver}>
            <Text style={styles.contactButtonText}>Contact Driver</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRide}>
            <Text style={styles.cancelButtonText}>Cancel Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faff',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoPanel: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  rideInfo: {
    marginBottom: 16,
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003B73',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  estimatedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0074D9',
  },
  driverInfo: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8faff',
    borderRadius: 8,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003B73',
    marginBottom: 2,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
  },
  routeDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#0074D9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 