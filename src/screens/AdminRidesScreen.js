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

export default function AdminRidesScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [rides, setRides] = useState([
    {
      id: '1',
      studentName: 'John Doe',
      driverName: 'Sarah Wilson',
      pickup: 'University Main Gate',
      destination: 'Downtown Mall',
      status: 'completed',
      startTime: '2024-03-15 14:30',
      endTime: '2024-03-15 14:45',
      distance: '5.2 km',
      fare: '$12.50',
      rating: 4.8,
      paymentMethod: 'card',
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      driverName: 'David Brown',
      pickup: 'Library',
      destination: 'Airport',
      status: 'in_progress',
      startTime: '2024-03-15 15:00',
      endTime: null,
      distance: '12.8 km',
      fare: '$28.00',
      rating: null,
      paymentMethod: 'cash',
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      driverName: 'Lisa Davis',
      pickup: 'Dormitory',
      destination: 'Train Station',
      status: 'cancelled',
      startTime: '2024-03-15 13:15',
      endTime: '2024-03-15 13:20',
      distance: '0 km',
      fare: '$0.00',
      rating: null,
      paymentMethod: 'card',
    },
    {
      id: '4',
      studentName: 'Emily Chen',
      driverName: 'Sarah Wilson',
      pickup: 'Campus Center',
      destination: 'Shopping Center',
      status: 'pending',
      startTime: null,
      endTime: null,
      distance: '0 km',
      fare: '$15.00',
      rating: null,
      paymentMethod: 'card',
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in_progress': return '#3B82F6';
      case 'pending': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return Colors.gray500;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'in_progress': return 'car';
      case 'pending': return 'time';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const handleRideAction = (rideId, action) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this ride?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log(`${action} ride ${rideId}`) },
      ]
    );
  };

  const RideCard = ({ ride }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <View style={styles.rideInfo}>
          <Text style={styles.rideId}>Ride #{ride.id}</Text>
          <Text style={styles.participants}>
            {ride.studentName} → {ride.driverName}
          </Text>
        </View>
        <View style={styles.rideStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ride.status) }]}>
            <Ionicons name={getStatusIcon(ride.status)} size={12} color="#FFFFFF" />
            <Text style={styles.statusText}>{ride.status.replace('_', ' ').toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.routeInfo}>
        <View style={styles.routeItem}>
          <Ionicons name="location" size={16} color="#10B981" />
          <Text style={styles.routeText}>{ride.pickup}</Text>
        </View>
        <View style={styles.routeArrow}>
          <Ionicons name="arrow-down" size={16} color={Colors.gray400} />
        </View>
        <View style={styles.routeItem}>
          <Ionicons name="flag" size={16} color="#EF4444" />
          <Text style={styles.routeText}>{ride.destination}</Text>
        </View>
      </View>

      <View style={styles.rideDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Distance</Text>
          <Text style={styles.detailValue}>{ride.distance}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Fare</Text>
          <Text style={styles.detailValue}>{ride.fare}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Payment</Text>
          <Text style={styles.detailValue}>{ride.paymentMethod}</Text>
        </View>
        {ride.rating && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Rating</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.detailValue}>{ride.rating}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.timeInfo}>
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>Start Time</Text>
          <Text style={styles.timeValue}>
            {ride.startTime ? ride.startTime : 'Not started'}
          </Text>
        </View>
        {ride.endTime && (
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>End Time</Text>
            <Text style={styles.timeValue}>{ride.endTime}</Text>
          </View>
        )}
      </View>

      <View style={styles.rideActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => console.log('View ride details', ride.id)}
        >
          <Ionicons name="eye-outline" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        
        {ride.status === 'pending' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.assignButton]}
            onPress={() => handleRideAction(ride.id, 'assign driver')}
          >
            <Ionicons name="person-add-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Assign</Text>
          </TouchableOpacity>
        )}
        
        {ride.status === 'in_progress' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleRideAction(ride.id, 'complete')}
          >
            <Ionicons name="checkmark-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Complete</Text>
          </TouchableOpacity>
        )}
        
        {ride.status === 'cancelled' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.refundButton]}
            onPress={() => handleRideAction(ride.id, 'process refund')}
          >
            <Ionicons name="card-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Refund</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleRideAction(ride.id, 'delete')}
        >
          <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredRides = rides.filter(ride => {
    const matchesSearch = 
      ride.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || ride.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { key: 'all', label: 'All Rides', count: rides.length },
    { key: 'pending', label: 'Pending', count: rides.filter(r => r.status === 'pending').length },
    { key: 'in_progress', label: 'In Progress', count: rides.filter(r => r.status === 'in_progress').length },
    { key: 'completed', label: 'Completed', count: rides.filter(r => r.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: rides.filter(r => r.status === 'cancelled').length },
  ];

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
          <Text style={styles.headerTitle}>Ride Management</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="#FFFFFF" />
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
              placeholder="Search rides..."
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

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[styles.filterTab, selectedFilter === option.key && styles.activeFilterTab]}
              onPress={() => setSelectedFilter(option.key)}
            >
              <Text style={[styles.filterTabText, selectedFilter === option.key && styles.activeFilterTabText]}>
                {option.label}
              </Text>
              <View style={[styles.filterCount, selectedFilter === option.key && styles.activeFilterCount]}>
                <Text style={[styles.filterCountText, selectedFilter === option.key && styles.activeFilterCountText]}>
                  {option.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Rides List */}
        <ScrollView
          style={styles.ridesList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
          }
        >
          {filteredRides.length > 0 ? (
            filteredRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={64} color={Colors.gray400} />
              <Text style={styles.emptyStateTitle}>No rides found</Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery ? 'Try adjusting your search terms' : 'No rides available'}
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
  filterButton: {
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
  filterContainer: {
    marginBottom: Spacing.lg,
  },
  filterContent: {
    paddingHorizontal: Spacing.xs,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  activeFilterTab: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterTabText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  filterCount: {
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  activeFilterCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterCountText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  activeFilterCountText: {
    color: '#FFFFFF',
  },
  ridesList: {
    flex: 1,
  },
  rideCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  rideInfo: {
    flex: 1,
  },
  rideId: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  participants: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  rideStatus: {
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
  routeInfo: {
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray100,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  routeText: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  routeArrow: {
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderColor: Colors.gray100,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  timeItem: {
    flex: 1,
  },
  timeLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  timeValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
  rideActions: {
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
  assignButton: {
    backgroundColor: '#10B981',
  },
  completeButton: {
    backgroundColor: '#10B981',
  },
  refundButton: {
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
