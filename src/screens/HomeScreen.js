import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, FlatList, Platform, Image, Dimensions } from 'react-native';
import { MapView, Marker } from '../components/MapView';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';

const { width, height } = Dimensions.get('window');

const universities = [
  {
    id: '1',
    name: 'University of Hargeisa',
    shortName: 'UOH',
    latitude: 9.5632,
    longitude: 44.0672,
    city: 'Hargeisa',
    description: 'Premier public university in Somaliland',
    color: Colors.primary,
    gradient: Colors.gradients.ocean,
    image: '🏛️',
    students: '15,000+',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Amoud University',
    shortName: 'AU',
    latitude: 9.4167,
    longitude: 43.6500,
    city: 'Borama',
    description: 'Leading private university in Awdal region',
    color: Colors.secondary,
    gradient: Colors.gradients.forest,
    image: '🎓',
    students: '12,000+',
    rating: 4.6,
  },
  {
    id: '3',
    name: 'Burao University',
    shortName: 'BU',
    latitude: 9.5221,
    longitude: 45.5336,
    city: 'Burao',
    description: 'Growing university in Togdheer region',
    color: Colors.accent,
    gradient: Colors.gradients.accent,
    image: '🏫',
    students: '8,000+',
    rating: 4.4,
  },
  {
    id: '4',
    name: 'Gollis University',
    shortName: 'GU',
    latitude: 9.5632,
    longitude: 44.0672,
    city: 'Hargeisa',
    description: 'Modern private university',
    color: Colors.warning,
    gradient: Colors.gradients.sunset,
    image: '🎯',
    students: '10,000+',
    rating: 4.5,
  },
  {
    id: '5',
    name: 'Edna Adan University',
    shortName: 'EAU',
    latitude: 9.5632,
    longitude: 44.0672,
    city: 'Hargeisa',
    description: 'Specialized in healthcare education',
    color: Colors.error,
    gradient: ['#E74C3C', '#F87171', '#FCA5A5'],
    image: '🏥',
    students: '6,000+',
    rating: 4.7,
  },
];

export default function HomeScreen({ navigation }) {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [showWebFeatures, setShowWebFeatures] = useState(Platform.OS === 'web');
  const mapRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const goToUniversity = (uni) => {
    setSelectedUniversity(uni);
    if (mapRef.current) {
      // On web, we'll just update the selected university
      // On native, we'll animate the map
      if (Platform.OS !== 'web') {
        mapRef.current.animateToRegion(
          {
            latitude: uni.latitude,
            longitude: uni.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000
        );
      }
    }
  };

  // Web-specific enhanced features
  const renderWebFeatures = () => {
    if (!showWebFeatures) return null;
    
    return (
      <Animated.View 
        style={[
          styles.webFeaturesContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.webFeaturesHeader}>
          <Text style={styles.webFeaturesTitle}>🌐 Web-Enhanced Experience</Text>
          <Text style={styles.webFeaturesSubtitle}>Exclusive features for desktop users</Text>
        </View>
        
        <View style={styles.webFeaturesGrid}>
          <View style={styles.webFeatureCard}>
            <Text style={styles.webFeatureIcon}>🎯</Text>
            <Text style={styles.webFeatureTitle}>Interactive Map</Text>
            <Text style={styles.webFeatureDesc}>Click locations to explore universities</Text>
          </View>
          
          <View style={styles.webFeatureCard}>
            <Text style={styles.webFeatureIcon}>📊</Text>
            <Text style={styles.webFeatureTitle}>Real-time Stats</Text>
            <Text style={styles.webFeatureDesc}>Live updates and analytics</Text>
          </View>
          
          <View style={styles.webFeatureCard}>
            <Text style={styles.webFeatureIcon}>🔍</Text>
            <Text style={styles.webFeatureTitle}>Advanced Search</Text>
            <Text style={styles.webFeatureDesc}>Filter and sort options</Text>
          </View>
          
          <View style={styles.webFeatureCard}>
            <Text style={styles.webFeatureIcon}>💻</Text>
            <Text style={styles.webFeatureTitle}>Desktop Optimized</Text>
            <Text style={styles.webFeatureDesc}>Better layout for large screens</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderUniversity = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        })}],
      }}
    >
      <TouchableOpacity
        style={[
          styles.universityCard,
          selectedUniversity?.id === item.id && styles.selectedCard
        ]}
        onPress={() => goToUniversity(item)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={item.gradient}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Glow effect for selected card */}
          {selectedUniversity?.id === item.id && (
            <View style={styles.glowEffect} />
          )}
          
          <View style={styles.cardHeader}>
            <View style={styles.universityIcon}>
              <Text style={styles.iconText}>{item.image}</Text>
            </View>
            <View style={styles.universityInfo}>
              <Text style={styles.universityName}>{item.name}</Text>
              <Text style={styles.universityShortName}>{item.shortName}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {item.rating}</Text>
            </View>
          </View>
          
          <Text style={styles.description}>{item.description}</Text>
          
          <View style={styles.cardFooter}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Students</Text>
                <Text style={styles.statValue}>{item.students}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Location</Text>
                <Text style={styles.statValue}>{item.city}</Text>
              </View>
            </View>
            
            <View style={styles.actionIndicator}>
              <Text style={styles.viewOnMapText}>
                {selectedUniversity?.id === item.id ? '📍 Selected' : '🗺️ View on Map'}
              </Text>
              {selectedUniversity?.id === item.id && (
                <View style={styles.pulseDot} />
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Enhanced Header Section */}
      <LinearGradient
        colors={Colors.gradients.ocean}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoCircleWrapper}>
            <Image 
              source={require('../../assets/splash.png')} 
              style={styles.splashLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.welcomeTagline}>Your Campus Ride, Reimagined</Text>
          <Text style={styles.subtitle}>Connect with reliable drivers across universities</Text>
          <View style={styles.headerDecoration}>
            <View style={styles.decorationDot} />
            <View style={styles.decorationLine} />
            <View style={styles.decorationDot} />
          </View>
        </View>
      </LinearGradient>

      {/* Web-Enhanced Features Section */}
      {renderWebFeatures()}

      {/* Enhanced Map Section */}
      <View style={styles.mapSection}>
        <View style={styles.mapCard}>
          <View style={styles.floatingLabel}>
            <Text style={styles.floatingLabelText}>Explore University Locations</Text>
          </View>
          <View style={styles.mapContainer}>
            <LinearGradient
              colors={['rgba(30,58,138,0.15)', 'rgba(30,58,138,0)']}
              style={styles.mapOverlay}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: 9.6,
                longitude: 44.0,
                latitudeDelta: 2.5,
                longitudeDelta: 2.5,
              }}
            >
              {universities.map((uni, idx) => (
                <Marker
                  key={idx}
                  coordinate={{ latitude: uni.latitude, longitude: uni.longitude }}
                  title={uni.name}
                  description={uni.city}
                  pinColor={uni.color}
                />
              ))}
            </MapView>
            <TouchableOpacity style={styles.fabGlow} activeOpacity={0.85}>
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.fabGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.fabIcon}>🔍</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Enhanced Universities List */}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <View style={styles.listTitleContainer}>
            <Text style={styles.listIcon}>🏛️</Text>
            <Text style={styles.listTitle}>Universities</Text>
          </View>
          <Text style={styles.listSubtitle}>{universities.length} institutions available</Text>
        </View>
        <FlatList
          data={universities}
          keyExtractor={(item) => item.id}
          renderItem={renderUniversity}
          contentContainerStyle={styles.listContainer}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        />
      </View>

      {/* Enhanced Get Started Button */}
      <View style={styles.bottomSection}>
        <View style={styles.buttonShadow} />
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('SignUp')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={Colors.gradients.primary}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonIcon}>🚀</Text>
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoCircleWrapper: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 60,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
    marginBottom: 12,
  },
  splashLogo: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  welcomeTagline: {
    color: Colors.textInverse,
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: Typography.base,
    textAlign: 'center',
    marginBottom: 16,
  },
  mapSection: {
    marginTop: -20,
    paddingHorizontal: Spacing.lg,
    zIndex: 1,
  },
  mapCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: BorderRadius['3xl'],
    padding: 0,
    marginBottom: Spacing.lg,
    ...Shadows.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'visible',
  },
  mapContainer: {
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    position: 'relative',
    minHeight: height * 0.25,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 2,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
  },
  map: {
    width: '100%',
    height: height * 0.25,
    borderRadius: BorderRadius['2xl'],
  },
  listSection: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  listHeader: {
    marginBottom: Spacing.lg,
  },
  listTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  listIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  listTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  listContainer: {
    paddingBottom: Spacing.lg,
  },
  universityCard: {
    marginRight: Spacing.lg,
    borderRadius: BorderRadius['3xl'],
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.95)',
    ...Shadows.lg,
    minWidth: 280,
    maxWidth: 320,
    padding: 0,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectedCard: {
    transform: [{ scale: 1.02 }],
    ...Shadows.xl,
    borderColor: Colors.primary,
  },
  cardGradient: {
    padding: Spacing.lg,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  universityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    ...Shadows.sm,
  },
  iconText: {
    fontSize: 28,
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  universityShortName: {
    fontSize: Typography.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: Typography.semibold,
  },
  ratingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  ratingText: {
    color: Colors.textInverse,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  description: {
    fontSize: Typography.base,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: Spacing.lg,
    lineHeight: Typography.lineHeight.normal,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  cardFooter: {
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  statValue: {
    fontSize: Typography.sm,
    color: Colors.textInverse,
    fontWeight: Typography.semibold,
  },
  actionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewOnMapText: {
    fontSize: Typography.base,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: Typography.semibold,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textInverse,
    marginLeft: 8,
    ...Shadows.sm,
  },
  glowEffect: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    zIndex: -1,
  },
  headerDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 8,
  },
  decorationLine: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1,
  },
  bottomSection: {
    padding: Spacing.lg,
    alignItems: 'center',
    position: 'relative',
  },
  buttonShadow: {
    position: 'absolute',
    bottom: 8,
    left: 40,
    right: 40,
    height: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 25,
    zIndex: -1,
  },
  getStartedButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  buttonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  buttonText: {
    color: Colors.textInverse,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  floatingLabel: {
    position: 'absolute',
    top: -18,
    left: 24,
    backgroundColor: Colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
    zIndex: 10,
  },
  floatingLabelText: {
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  fabGlow: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    ...Shadows.lg,
    zIndex: 10,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 28,
    color: Colors.textInverse,
    fontWeight: Typography.bold,
  },
  webFeaturesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: Spacing.lg,
    borderBottomLeftRadius: BorderRadius['2xl'],
    borderBottomRightRadius: BorderRadius['2xl'],
    ...Shadows.lg,
    zIndex: 10,
  },
  webFeaturesHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  webFeaturesTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  webFeaturesSubtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  webFeaturesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
  },
  webFeatureCard: {
    width: '45%', // Adjust as needed for grid layout
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    alignItems: 'center',
    ...Shadows.sm,
  },
  webFeatureIcon: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  webFeatureTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  webFeatureDesc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
}); 