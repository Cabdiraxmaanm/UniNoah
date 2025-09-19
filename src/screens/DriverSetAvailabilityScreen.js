import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Switch } from 'react-native';
import { ridesAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const universities = [
  { name: 'University of Hargeisa', coords: { latitude: 9.5632, longitude: 44.0672 } },
  { name: 'Amoud University', coords: { latitude: 9.4167, longitude: 43.6500 } },
  { name: 'Burao University', coords: { latitude: 9.5221, longitude: 45.5336 } },
  { name: 'Gollis University', coords: { latitude: 9.5632, longitude: 44.0672 } },
  { name: 'Edna Adan University', coords: { latitude: 9.5632, longitude: 44.0672 } },
];

export default function DriverSetAvailabilityScreen({ navigation }) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [price, setPrice] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useApp();

  const handleCreateRide = async () => {
    if (!selectedFrom || !selectedTo || !departureTime || !price || !availableSeats) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const fromUniversity = universities.find(u => u.name === selectedFrom);
      const toUniversity = universities.find(u => u.name === selectedTo);

      const rideData = {
        driverId: user.id,
        driverName: user.name,
        vehicle: user.vehicle,
        route: {
          from: selectedFrom,
          to: selectedTo,
          fromCoords: fromUniversity.coords,
          toCoords: toUniversity.coords,
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

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignUp' }],
            });
          }
        }
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Creating ride..." />;
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Set Availability" 
        showLogout={true}
        onLogout={handleLogout}
      />
      
      {/* Navigation Menu */}
      <View style={styles.navMenu}>
        <TouchableOpacity 
          style={[styles.navButton, styles.activeNavButton]} 
          onPress={() => navigation.navigate('DriverSetAvailability')}
        >
          <Text style={[styles.navButtonText, styles.activeNavButtonText]}>Set Availability</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('DriverRequests')}
        >
          <Text style={styles.navButtonText}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('DriverBookings')}
        >
          <Text style={styles.navButtonText}>Bookings</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityRow}>
            <Text style={styles.availabilityText}>Set as Available</Text>
            <Switch
              value={isAvailable}
              onValueChange={handleSetAvailability}
              trackColor={{ false: Colors.gray300, true: Colors.primary }}
              thumbColor={isAvailable ? Colors.white : Colors.gray100}
            />
          </View>
          <Text style={styles.availabilitySubtext}>
            When enabled, students can see and book your rides
          </Text>
        </View>

        {isAvailable && (
          <>
            <View style={styles.routeCard}>
              <Text style={styles.sectionTitle}>Route Information</Text>
              
              <Text style={styles.inputLabel}>From:</Text>
              <View style={styles.pickerContainer}>
                {universities.map((uni) => (
                  <TouchableOpacity
                    key={uni.name}
                    style={[
                      styles.universityOption,
                      selectedFrom === uni.name && styles.selectedOption
                    ]}
                    onPress={() => setSelectedFrom(uni.name)}
                  >
                    <Text style={[
                      styles.universityText,
                      selectedFrom === uni.name && styles.selectedOptionText
                    ]}>
                      {uni.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>To:</Text>
              <View style={styles.pickerContainer}>
                {universities.map((uni) => (
                  <TouchableOpacity
                    key={uni.name}
                    style={[
                      styles.universityOption,
                      selectedTo === uni.name && styles.selectedOption
                    ]}
                    onPress={() => setSelectedTo(uni.name)}
                  >
                    <Text style={[
                      styles.universityText,
                      selectedTo === uni.name && styles.selectedOptionText
                    ]}>
                      {uni.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>Ride Details</Text>
              
              <Text style={styles.inputLabel}>Departure Date & Time:</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD HH:MM (e.g., 2024-01-15 08:30)"
                placeholderTextColor="#aaa"
                value={departureTime}
                onChangeText={setDepartureTime}
              />

              <Text style={styles.inputLabel}>Price per Seat ($):</Text>
              <TextInput
                style={styles.input}
                placeholder="25"
                placeholderTextColor="#aaa"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Available Seats:</Text>
              <TextInput
                style={styles.input}
                placeholder="4"
                placeholderTextColor="#aaa"
                value={availableSeats}
                onChangeText={setAvailableSeats}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.vehicleCard}>
              <Text style={styles.sectionTitle}>Vehicle Information</Text>
              
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleText}>
                  <Text style={styles.vehicleLabel}>Model:</Text> {user.vehicle?.model}
                </Text>
                <Text style={styles.vehicleText}>
                  <Text style={styles.vehicleLabel}>Plate:</Text> {user.vehicle?.plate}
                </Text>
                <Text style={styles.vehicleText}>
                  <Text style={styles.vehicleLabel}>Color:</Text> {user.vehicle?.color}
                </Text>
                <Text style={styles.vehicleText}>
                  <Text style={styles.vehicleLabel}>Capacity:</Text> {user.vehicle?.capacity} seats
                </Text>
              </View>
            </View>

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
                <Ionicons name="add-circle-outline" size={24} color={Colors.textInverse} style={styles.buttonIcon} />
                <Text style={styles.createButtonText}>Create Ride</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navMenu: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    ...Shadows.sm,
  },
  navButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  navButtonText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  activeNavButtonText: {
    color: Colors.textInverse,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  availabilityCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  availabilityText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  availabilitySubtext: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  routeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  pickerContainer: {
    marginBottom: Spacing.sm,
  },
  universityOption: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  universityText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  selectedOptionText: {
    color: Colors.textInverse,
    fontWeight: Typography.bold,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  input: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  vehicleCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  vehicleInfo: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  vehicleText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  vehicleLabel: {
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  createButton: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  createButtonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
  createButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
}); 