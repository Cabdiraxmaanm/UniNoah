import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

export default function DriverAuthScreen({ navigation }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [driverId, setDriverId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  
  const { login } = useApp();

  const handleAuth = async () => {
    if (isSignUp) {
      if (!email || !driverId || !password || !confirmPassword || !name || !phone || 
          !vehicleModel || !vehiclePlate || !vehicleColor || !vehicleCapacity) {
        Alert.alert('Error', 'Please fill all fields.');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return;
      }
    } else {
      if (!email || !password) {
        Alert.alert('Error', 'Please fill all required fields.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const userData = {
          email,
          driverId,
          password,
          name,
          phone,
          vehicle: {
            model: vehicleModel,
            plate: vehiclePlate,
            color: vehicleColor,
            capacity: parseInt(vehicleCapacity),
          },
          userType: 'driver',
        };
        const result = await authAPI.register(userData);
        await login(result.user, 'driver');
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'DriverPanel' }],
          })}
        ]);
      } else {
        const result = await authAPI.login(email, password, 'driver');
        await login(result.user, 'driver');
        Alert.alert('Success', 'Logged in successfully!', [
          { text: 'OK', onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'DriverPanel' }],
          })}
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (placeholder, value, onChangeText, options = {}) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{placeholder}</Text>
      <TextInput
        style={[
          styles.input,
          focusedInput === placeholder && styles.inputFocused
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocusedInput(placeholder)}
        onBlur={() => setFocusedInput(null)}
        {...options}
      />
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner message={isSignUp ? 'Creating account...' : 'Logging in...'} />;
  }

  return (
    <LinearGradient
      colors={['#065F46', '#059669', '#34D399']}
      style={styles.gradient}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="car-outline" size={40} color={Colors.textInverse} />
          </View>
          <Text style={styles.title}>{isSignUp ? 'Driver Sign Up' : 'Driver Login'}</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Join our driver community' : 'Welcome back to UniNoah'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {isSignUp && (
            <>
              {renderInput('Full Name', name, setName, { autoCapitalize: 'words' })}
              {renderInput('Phone Number', phone, setPhone, { keyboardType: 'phone-pad' })}
              {renderInput('Driver ID', driverId, setDriverId, { autoCapitalize: 'characters' })}
              
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Vehicle Information</Text>
                <Text style={styles.sectionSubtitle}>Tell us about your vehicle</Text>
              </View>
              
              {renderInput('Vehicle Model (e.g., Toyota Noah)', vehicleModel, setVehicleModel, { autoCapitalize: 'words' })}
              {renderInput('License Plate (e.g., HGA-123)', vehiclePlate, setVehiclePlate, { autoCapitalize: 'characters' })}
              {renderInput('Vehicle Color', vehicleColor, setVehicleColor, { autoCapitalize: 'words' })}
              {renderInput('Passenger Capacity', vehicleCapacity, setVehicleCapacity, { keyboardType: 'numeric' })}
            </>
          )}
          
          {renderInput('Driver Email', email, setEmail, { 
            keyboardType: 'email-address',
            autoCapitalize: 'none'
          })}
          {renderInput('Password', password, setPassword, { secureTextEntry: true })}
          
          {isSignUp && (
            renderInput('Confirm Password', confirmPassword, setConfirmPassword, { secureTextEntry: true })
          )}
          
          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <LinearGradient
              colors={['#003B73', '#0074D9', '#00BFFF']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Switch Mode */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.switchLink}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: { 
    flex: 1, 
  },
  contentContainer: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoIcon: {
    fontSize: 40,
  },
  title: { 
    fontSize: Typography['3xl'],
    color: Colors.textInverse, 
    fontWeight: Typography.bold, 
    marginBottom: Spacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: Typography.lg,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.normal,
  },
  formContainer: {
    marginBottom: Spacing['2xl'],
  },
  sectionHeader: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    fontSize: Typography.lg,
    color: Colors.textInverse,
    fontWeight: Typography.semibold,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.sm,
    color: Colors.textInverse,
    fontWeight: Typography.medium,
    marginBottom: Spacing.xs,
    opacity: 0.9,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    ...Shadows.sm,
  },
  inputFocused: {
    borderColor: '#10B981',
    backgroundColor: Colors.white,
    ...Shadows.md,
  },
  button: {
    marginTop: Spacing.lg,
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
    color: '#FFFFFF', 
    fontSize: Typography.lg, 
    fontWeight: Typography.bold,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  switchText: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: Typography.base,
    marginRight: Spacing.xs,
  },
  switchLink: { 
    color: Colors.textInverse, 
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    textDecorationLine: 'underline',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.lg,
  },
  backButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
}); 