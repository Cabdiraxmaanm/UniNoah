import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem';

const MapView = React.forwardRef(({ children, style, initialRegion, ...props }, ref) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    // Add click animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleZoom = (direction) => {
    const newZoom = direction === 'in' ? Math.min(zoomLevel + 0.5, 3) : Math.max(zoomLevel - 0.5, 0.5);
    setZoomLevel(newZoom);
  };

  return (
    <Animated.View 
      ref={ref} 
      style={[
        styles.mapContainer, 
        style,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
      {...props}
    >
      {/* Simplified Map Background */}
      <View style={styles.mapBackground}>
        {/* Simple Grid Pattern */}
        <View style={styles.gridContainer}>
          {Array.from({ length: 12 }).map((_, index) => (
            <View key={index} style={[styles.gridLine, { opacity: 0.1 + (index % 3) * 0.1 }]} />
          ))}
        </View>
        
        {/* Simple Floating Elements */}
        <View style={styles.floatingElements}>
          <View style={[styles.floatingIcon, styles.floatingIcon1]}>🏛️</View>
          <View style={[styles.floatingIcon, styles.floatingIcon2]}>🚗</View>
          <View style={[styles.floatingIcon, styles.floatingIcon3]}>📍</View>
        </View>

        {/* Simple Hotspots */}
        <TouchableOpacity 
          style={[styles.hotspot, styles.hotspot1]} 
          onPress={() => handleLocationClick({ name: 'University of Hargeisa', type: 'university' })}
        >
          <View style={styles.hotspotDot} />
          <Text style={styles.hotspotLabel}>Hargeisa</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.hotspot, styles.hotspot2]} 
          onPress={() => handleLocationClick({ name: 'Amoud University', type: 'university' })}
        >
          <View style={styles.hotspotDot} />
          <Text style={styles.hotspotLabel}>Borama</Text>
        </TouchableOpacity>
      </View>

      {/* Simple Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.controlButton} onPress={() => handleZoom('in')}>
          <Text style={styles.controlIcon}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => handleZoom('out')}>
          <Text style={styles.controlIcon}>-</Text>
        </TouchableOpacity>
      </View>

      {/* Simple Map Header */}
      <View style={styles.mapHeader}>
        <Text style={styles.mapTitle}>🗺️ Map View</Text>
        <Text style={styles.mapSubtitle}>Zoom: {zoomLevel.toFixed(1)}x</Text>
      </View>

      {/* Simple Location Info Panel */}
      {selectedLocation && (
        <Animated.View style={styles.locationPanel}>
          <Text style={styles.locationName}>{selectedLocation.name}</Text>
          <Text style={styles.locationDescription}>
            Click to view available rides
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
});

const Marker = ({ coordinate, title, description, pinColor, ...props }) => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const handlePress = () => {
    setIsPressed(true);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => setIsPressed(false));
  };

  return (
    <Animated.View 
      style={[
        styles.marker, 
        { transform: [{ scale: scaleAnim }] },
        props.style
      ]}
      {...props}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={[styles.markerPin, { backgroundColor: pinColor || Colors.primary }]}>
          <Text style={styles.markerIcon}>📍</Text>
        </View>
        {title && (
          <View style={styles.markerLabel}>
            <Text style={styles.markerTitle}>{title}</Text>
            {description && (
              <Text style={styles.markerDescription}>{description}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const Polyline = ({ coordinates, ...props }) => {
  return (
    <View style={styles.polyline} {...props}>
      <View style={styles.polylineLine} />
      <Text style={styles.polylineText}>Route Line</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceSecondary,
    position: 'relative',
    ...Shadows.lg,
  },
  mapBackground: {
    minHeight: 300,
    position: 'relative',
    backgroundColor: Colors.surfaceSecondary,
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    opacity: 0.1,
    height: 1,
    width: '100%',
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingIcon: {
    position: 'absolute',
    fontSize: 20,
    opacity: 0.6,
  },
  floatingIcon1: { top: '20%', left: '15%' },
  floatingIcon2: { top: '60%', right: '20%' },
  floatingIcon3: { bottom: '30%', left: '25%' },
  hotspot: {
    position: 'absolute',
    alignItems: 'center',
  },
  hotspot1: { top: '25%', left: '20%' },
  hotspot2: { top: '65%', right: '25%' },
  hotspotDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.error,
    borderWidth: 2,
    borderColor: Colors.white,
    ...Shadows.md,
  },
  hotspotLabel: {
    marginTop: 4,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  mapControls: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
    gap: Spacing.sm,
  },
  controlButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  controlIcon: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  mapHeader: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  mapTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  mapSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  locationPanel: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  locationName: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  locationDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  markerIcon: {
    fontSize: 16,
  },
  markerLabel: {
    backgroundColor: Colors.white,
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    minWidth: 100,
    alignItems: 'center',
  },
  markerTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  markerDescription: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  polyline: {
    position: 'absolute',
    alignItems: 'center',
  },
  polylineLine: {
    width: 80,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  polylineText: {
    color: Colors.primary,
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    marginTop: 4,
  },
});

export default MapView;
export { Marker, Polyline, MapView };


