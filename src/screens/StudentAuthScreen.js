import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

export default function StudentAuthScreen({ navigation }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  
  const { login } = useApp();

  const handleAuth = async () => {
    console.log('=== STUDENT AUTH DEBUG ===');
    console.log('Is SignUp:', isSignUp);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('UserType: student');
    
    if (isSignUp) {
      if (!email || !studentId || !password || !confirmPassword || !name || !phone || !university) {
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
          studentId,
          password,
          name,
          phone,
          university,
          userType: 'student',
        };
        const result = await authAPI.register(userData);
        await login(result.user, 'student');
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'StudentPanel' }],
          })}
        ]);
      } else {
        console.log('Calling authAPI.login with:', { email, password, userType: 'student' });
        const result = await authAPI.login(email, password, 'student');
        console.log('Login result:', result);
        await login(result.user, 'student');
        Alert.alert('Success', 'Logged in successfully!', [
          { text: 'OK', onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'StudentPanel' }],
          })}
        ]);
      }
    } catch (error) {
      console.log('Login error:', error.message);
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
      colors={Colors.gradients.primary}
      style={styles.gradient}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="school-outline" size={40} color={Colors.textInverse} />
          </View>
          <Text style={styles.title}>{isSignUp ? 'Student Sign Up' : 'Student Login'}</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Create your student account' : 'Welcome back to UniNoah'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {isSignUp && (
            <>
              {renderInput('Full Name', name, setName, { autoCapitalize: 'words' })}
              {renderInput('Phone Number', phone, setPhone, { keyboardType: 'phone-pad' })}
              {renderInput('University', university, setUniversity, { autoCapitalize: 'words' })}
              {renderInput('Student ID', studentId, setStudentId, { autoCapitalize: 'characters' })}
            </>
          )}
          
          {renderInput('Student Email', email, setEmail, { 
            keyboardType: 'email-address',
            autoCapitalize: 'none'
          })}
          {renderInput('Password', password, setPassword, { secureTextEntry: true })}
          
          {isSignUp && (
            renderInput('Confirm Password', confirmPassword, setConfirmPassword, { secureTextEntry: true })
          )}
          
          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <LinearGradient
              colors={Colors.gradients.secondary}
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
    borderColor: Colors.secondary,
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
    color: Colors.textInverse, 
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