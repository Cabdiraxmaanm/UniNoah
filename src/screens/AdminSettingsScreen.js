import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';

export default function AdminSettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    app: {
      maintenance: false,
      autoAssign: true,
      requireApproval: false,
    },
    pricing: {
      baseFare: '5.00',
      perKm: '2.50',
      perMinute: '0.50',
    },
    system: {
      maxRidesPerDriver: '20',
      driverRadius: '10',
      studentRadius: '5',
    },
  });

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    Alert.alert(
      'Save Settings',
      'Are you sure you want to save these settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', onPress: () => console.log('Settings saved', settings) },
      ]
    );
  };

  const SettingItem = ({ title, subtitle, value, onValueChange, type = 'switch' }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.settingControl}>
        {type === 'switch' ? (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: Colors.gray300, true: '#10B981' }}
            thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
          />
        ) : (
          <TextInput
            style={styles.settingInput}
            value={value}
            onChangeText={onValueChange}
            keyboardType={type === 'number' ? 'numeric' : 'default'}
            placeholder="Enter value"
            placeholderTextColor={Colors.gray400}
          />
        )}
      </View>
    </View>
  );

  const SettingSection = ({ title, children }) => (
    <View style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const ActionButton = ({ title, icon, color, onPress, destructive = false }) => (
    <TouchableOpacity
      style={[styles.actionButton, destructive && styles.destructiveButton]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.actionButtonContent}>
        <Ionicons name={icon} size={20} color={destructive ? '#FFFFFF' : color} />
        <Text style={[styles.actionButtonText, destructive && styles.destructiveButtonText]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#34D399']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
            <Ionicons name="checkmark" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <SettingSection title="Notifications">
          <SettingItem
            title="Email Notifications"
            subtitle="Receive important updates via email"
            value={settings.notifications.email}
            onValueChange={(value) => handleSettingChange('notifications', 'email', value)}
          />
          <SettingItem
            title="Push Notifications"
            subtitle="Get real-time alerts on your device"
            value={settings.notifications.push}
            onValueChange={(value) => handleSettingChange('notifications', 'push', value)}
          />
          <SettingItem
            title="SMS Notifications"
            subtitle="Receive critical alerts via SMS"
            value={settings.notifications.sms}
            onValueChange={(value) => handleSettingChange('notifications', 'sms', value)}
          />
        </SettingSection>

        {/* App Settings */}
        <SettingSection title="App Configuration">
          <SettingItem
            title="Maintenance Mode"
            subtitle="Put the app in maintenance mode"
            value={settings.app.maintenance}
            onValueChange={(value) => handleSettingChange('app', 'maintenance', value)}
          />
          <SettingItem
            title="Auto-Assign Drivers"
            subtitle="Automatically assign drivers to rides"
            value={settings.app.autoAssign}
            onValueChange={(value) => handleSettingChange('app', 'autoAssign', value)}
          />
          <SettingItem
            title="Require Driver Approval"
            subtitle="Manually approve new drivers"
            value={settings.app.requireApproval}
            onValueChange={(value) => handleSettingChange('app', 'requireApproval', value)}
          />
        </SettingSection>

        {/* Pricing */}
        <SettingSection title="Pricing Configuration">
          <SettingItem
            title="Base Fare"
            subtitle="Starting fare for all rides"
            value={settings.pricing.baseFare}
            onValueChange={(value) => handleSettingChange('pricing', 'baseFare', value)}
            type="text"
          />
          <SettingItem
            title="Per Kilometer Rate"
            subtitle="Rate charged per kilometer"
            value={settings.pricing.perKm}
            onValueChange={(value) => handleSettingChange('pricing', 'perKm', value)}
            type="text"
          />
          <SettingItem
            title="Per Minute Rate"
            subtitle="Rate charged per minute"
            value={settings.pricing.perMinute}
            onValueChange={(value) => handleSettingChange('pricing', 'perMinute', value)}
            type="text"
          />
        </SettingSection>

        {/* System Limits */}
        <SettingSection title="System Limits">
          <SettingItem
            title="Max Rides Per Driver"
            subtitle="Maximum rides a driver can accept per day"
            value={settings.system.maxRidesPerDriver}
            onValueChange={(value) => handleSettingChange('system', 'maxRidesPerDriver', value)}
            type="number"
          />
          <SettingItem
            title="Driver Search Radius"
            subtitle="Radius in km for driver search"
            value={settings.system.driverRadius}
            onValueChange={(value) => handleSettingChange('system', 'driverRadius', value)}
            type="number"
          />
          <SettingItem
            title="Student Search Radius"
            subtitle="Radius in km for student search"
            value={settings.system.studentRadius}
            onValueChange={(value) => handleSettingChange('system', 'studentRadius', value)}
            type="number"
          />
        </SettingSection>

        {/* Actions */}
        <SettingSection title="System Actions">
          <ActionButton
            title="Export Data"
            icon="download-outline"
            color="#3B82F6"
            onPress={() => Alert.alert('Export', 'Data export started')}
          />
          <ActionButton
            title="Backup Database"
            icon="cloud-upload-outline"
            color="#10B981"
            onPress={() => Alert.alert('Backup', 'Database backup initiated')}
          />
          <ActionButton
            title="Clear Cache"
            icon="refresh-outline"
            color="#F59E0B"
            onPress={() => Alert.alert('Cache', 'Cache cleared successfully')}
          />
          <ActionButton
            title="Reset to Defaults"
            icon="refresh-circle-outline"
            color="#EF4444"
            onPress={() => Alert.alert('Reset', 'Settings reset to defaults')}
            destructive
          />
        </SettingSection>

        {/* Account */}
        <SettingSection title="Account">
          <ActionButton
            title="Change Password"
            icon="key-outline"
            color="#8B5CF6"
            onPress={() => navigation.navigate('AdminChangePassword')}
          />
          <ActionButton
            title="Two-Factor Authentication"
            icon="shield-checkmark-outline"
            color="#10B981"
            onPress={() => Alert.alert('2FA', 'Two-factor authentication settings')}
          />
          <ActionButton
            title="Login History"
            icon="time-outline"
            color="#3B82F6"
            onPress={() => Alert.alert('History', 'Login history opened')}
          />
        </SettingSection>

        {/* Danger Zone */}
        <SettingSection title="Danger Zone">
          <ActionButton
            title="Delete All Data"
            icon="trash-outline"
            color="#EF4444"
            onPress={() => Alert.alert(
              'Delete All Data',
              'This action cannot be undone. Are you sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => console.log('Data deleted') },
              ]
            )}
            destructive
          />
          <ActionButton
            title="Deactivate Account"
            icon="person-remove-outline"
            color="#EF4444"
            onPress={() => Alert.alert(
              'Deactivate Account',
              'Your admin account will be deactivated. Are you sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Deactivate', style: 'destructive', onPress: () => console.log('Account deactivated') },
              ]
            )}
            destructive
          />
        </SettingSection>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>UniNoah Admin Panel</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoCopyright}>© 2024 UniNoah. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: '#FFFFFF',
  },
  saveButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  settingSection: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  sectionContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  settingTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  settingControl: {
    alignItems: 'flex-end',
  },
  settingInput: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.gray200,
    minWidth: 80,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Shadows.sm,
  },
  destructiveButton: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
  },
  destructiveButtonText: {
    color: '#FFFFFF',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    marginTop: Spacing.xl,
  },
  appInfoTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  appInfoVersion: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  appInfoCopyright: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
});
