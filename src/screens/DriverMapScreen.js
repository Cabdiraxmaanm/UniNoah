import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Animated, Text, Platform } from 'react-native';
import { Colors, Shadows } from '../styles/DesignSystem';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../utils/AppContext';

const { width, height } = Dimensions.get('window');

// Import platform-specific MapView components
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from '../components/MapView';

export default function DriverMapScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedRide, setSelectedRide] = useState(null);
  const mapRef = useRef(null);
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Mock ride data for university rides in Somaliland
  const universityRides = [
    { 
      id: 1, 
      driver: 'Ahmed Ali', 
      destination: 'University of Hargeisa Main Gate', 
      price: '25 SL', 
      time: '5 min' 
    },
    { 
      id: 2, 
      driver: 'Sara Mohamed', 
      destination: 'Amoud University Library', 
      price: '30 SL', 
      time: '8 min' 
    },
    { 
      id: 3, 
      driver: 'Omar Hassan', 
      destination: 'Gollis University Campus', 
      price: '35 SL', 
      time: '12 min' 
    },
    { 
      id: 4, 
      driver: 'Fadumo Ali', 
      destination: 'Hargeisa University Dorms', 
      price: '25 SL', 
      time: '6 min' 
    },
    { 
      id: 5, 
      driver: 'Mohamed Jama', 
      destination: 'Burao University Campus', 
      price: '40 SL', 
      time: '15 min' 
    },
  ];

  // User location (current position in Somaliland)
  const userLocation = {
    latitude: 9.5600,
    longitude: 44.0650,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  };

  // University location (destination in Somaliland)
  const universityLocation = {
    latitude: 9.5500,
    longitude: 44.0500,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  };

  // Ride locations based on mock data (around Somaliland)
  const rideLocations = [
    { ...universityRides[0], latitude: 9.5580, longitude: 44.0620 },
    { ...universityRides[1], latitude: 9.5520, longitude: 44.0680 },
    { ...universityRides[2], latitude: 9.5640, longitude: 44.0580 },
    { ...universityRides[3], latitude: 9.5480, longitude: 44.0720 },
    { ...universityRides[4], latitude: 9.5620, longitude: 44.0540 },
  ];

  const handleRidePress = (ride) => {
    setSelectedRide(selectedRide?.id === ride.id ? null : ride);
  };

  const handleBookRide = (ride) => {
    navigation.navigate('DriverNavigation', { ride });
  };

  const handleLocateUser = () => {
    // Center on user location
    if (mapRef.current) {
      mapRef.current.animateToRegion(userLocation, 1000);
    }
  };

  const handleRefreshRides = () => {
    // In a real app, this would fetch new ride data
    setSelectedRide(null);
  };

  const centerOnUniversity = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(universityLocation, 1000);
    }
  };

  // Fallback for web or if react-native-maps is not available
  if (Platform.OS === 'web' || !MapView) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#003B73" />
        
        {/* Mock Map Interface */}
        <Animated.View style={[styles.mapContainer, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={[Colors.primaryLight + '15', Colors.primary + '08', Colors.accent + '05']}
            style={styles.webMapGradient}
          >
            <View style={styles.webMapContent}>
              <Ionicons name="map" size={64} color={Colors.primary} style={styles.webMapIcon} />
              <Text style={styles.webMapTitle}>Interactive Map View</Text>
              <Text style={styles.webMapSubtitle}>Tap on markers to see ride details</Text>
            </View>

            {/* Mock Markers */}
            <View style={styles.webMarkers}>
              {/* User Location */}
              <View style={[styles.userLocationMarker, { position: 'absolute', top: '45%', left: '30%', marginLeft: -30 }]}>
                <View style={styles.userLocationPulse}>
                  <View style={styles.userLocationDot}>
                    <Ionicons name="person" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </View>
              
              {/* University */}
              <View style={[styles.universityMarker, { position: 'absolute', top: '25%', left: '50%', marginLeft: -25 }]}>
                <Ionicons name="school" size={24} color={Colors.primary} />
              </View>
              {universityRides.map((ride, index) => (
                <TouchableOpacity
                  key={ride.id}
                  style={[
                    styles.rideMarker,
                    {
                      position: 'absolute',
                      top: `${30 + index * 15}%`,
                      left: `${20 + index * 20}%`,
                    },
                    selectedRide?.id === ride.id && styles.selectedRideMarker
                  ]}
                  onPress={() => handleRidePress(ride)}
                >
                  <Ionicons 
                    name="car" 
                    size={18} 
                    color={selectedRide?.id === ride.id ? "#FFFFFF" : Colors.primary} 
                  />
                  {selectedRide?.id === ride.id && (
                    <View style={styles.rideTooltip}>
                      <TouchableOpacity
                        style={styles.bookNowButton}
                        onPress={() => handleBookRide(ride)}
                      >
                        <LinearGradient
                          colors={Colors.gradients.primary}
                          style={styles.bookNowGradient}
                        >
                          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Enhanced Floating Controls */}
        <View style={styles.enhancedMapControls}>
          <TouchableOpacity style={styles.enhancedControlButton} onPress={handleLocateUser}>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primary]}
              style={styles.controlGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="locate" size={22} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.enhancedControlButton} onPress={handleRefreshRides}>
            <LinearGradient
              colors={[Colors.accent, Colors.accentDark]}
              style={styles.controlGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="refresh" size={22} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.enhancedControlButton} onPress={centerOnUniversity}>
            <LinearGradient
              colors={[Colors.secondary, Colors.secondaryDark]}
              style={styles.controlGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="school" size={22} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Real Google Maps for mobile
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003B73" />
      
      {/* Google Map */}
      <Animated.View style={[styles.mapContainer, { opacity: fadeAnim }]}>
        <MapView
          ref={mapRef}
          style={styles.googleMap}
          provider={PROVIDER_GOOGLE}
          initialRegion={userLocation}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={false}
          showsBuildings={true}
          showsTraffic={false}
          showsIndoors={false}
          mapType="standard"
        >
          {/* User Location Marker */}
          <Marker
            coordinate={userLocation}
            title="Your Location"
            description="You are here"
          >
            <View style={styles.userLocationMarker}>
              <View style={styles.userLocationPulse}>
                <View style={styles.userLocationDot}>
                  <Ionicons name="person" size={16} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </Marker>

          {/* University Marker */}
          <Marker
            coordinate={universityLocation}
            title="University"
            description="Your destination"
          >
            <View style={styles.universityMarker}>
              <Ionicons name="school" size={24} color={Colors.primary} />
            </View>
          </Marker>

          {/* Ride Markers */}
          {rideLocations.map((ride, index) => (
            <Marker
              key={ride.id}
              coordinate={{ latitude: ride.latitude, longitude: ride.longitude }}
              title={`${ride.driver}`}
              description={`${ride.destination} • ${ride.price} • ${ride.time}`}
              onPress={() => handleRidePress(ride)}
            >
              <View style={[
                styles.rideMarker,
                selectedRide?.id === ride.id && styles.selectedRideMarker
              ]}>
                <Ionicons 
                  name="car" 
                  size={18} 
                  color={selectedRide?.id === ride.id ? "#FFFFFF" : Colors.primary} 
                />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Selected Ride Info Overlay */}
        {selectedRide && (
          <View style={styles.rideInfoOverlay}>
            <View style={styles.rideInfoCard}>
              <Text style={styles.rideDriverName}>{selectedRide.driver}</Text>
              <Text style={styles.rideDestination}>{selectedRide.destination}</Text>
              <View style={styles.rideDetails}>
                <Text style={styles.ridePrice}>{selectedRide.price}</Text>
                <Text style={styles.rideTime}>{selectedRide.time}</Text>
              </View>
              <TouchableOpacity
                style={styles.bookRideButton}
                onPress={() => handleBookRide(selectedRide)}
              >
                <LinearGradient
                  colors={Colors.gradients.primary}
                  style={styles.bookRideGradient}
                >
                  <Text style={styles.bookRideText}>Book Ride</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Floating Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.controlButton} onPress={handleLocateUser}>
          <Ionicons name="locate" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={centerOnUniversity}>
          <Ionicons name="school" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleRefreshRides}>
          <Ionicons name="refresh" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingBottom: 150,
  },
  
  // Full Screen Map
  mapContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  
  // Google Maps
  googleMap: {
    flex: 1,
    width: width,
    height: height,
  },

  // User Location Marker
  userLocationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationPulse: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.success + '30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.success + '60',
  },
  userLocationDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  // University Marker (Destination)
  universityMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.xl,
    borderWidth: 3,
    borderColor: Colors.primary,
  },

  // Ride Markers
  rideMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  selectedRideMarker: {
    backgroundColor: Colors.primary,
    borderColor: Colors.accent,
    borderWidth: 3,
  },

  // Ride Tooltip (when selected)
  rideTooltip: {
    position: 'absolute',
    top: -50,
    left: -10,
    alignItems: 'center',
  },
  bookNowButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadows.md,
  },
  bookNowGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Map Controls
  mapControls: {
    position: 'absolute',
    top: 60,
    right: 20,
    gap: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },

  // Web Map Fallback Styles
  webMapGradient: {
    flex: 1,
    position: 'relative',
  },
  webMapContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  webMapIcon: {
    marginBottom: 20,
    opacity: 0.8,
  },
  webMapTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  webMapSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  webMapNote: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  webMarkers: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  // Ride Info Overlay (for Google Maps)
  rideInfoOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  rideInfoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    ...Shadows.xl,
    borderWidth: 1,
    borderColor: Colors.primary + '15',
  },
  rideDriverName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  rideDestination: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
    fontWeight: '500',
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ridePrice: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  rideTime: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  bookRideButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Shadows.md,
  },
  bookRideGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  bookRideText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  // Enhanced Map Controls
  enhancedMapControls: {
    position: 'absolute',
    top: 60,
    right: 20,
    gap: 12,
  },
  enhancedControlButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  controlGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
