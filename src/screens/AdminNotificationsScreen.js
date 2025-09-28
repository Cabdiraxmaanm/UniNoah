import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';

const { width } = Dimensions.get('window');

export default function AdminNotificationsScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight at 2 AM. The app will be unavailable for 30 minutes.',
      type: 'system',
      status: 'sent',
      recipients: 'all',
      sentAt: '2024-03-15 10:00',
      sentBy: 'Admin User',
    },
    {
      id: '2',
      title: 'New Feature Update',
      message: 'We\'ve added live tracking for all rides! Check out the new features in the latest update.',
      type: 'feature',
      status: 'sent',
      recipients: 'students',
      sentAt: '2024-03-14 15:30',
      sentBy: 'Admin User',
    },
    {
      id: '3',
      title: 'Driver Training Session',
      message: 'Mandatory training session for all drivers this Saturday at 10 AM. Please confirm your attendance.',
      type: 'training',
      status: 'draft',
      recipients: 'drivers',
      sentAt: null,
      sentBy: 'Admin User',
    },
  ]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'general',
    recipients: 'all',
  });

  const [showCompose, setShowCompose] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'system': return '#EF4444';
      case 'feature': return '#3B82F6';
      case 'training': return '#F59E0B';
      case 'general': return '#10B981';
      default: return Colors.gray500;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'system': return 'settings-outline';
      case 'feature': return 'star-outline';
      case 'training': return 'school-outline';
      case 'general': return 'megaphone-outline';
      default: return 'notifications-outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return '#10B981';
      case 'draft': return '#F59E0B';
      case 'scheduled': return '#3B82F6';
      default: return Colors.gray500;
    }
  };

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Send Notification',
      `Are you sure you want to send this notification to ${newNotification.recipients}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: () => {
            const notification = {
              id: Date.now().toString(),
              ...newNotification,
              status: 'sent',
              sentAt: new Date().toISOString(),
              sentBy: 'Admin User',
            };
            setNotifications(prev => [notification, ...prev]);
            setNewNotification({ title: '', message: '', type: 'general', recipients: 'all' });
            setShowCompose(false);
            Alert.alert('Success', 'Notification sent successfully!');
          }
        },
      ]
    );
  };

  const handleDeleteNotification = (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
          }
        },
      ]
    );
  };

  const NotificationCard = ({ notification }) => (
    <View style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <View style={styles.notificationInfo}>
          <View style={styles.typeContainer}>
            <View style={[styles.typeIcon, { backgroundColor: getTypeColor(notification.type) }]}>
              <Ionicons name={getTypeIcon(notification.type)} size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.typeText}>{notification.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>
        </View>
        <View style={styles.notificationStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(notification.status) }]}>
            <Text style={styles.statusText}>{notification.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.notificationMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={14} color={Colors.gray500} />
          <Text style={styles.metaText}>{notification.recipients}</Text>
        </View>
        {notification.sentAt && (
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={Colors.gray500} />
            <Text style={styles.metaText}>{notification.sentAt}</Text>
          </View>
        )}
        <View style={styles.metaItem}>
          <Ionicons name="person-outline" size={14} color={Colors.gray500} />
          <Text style={styles.metaText}>{notification.sentBy}</Text>
        </View>
      </View>

      <View style={styles.notificationActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => console.log('View notification details', notification.id)}
        >
          <Ionicons name="eye-outline" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        
        {notification.status === 'draft' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.sendButton]}
            onPress={() => handleSendNotification()}
          >
            <Ionicons name="send-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Send</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => console.log('Edit notification', notification.id)}
        >
          <Ionicons name="create-outline" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteNotification(notification.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ComposeNotification = () => (
    <View style={styles.composeCard}>
      <Text style={styles.composeTitle}>Compose New Notification</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter notification title"
          placeholderTextColor={Colors.gray400}
          value={newNotification.title}
          onChangeText={(text) => setNewNotification(prev => ({ ...prev, title: text }))}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Message *</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder="Enter notification message"
          placeholderTextColor={Colors.gray400}
          value={newNotification.message}
          onChangeText={(text) => setNewNotification(prev => ({ ...prev, message: text }))}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Type</Text>
        <View style={styles.typeSelector}>
          {['general', 'system', 'feature', 'training'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeOption,
                newNotification.type === type && styles.selectedTypeOption
              ]}
              onPress={() => setNewNotification(prev => ({ ...prev, type }))}
            >
              <Text style={[
                styles.typeOptionText,
                newNotification.type === type && styles.selectedTypeOptionText
              ]}>
                {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Recipients</Text>
        <View style={styles.recipientSelector}>
          {['all', 'students', 'drivers'].map((recipient) => (
            <TouchableOpacity
              key={recipient}
              style={[
                styles.recipientOption,
                newNotification.recipients === recipient && styles.selectedRecipientOption
              ]}
              onPress={() => setNewNotification(prev => ({ ...prev, recipients: recipient }))}
            >
              <Text style={[
                styles.recipientOptionText,
                newNotification.recipients === recipient && styles.selectedRecipientOptionText
              ]}>
                {recipient.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.composeActions}>
        <TouchableOpacity
          style={[styles.composeButton, styles.cancelButton]}
          onPress={() => setShowCompose(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.composeButton, styles.sendButton]}
          onPress={handleSendNotification}
        >
          <Ionicons name="send" size={16} color="#FFFFFF" />
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
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
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowCompose(!showCompose)}
          >
            <Ionicons name={showCompose ? "close" : "add"} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
        }
      >
        {showCompose && <ComposeNotification />}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification History</Text>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-outline" size={64} color={Colors.gray400} />
              <Text style={styles.emptyStateTitle}>No notifications</Text>
              <Text style={styles.emptyStateSubtitle}>
                Start by composing your first notification
              </Text>
            </View>
          )}
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
  addButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  composeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  composeTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  selectedTypeOption: {
    backgroundColor: '#10B981',
  },
  typeOptionText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  selectedTypeOptionText: {
    color: '#FFFFFF',
  },
  recipientSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  recipientOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  selectedRecipientOption: {
    backgroundColor: '#3B82F6',
  },
  recipientOptionText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  selectedRecipientOptionText: {
    color: '#FFFFFF',
  },
  composeActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  composeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  cancelButton: {
    backgroundColor: Colors.gray200,
  },
  sendButton: {
    backgroundColor: '#10B981',
  },
  cancelButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  sendButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: '#FFFFFF',
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  notificationCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  notificationInfo: {
    flex: 1,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  typeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  typeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  notificationTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  notificationMessage: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  notificationStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: '#FFFFFF',
  },
  notificationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray100,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  viewButton: {
    backgroundColor: '#3B82F6',
  },
  editButton: {
    backgroundColor: '#F59E0B',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyStateTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
  },
  emptyStateSubtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
