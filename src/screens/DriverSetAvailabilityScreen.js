import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Switch, StatusBar, Animated, Dimensions, Modal } from 'react-native';
import { ridesAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Areas of Hargeisa
const hargeisaAreas = [
  { name: 'Shacabka', coords: { latitude: 9.5600, longitude: 44.0650 }, type: 'area' },
  { name: 'Siinaay', coords: { latitude: 9.5700, longitude: 44.0700 }, type: 'area' },
  { name: 'New Hargeisa', coords: { latitude: 9.5500, longitude: 44.0600 }, type: 'area' },
  { name: 'Calaamadaha', coords: { latitude: 9.5400, longitude: 44.0550 }, type: 'area' },
  { name: 'Masalaha', coords: { latitude: 9.5800, longitude: 44.0750 }, type: 'area' },
  { name: 'Haaf landhan', coords: { latitude: 9.5300, longitude: 44.0500 }, type: 'area' },
  { name: 'Jameeco weyn', coords: { latitude: 9.5900, longitude: 44.0800 }, type: 'area' },
  { name: '150ka', coords: { latitude: 9.5200, longitude: 44.0900 }, type: 'area' },
  { name: 'Geed goble', coords: { latitude: 9.5100, longitude: 44.0850 }, type: 'area' },
  { name: 'Jigjiga yar', coords: { latitude: 9.5000, longitude: 44.0800 }, type: 'area' },
  { name: 'Macalin Haaruun', coords: { latitude: 9.4900, longitude: 44.0750 }, type: 'area' },
  { name: 'Idaacada', coords: { latitude: 9.4800, longitude: 44.0700 }, type: 'area' },
  { name: 'Badacas', coords: { latitude: 9.4700, longitude: 44.0650 }, type: 'area' },
  { name: 'Xawaadle', coords: { latitude: 9.4600, longitude: 44.0600 }, type: 'area' },
  { name: 'Xero awr', coords: { latitude: 9.4500, longitude: 44.0550 }, type: 'area' },
  { name: 'Shidhka', coords: { latitude: 9.4400, longitude: 44.0500 }, type: 'area' },
  { name: 'Daruuraha', coords: { latitude: 9.4300, longitude: 44.0450 }, type: 'area' },
  { name: 'Hodan hills', coords: { latitude: 9.4200, longitude: 44.0400 }, type: 'area' },
  { name: 'Ina Mooge', coords: { latitude: 9.4100, longitude: 44.0350 }, type: 'area' },
  { name: 'Gantaalaha', coords: { latitude: 9.4000, longitude: 44.0300 }, type: 'area' },
  { name: 'Cabaaye', coords: { latitude: 9.3900, longitude: 44.0250 }, type: 'area' },
  { name: 'Daloodho', coords: { latitude: 9.3800, longitude: 44.0200 }, type: 'area' },
  { name: 'Sheekh Madar', coords: { latitude: 9.3700, longitude: 44.0150 }, type: 'area' },
  { name: 'Saylada', coords: { latitude: 9.3600, longitude: 44.0100 }, type: 'area' },
  { name: 'Isha Boorame', coords: { latitude: 9.3500, longitude: 44.0050 }, type: 'area' },
  { name: 'Daami', coords: { latitude: 9.3400, longitude: 44.0000 }, type: 'area' },
  { name: 'Qudhac dheer', coords: { latitude: 9.3300, longitude: 43.9950 }, type: 'area' },
];

// Universities for destination selection
const hargeisaUniversities = [
  { name: 'University of Hargeisa', coords: { latitude: 9.5632, longitude: 44.0672 }, type: 'university' },
  { name: 'THE UNITY UNIVERSITY', coords: { latitude: 9.5600, longitude: 44.0650 }, type: 'university' },
  { name: 'Admas university', coords: { latitude: 9.5550, longitude: 44.0620 }, type: 'university' },
  { name: 'Gollis University', coords: { latitude: 9.5700, longitude: 44.0700 }, type: 'university' },
  { name: 'New Generation University', coords: { latitude: 9.5500, longitude: 44.0600 }, type: 'university' },
  { name: 'Frantz Fanon University', coords: { latitude: 9.5400, longitude: 44.0550 }, type: 'university' },
  { name: 'Abaarso Tech University', coords: { latitude: 9.5800, longitude: 44.0750 }, type: 'university' },
  { name: 'Addis Ababa medical University college', coords: { latitude: 9.5300, longitude: 44.0500 }, type: 'university' },
  { name: 'Edna Adan University', coords: { latitude: 9.5900, longitude: 44.0800 }, type: 'university' },
  { name: 'Alpha University College', coords: { latitude: 9.5200, longitude: 44.0900 }, type: 'university' },
  { name: 'Shifa University', coords: { latitude: 9.5100, longitude: 44.0850 }, type: 'university' },
  { name: 'Badar university', coords: { latitude: 9.5000, longitude: 44.0800 }, type: 'university' },
];

// Combined locations for destination selection (areas + universities)
const allLocations = [...hargeisaAreas, ...hargeisaUniversities];

export default function DriverSetAvailabilityScreen({ navigation }) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [price, setPrice] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [selectedFromType, setSelectedFromType] = useState('area'); // 'area' or 'university'
  const [selectedToType, setSelectedToType] = useState('area'); // 'area' or 'university'
  const { user } = useApp();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Staggered animations
    Animated.sequence([
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleCreateRide = async () => {
    if (!selectedFrom || !selectedTo || !departureTime || !price || !availableSeats) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const fromLocation = allLocations.find(l => l.name === selectedFrom);
      const toLocation = allLocations.find(l => l.name === selectedTo);

      const rideData = {
        driverId: user.id,
        driverName: user.name,
        vehicle: user.vehicle,
        route: {
          from: selectedFrom,
          to: selectedTo,
          fromCoords: fromLocation.coords,
          toCoords: toLocation.coords,
        },
        departureTime: new Date(departureTime).toISOString(),
        price: parseFloat(price),
        availableSeats: parseInt(availableSeats),
      };

      await ridesAPI.createRide(rideData);
      
      Alert.alert(
        'Success',
        'Ride created successfully! Students can now book your ride.',
        [
          {
            text: 'View Requests',
            onPress: () => navigation.navigate('DriverRequests'),
          },
          {
            text: 'Continue',
            onPress: () => navigation.navigate('DriverBookings'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create ride. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetAvailability = (value) => {
    setIsAvailable(value);
    if (!value) {
      setSelectedFrom('');
      setSelectedTo('');
      setDepartureTime('');
      setPrice('');
      setAvailableSeats('');
    }
  };

  const handleFromSelection = (location) => {
    setSelectedFrom(location.name);
    setSelectedFromType(location.type);
    setShowFromDropdown(false);
  };

  const handleToSelection = (location) => {
    setSelectedTo(location.name);
    setSelectedToType(location.type);
    setShowToDropdown(false);
  };

  const renderDropdown = (isVisible, onClose, onSelect, selectedValue, type, title, isFromDropdown = false) => (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.dropdownContent}>
            {/* Areas Section - Only for "From" dropdown */}
            {isFromDropdown && (
              <View style={styles.dropdownSection}>
                <Text style={styles.dropdownSectionTitle}>Areas of Hargeisa</Text>
                {hargeisaAreas.map((area) => (
                  <TouchableOpacity
                    key={area.name}
                    style={[
                      styles.dropdownItem,
                      selectedValue === area.name && styles.selectedDropdownItem
                    ]}
                    onPress={() => onSelect(area)}
                  >
                    <Ionicons name="location" size={20} color={Colors.primary} />
                    <Text style={[
                      styles.dropdownItemText,
                      selectedValue === area.name && styles.selectedDropdownItemText
                    ]}>
                      {area.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Universities Section - Only for "To" dropdown */}
            {!isFromDropdown && (
              <View style={styles.dropdownSection}>
                <Text style={styles.dropdownSectionTitle}>Universities in Hargeisa</Text>
                {hargeisaUniversities.map((university) => (
                  <TouchableOpacity
                    key={university.name}
                    style={[
                      styles.dropdownItem,
                      selectedValue === university.name && styles.selectedDropdownItem
                    ]}
                    onPress={() => onSelect(university)}
                  >
                    <Ionicons name="school" size={20} color={Colors.accent} />
                    <Text style={[
                      styles.dropdownItemText,
                      selectedValue === university.name && styles.selectedDropdownItemText
                    ]}>
                      {university.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return <LoadingSpinner message="Creating ride..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003B73" />
      
      {/* Header Section */}
      <Animated.View
        style={[
          {
            transform: [{ translateY: headerSlideAnim }],
          },
        ]}
      >
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
                <View style={styles.backButtonContainer}>
                  <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
                </View>
        </TouchableOpacity>
              <Text style={styles.headerTitle}>Set Availability</Text>
              <TouchableOpacity style={styles.helpButton} onPress={() => Alert.alert('Help', 'Select your route and set your availability to start receiving ride requests!')}>
                <Ionicons name="help-circle" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
            {/* Simple Title */}
            <View style={styles.headerTitleSection}>
              <Text style={styles.headerSubtitleText}>Choose pickup and destination in Hargeisa</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      
      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Simple Availability Toggle */}
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityHeader}>
            <Text style={styles.availabilityTitle}>Set as Available</Text>
            <Switch
              value={isAvailable}
              onValueChange={handleSetAvailability}
              trackColor={{ false: Colors.gray300, true: Colors.primary }}
              thumbColor={isAvailable ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          <Text style={styles.availabilitySubtext}>
            {isAvailable ? 'Students can see and book your rides' : 'Enable to start receiving ride requests'}
          </Text>
        </View>

        {isAvailable && (
          <>
            {/* Route Selection with Dropdowns */}
            <View style={styles.routeCard}>
              <Text style={styles.sectionTitle}>Route Information</Text>
              
              {/* From Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>From (Pickup Location)</Text>
                  <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowFromDropdown(true)}
                >
                  <View style={styles.dropdownButtonContent}>
                    <Ionicons 
                      name="location" 
                      size={20} 
                      color={selectedFrom ? Colors.primary : Colors.textTertiary} 
                    />
                    <Text style={[
                      styles.dropdownButtonText,
                      !selectedFrom && styles.placeholderText
                    ]}>
                      {selectedFrom || 'Select pickup location'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={Colors.textTertiary} />
                  </View>
                  </TouchableOpacity>
              </View>

              {/* To Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>To (Destination)</Text>
                  <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowToDropdown(true)}
                >
                  <View style={styles.dropdownButtonContent}>
                    <Ionicons 
                      name="school" 
                      size={20} 
                      color={selectedTo ? Colors.primary : Colors.textTertiary} 
                    />
                    <Text style={[
                      styles.dropdownButtonText,
                      !selectedTo && styles.placeholderText
                    ]}>
                      {selectedTo || 'Select destination'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={Colors.textTertiary} />
                  </View>
                  </TouchableOpacity>
              </View>

              {/* Selected Route Display */}
              {(selectedFrom || selectedTo) && (
                <View style={styles.selectedRouteDisplay}>
                  <View style={styles.routePoint}>
                    <Ionicons name="arrow-up" size={16} color={Colors.primary} />
                    <Text style={styles.routePointText}>
                      {selectedFrom || 'Select pickup location'}
                    </Text>
                  </View>
                  <View style={styles.routeLine} />
                  <View style={styles.routePoint}>
                    <Ionicons name="arrow-down" size={16} color={Colors.accent} />
                    <Text style={styles.routePointText}>
                      {selectedTo || 'Select destination'}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Simple Ride Details */}
            <View style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>Ride Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Departure Date & Time</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD HH:MM (e.g., 2024-01-15 08:30)"
                  placeholderTextColor={Colors.textTertiary}
                value={departureTime}
                onChangeText={setDepartureTime}
              />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Price per Seat ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="25"
                  placeholderTextColor={Colors.textTertiary}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Available Seats</Text>
              <TextInput
                style={styles.input}
                placeholder="4"
                  placeholderTextColor={Colors.textTertiary}
                value={availableSeats}
                onChangeText={setAvailableSeats}
                keyboardType="numeric"
              />
              </View>
            </View>

            {/* Simple Vehicle Information */}
            <View style={styles.vehicleCard}>
              <Text style={styles.sectionTitle}>Vehicle Information</Text>
              
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleText}>
                  <Text style={styles.vehicleLabel}>Model:</Text> {user.vehicle?.model || 'Not specified'}
                </Text>
                <Text style={styles.vehicleText}>
                  <Text style={styles.vehicleLabel}>Plate:</Text> {user.vehicle?.plate || 'Not specified'}
                </Text>
                <Text style={styles.vehicleText}>
                  <Text style={styles.vehicleLabel}>Color:</Text> {user.vehicle?.color || 'Not specified'}
                </Text>
                <Text style={styles.vehicleText}>
                  <Text style={styles.vehicleLabel}>Capacity:</Text> {user.vehicle?.capacity || 'Not specified'} seats
                </Text>
              </View>
            </View>

            {/* Simple Create Ride Button */}
            <TouchableOpacity 
              style={styles.createButton} 
              onPress={handleCreateRide}
            >
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.createButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="add-circle" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.createButtonText}>Create Ride</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.bottomSpacer} />
          </>
        )}
      </ScrollView>

      {/* Dropdown Modals */}
      {renderDropdown(
        showFromDropdown,
        () => setShowFromDropdown(false),
        handleFromSelection,
        selectedFrom,
        selectedFromType,
        'Select Pickup Location',
        true // isFromDropdown
      )}

      {renderDropdown(
        showToDropdown,
        () => setShowToDropdown(false),
        handleToSelection,
        selectedTo,
        selectedToType,
        'Select Destination',
        false // isFromDropdown
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Header Styles
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Shadows.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  backButton: {
    padding: 4,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Simple Header Title
  headerTitleSection: {
    alignItems: 'center',
    width: '100%',
  },
  headerTitleText: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitleText: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 25,
    paddingBottom: 180,
  },
  
  // Simple Availability Card
  availabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...Shadows.sm,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  availabilityTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  availabilitySubtext: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  
  // Simple Route Card
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  
  // Simple Selected Route Display
  selectedRouteDisplay: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  routePointText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: Colors.gray300,
    marginLeft: 12,
    marginVertical: 4,
  },
  
  // Dropdown Styles
  dropdownButton: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Shadows.sm,
  },
  dropdownButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dropdownButtonText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  placeholderText: {
    color: Colors.textTertiary,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    ...Shadows.lg,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  dropdownTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownContent: {
    maxHeight: 400,
  },
  dropdownSection: {
    padding: 20,
  },
  dropdownSectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    marginBottom: 12,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.surfaceSecondary,
  },
  selectedDropdownItem: {
    backgroundColor: Colors.primary + '15',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dropdownItemText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  selectedDropdownItemText: {
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },
  
  // Simple Details Card
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...Shadows.sm,
  },
  
  // Simple Input Groups
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  
  // Simple Vehicle Card
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...Shadows.sm,
  },
  vehicleInfo: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
  },
  vehicleText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  vehicleLabel: {
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  
  // Simple Create Button
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.md,
  },
  createButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 12,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  bottomSpacer: {
    height: 40,
  },
}); 