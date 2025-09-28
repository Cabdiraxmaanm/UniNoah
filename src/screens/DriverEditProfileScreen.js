import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, StatusBar, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useApp, ACTIONS } from '../utils/AppContext';
import { Colors, Typography, Shadows } from '../styles/DesignSystem';

export default function DriverEditProfileScreen({ navigation }) {
  const { user, userType, dispatch } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [vehicleModel, setVehicleModel] = useState(user?.vehicle?.model || '');
  const [vehicleColor, setVehicleColor] = useState(user?.vehicle?.color || '');
  const [vehiclePlate, setVehiclePlate] = useState(user?.vehicle?.plate || '');
  const [vehicleCapacity, setVehicleCapacity] = useState(String(user?.vehicle?.capacity || ''));

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Missing info', 'Please fill your name and email.');
      return;
    }

    const updatedUser = {
      ...user,
      name,
      email,
      phone,
      vehicle: {
        ...(user?.vehicle || {}),
        model: vehicleModel,
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity) || 0,
      },
    };

    try {
      // Update global context
      dispatch({ type: ACTIONS.SET_USER, payload: updatedUser });

      // Persist to AsyncStorage in the same structure used on login
      const userData = { user: updatedUser, userType: userType || 'driver' };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      Alert.alert('Saved', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const renderInput = (label, value, setValue, props = {}) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholderTextColor={Colors.textTertiary}
        {...props}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003B73" />
      <LinearGradient colors={['#003B73', '#0074D9', '#00BFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerBtn} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {renderInput('Full Name', name, setName, { placeholder: 'Your name' })}
        {renderInput('Email', email, setEmail, { placeholder: 'you@example.com', keyboardType: 'email-address', autoCapitalize: 'none' })}
        {renderInput('Phone', phone, setPhone, { placeholder: '+252...', keyboardType: 'phone-pad' })}

        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        {renderInput('Model', vehicleModel, setVehicleModel, { placeholder: 'e.g., Toyota Vitz' })}
        {renderInput('Color', vehicleColor, setVehicleColor, { placeholder: 'e.g., White' })}
        {renderInput('Plate Number', vehiclePlate, setVehiclePlate, { placeholder: 'e.g., HGA 123' })}
        {renderInput('Capacity (seats)', vehicleCapacity, setVehicleCapacity, { placeholder: 'e.g., 4', keyboardType: 'number-pad' })}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient colors={Colors.gradients.primary} style={styles.saveButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Ionicons name="save" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 10,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    ...Shadows.sm,
  },
  saveButton: {
    borderRadius: 14,
    overflow: 'hidden',
    ...Shadows.lg,
    marginTop: 12,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 8,
  },
});
