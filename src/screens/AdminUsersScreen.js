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

export default function AdminUsersScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('students');
  const [users, setUsers] = useState({
    students: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@university.edu',
        phone: '+1234567890',
        status: 'active',
        joinDate: '2024-01-15',
        totalRides: 45,
        rating: 4.8,
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@university.edu',
        phone: '+1234567891',
        status: 'active',
        joinDate: '2024-02-20',
        totalRides: 32,
        rating: 4.9,
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@university.edu',
        phone: '+1234567892',
        status: 'suspended',
        joinDate: '2024-01-10',
        totalRides: 12,
        rating: 3.2,
      },
    ],
    drivers: [
      {
        id: '1',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@uninoah.com',
        phone: '+1234567893',
        status: 'active',
        joinDate: '2024-01-05',
        totalRides: 156,
        rating: 4.9,
        vehicle: 'Toyota Noah',
        license: 'DL123456',
      },
      {
        id: '2',
        name: 'David Brown',
        email: 'david.brown@uninoah.com',
        phone: '+1234567894',
        status: 'active',
        joinDate: '2024-02-01',
        totalRides: 98,
        rating: 4.7,
        vehicle: 'Honda Stepwgn',
        license: 'DL123457',
      },
      {
        id: '3',
        name: 'Lisa Davis',
        email: 'lisa.davis@uninoah.com',
        phone: '+1234567895',
        status: 'pending',
        joinDate: '2024-03-10',
        totalRides: 0,
        rating: 0,
        vehicle: 'Nissan Serena',
        license: 'DL123458',
      },
    ],
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'suspended': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return Colors.gray500;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'checkmark-circle';
      case 'suspended': return 'close-circle';
      case 'pending': return 'time';
      default: return 'help-circle';
    }
  };

  const handleUserAction = (userId, action) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log(`${action} user ${userId}`) },
      ]
    );
  };

  const UserCard = ({ user, type }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userPhone}>{user.phone}</Text>
        </View>
        <View style={styles.userStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) }]}>
            <Ionicons name={getStatusIcon(user.status)} size={12} color="#FFFFFF" />
            <Text style={styles.statusText}>{user.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.userStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Join Date</Text>
          <Text style={styles.statValue}>{user.joinDate}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Rides</Text>
          <Text style={styles.statValue}>{user.totalRides}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Rating</Text>
          <Text style={styles.statValue}>{user.rating > 0 ? user.rating.toFixed(1) : 'N/A'}</Text>
        </View>
      </View>

      {type === 'drivers' && (
        <View style={styles.driverInfo}>
          <Text style={styles.driverLabel}>Vehicle: {user.vehicle}</Text>
          <Text style={styles.driverLabel}>License: {user.license}</Text>
        </View>
      )}

      <View style={styles.userActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => console.log('Edit user', user.id)}
        >
          <Ionicons name="create-outline" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        {user.status === 'active' ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.suspendButton]}
            onPress={() => handleUserAction(user.id, 'suspend')}
          >
            <Ionicons name="pause-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Suspend</Text>
          </TouchableOpacity>
        ) : user.status === 'suspended' ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.activateButton]}
            onPress={() => handleUserAction(user.id, 'activate')}
          >
            <Ionicons name="play-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Activate</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleUserAction(user.id, 'approve')}
          >
            <Ionicons name="checkmark-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleUserAction(user.id, 'delete')}
        >
          <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredUsers = users[selectedTab].filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Text style={styles.headerTitle}>User Management</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={Colors.gray500} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              placeholderTextColor={Colors.gray400}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={Colors.gray500} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'students' && styles.activeTab]}
            onPress={() => setSelectedTab('students')}
          >
            <Text style={[styles.tabText, selectedTab === 'students' && styles.activeTabText]}>
              Students ({users.students.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'drivers' && styles.activeTab]}
            onPress={() => setSelectedTab('drivers')}
          >
            <Text style={[styles.tabText, selectedTab === 'drivers' && styles.activeTabText]}>
              Drivers ({users.drivers.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Users List */}
        <ScrollView
          style={styles.usersList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
          }
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} type={selectedTab} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color={Colors.gray400} />
              <Text style={styles.emptyStateTitle}>No users found</Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery ? 'Try adjusting your search terms' : 'No users available'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
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
  searchContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  activeTab: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  usersList: {
    flex: 1,
  },
  userCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  userPhone: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  userStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: '#FFFFFF',
    marginLeft: Spacing.xs,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray100,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  driverInfo: {
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderColor: Colors.gray100,
  },
  driverLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  userActions: {
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
  editButton: {
    backgroundColor: '#3B82F6',
  },
  suspendButton: {
    backgroundColor: '#F59E0B',
  },
  activateButton: {
    backgroundColor: '#10B981',
  },
  approveButton: {
    backgroundColor: '#10B981',
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
