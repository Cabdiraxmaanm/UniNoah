import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Animated, Text } from 'react-native';
import { Colors, Shadows } from '../styles/DesignSystem';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function StudentMapScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedRide, setSelectedRide] = useState(null);
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Mock ride data for university rides
  const universityRides = [
    { 
      id: 1, 
      driver: 'Ahmed Ali', 
      destination: 'University Main Gate', 
      price: '$3', 
      time: '5 min' 
    },
    { 
      id: 2, 
      driver: 'Sara Mohamed', 
      destination: 'University Library', 
      price: '$4', 
      time: '8 min' 
    },
    { 
      id: 3, 
      driver: 'Omar Hassan', 
      destination: 'University Campus', 
      price: '$5', 
      time: '12 min' 
    },
    { 
      id: 4, 
      driver: 'Fadumo Ali', 
      destination: 'University Dorms', 
      price: '$3', 
      time: '6 min' 
    },
    { 
      id: 5, 
      driver: 'Mohamed Jama', 
      destination: 'University Sports Center', 
      price: '$4', 
      time: '10 min' 
    },
  ];

  const handleRidePress = (ride) => {
    setSelectedRide(selectedRide?.id === ride.id ? null : ride);
  };

  const handleBookRide = (ride) => {
    navigation.navigate('StudentBookRide', { ride });
  };

  const handleLocateUser = () => {
    // Web fallback - could show user's general area
    console.log('Locate user - Web version');
  };

  const handleRefreshRides = () => {
    // In a real app, this would fetch new ride data
    setSelectedRide(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      {/* Web Map Interface */}
      <Animated.View style={[styles.mapContainer, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={[Colors.primaryLight + '15', Colors.primary + '08', Colors.accent + '05']}
          style={styles.webMapGradient}
        >
          <View style={styles.webMapContent}>
            <Ionicons name="map" size={64} color={Colors.primary} style={styles.webMapIcon} />
            <Text style={styles.webMapTitle}>Interactive Map</Text>
            <Text style={styles.webMapSubtitle}>Available on mobile devices</Text>
            <Text style={styles.webMapNote}>Download the mobile app to view real-time ride locations</Text>
          </View>

          {/* Mock Markers for Web */}
          <View style={styles.webMarkers}>
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

      {/* Minimal Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.controlButton} onPress={handleLocateUser}>
          <Ionicons name="locate" size={20} color={Colors.primary} />
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
});
