import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Switch, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { useApp } from '../utils/AppContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

export default function DriverSettingsScreen({ navigation }) {
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
      const settings = await AsyncStorage.getItem('driverSettings');
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
      await AsyncStorage.setItem('driverSettings', JSON.stringify(settings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await logout();
              
              // Reset navigation stack to prevent back navigation
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Splash' }],
                })
              );
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('DriverEditProfile');
  };

  const handlePrivacySettings = () => {
    Alert.alert('Privacy & Security', 'Privacy settings feature coming soon!');
  };

  const handleHelpSupport = () => {
    navigation.navigate('DriverSupport');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Terms of service feature coming soon!');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy feature coming soon!');
  };

  const handleAbout = () => {
    Alert.alert(
      'About UniNoah',
      'Version 1.0.0\n\nA university ride-sharing app for students and drivers in Somaliland.\n\n© 2024 UniNoah. All rights reserved.'
    );
  };

  const renderSettingItem = (iconName, title, subtitle, onPress) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={24} color={Colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  const renderToggleItem = (iconName, title, subtitle, value, setValue, storageKey) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={24} color={Colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={(newValue) => {
            setValue(newValue);
            saveSettings(storageKey, newValue);
          }}
          trackColor={{ false: Colors.textTertiary, true: Colors.primary }}
          thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003B73" />
      
      {/* Header */}
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
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'D'}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Driver'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'driver@example.com'}</Text>
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
          {renderToggleItem('notifications', 'Notifications', 'Ride requests and updates', notificationsEnabled, setNotificationsEnabled, 'notificationsEnabled')}
          {renderToggleItem('location', 'Location Services', 'Allow location access for navigation', locationEnabled, setLocationEnabled, 'locationEnabled')}
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
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="log-out" size={20} color="#FFFFFF" />
              <Text style={styles.logoutText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  headerSpacer: {
    width: 40,
  },

  // Profile Card
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },

  // Sections
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },

  // Setting Items
  settingItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    ...Shadows.sm,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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

  // Logout Button
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    ...Shadows.md,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
