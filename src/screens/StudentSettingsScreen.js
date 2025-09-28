import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Switch, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { useApp } from '../utils/AppContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

export default function StudentSettingsScreen({ navigation }) {
  const { user, logout } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Load settings from storage
  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('studentSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setNotificationsEnabled(parsedSettings.notificationsEnabled ?? true);
        setLocationEnabled(parsedSettings.locationEnabled ?? true);
        setSoundEnabled(parsedSettings.soundEnabled ?? true);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  // Save settings to storage
  const saveSettings = async (key, value) => {
    try {
      const settings = {
        notificationsEnabled,
        locationEnabled,
        soundEnabled,
        [key]: value
      };
      await AsyncStorage.setItem('studentSettings', JSON.stringify(settings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      '👋 Logout',
      `Goodbye ${user?.name || 'Student'}! Are you sure you want to logout?\n\nYou'll need to sign in again to access your account.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              
              // Add a small delay for better UX
              await new Promise(resolve => setTimeout(resolve, 500));
              
              await logout();
              
              // Clear any stored settings
              await AsyncStorage.removeItem('studentSettings');
              
              // Navigate to the main auth screen on the ROOT navigator
              const parentNav = navigation.getParent?.();
              if (parentNav) {
                parentNav.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'SignUp' }],
                  })
                );
              } else {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'SignUp' }],
                  })
                );
              }
              
              // Show success message
              setTimeout(() => {
                Alert.alert('👋 Logged Out', 'You have been successfully logged out. See you next time!');
              }, 100);
              
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('❌ Error', 'Failed to logout properly. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'What would you like to update?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Name', onPress: () => Alert.alert('Name', 'Name editing coming soon!') },
        { text: 'Email', onPress: () => Alert.alert('Email', 'Email editing coming soon!') },
        { text: 'Phone', onPress: () => Alert.alert('Phone', 'Phone editing coming soon!') }
      ]
    );
  };

  const handlePrivacySettings = () => {
    Alert.alert(
      'Privacy Settings',
      'Manage your privacy preferences',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Data Usage', onPress: () => Alert.alert('Data Usage', 'Location data is only used for ride matching and is not shared with third parties.') },
        { text: 'Account Deletion', onPress: () => Alert.alert('Account Deletion', 'To delete your account, please contact support.') }
      ]
    );
  };

  const handleHelpSupport = () => {
    navigation.navigate('StudentSupport');
  };

  const handleAbout = () => {
    Alert.alert(
      'About UniNoah',
      'UniNoah v1.0.0\n\nRide sharing for university students\n\nDeveloped with ❤️ for students',
      [{ text: 'OK' }]
    );
  };

  const handlePaymentMethods = () => {
    Alert.alert(
      'Payment Methods',
      'Manage your payment options',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add Card', onPress: () => Alert.alert('Add Card', 'Card adding feature coming soon!') },
        { text: 'View Cards', onPress: () => Alert.alert('View Cards', 'No payment methods added yet.') }
      ]
    );
  };

  const handleTermsOfService = () => {
    Alert.alert(
      'Terms of Service',
      'By using UniNoah, you agree to our terms of service. Key points:\n\n• You must be a university student\n• Respect other users\n• Follow safety guidelines\n• No inappropriate behavior',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Your privacy is important to us:\n\n• We collect minimal data\n• Location data is only used for rides\n• Your information is secure\n• We don\'t sell your data',
      [{ text: 'OK' }]
    );
  };

  const renderSettingItem = (icon, title, subtitle, onPress, rightElement = null) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingContent}>
        <View style={styles.settingLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={20} color={Colors.primary} />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.settingRight}>
          {rightElement || (
            <Ionicons name="chevron-forward" size={16} color={Colors.gray400} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderToggleItem = (icon, title, subtitle, value, onValueChange, settingKey) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <View style={styles.settingLeft}>
          <View style={[styles.iconContainer, { backgroundColor: value ? Colors.primary : Colors.gray200 }]}>
            <Ionicons name={icon} size={20} color={value ? '#FFFFFF' : Colors.gray500} />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.settingRight}>
          <Switch
            value={value}
            onValueChange={(newValue) => {
              onValueChange(newValue);
              saveSettings(settingKey, newValue);
            }}
            trackColor={{ false: Colors.gray200, true: Colors.primaryLight }}
            thumbColor={value ? Colors.primary : '#FFFFFF'}
            ios_backgroundColor={Colors.gray200}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003B73" />
      
      {/* Simple Header */}
      <LinearGradient colors={['#003B73', '#0074D9', '#00BFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        {/* Simple Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'S'}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Student'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'student@example.com'}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      
      {/* Simple Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderSettingItem('person-circle', 'Edit Profile', 'Update your personal information', handleEditProfile)}
          {renderSettingItem('shield-checkmark', 'Privacy & Security', 'Manage your privacy settings', handlePrivacySettings)}
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderToggleItem('notifications', 'Notifications', 'Ride updates and alerts', notificationsEnabled, setNotificationsEnabled, 'notificationsEnabled')}
          {renderToggleItem('location', 'Location Services', 'Allow location access for better experience', locationEnabled, setLocationEnabled, 'locationEnabled')}
          {renderToggleItem('volume-high', 'Sound', 'Enable app sounds and alerts', soundEnabled, setSoundEnabled, 'soundEnabled')}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {renderSettingItem('help-circle', 'Help & Support', 'Get help and contact support', handleHelpSupport)}
          {renderSettingItem('document-text', 'Terms of Service', 'Read our terms and conditions', handleTermsOfService)}
          {renderSettingItem('shield', 'Privacy Policy', 'Read our privacy policy', handlePrivacyPolicy)}
          {renderSettingItem('information-circle', 'About', 'App version and information', handleAbout)}
        </View>

        {/* Simple Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]} 
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <View style={styles.logoutContent}>
            {isLoggingOut ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            )}
            <Text style={styles.logoutText}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Text>
          </View>
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
  
  // Simple Header
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  
  // Simple Profile Card
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  
  // Content Styles
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  
  // Section Styles
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
  },
  
  // Setting Item Styles
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    ...Shadows.sm,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Logout Button
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    marginTop: 20,
    ...Shadows.sm,
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
