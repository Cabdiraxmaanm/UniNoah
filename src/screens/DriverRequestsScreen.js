import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, StatusBar } from 'react-native';
import { requestsAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function DriverRequestsScreen({ navigation, route }) {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filter, setFilter] = useState(route?.params?.initialFilter || 'All'); // All | pending | accepted | rejected
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useApp();

  const loadRequests = async () => {
    try {
      const driverRequests = await requestsAPI.getRequests(user.id);
      setRequests(driverRequests);
      setFilteredRequests(applyFilter(driverRequests, filter));
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    setFilteredRequests(applyFilter(requests, filter));
  }, [filter, requests]);

  const applyFilter = (list, status) => {
    if (status === 'All') return list;
    return list.filter((r) => r.status === status);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRequests();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'rejected':
        return '#EF4444';
      default:
        return '#64748B';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await requestsAPI.updateRequest(requestId, { status: 'accepted' });
      Alert.alert('Success', 'Request accepted! The student has been notified.');
      onRefresh();
    } catch (error) {
      Alert.alert('Error', 'Failed to accept request. Please try again.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: async () => {
            try {
              await requestsAPI.updateRequest(requestId, { status: 'rejected' });
              Alert.alert('Success', 'Request rejected.');
              onRefresh();
            } catch (error) {
              Alert.alert('Error', 'Failed to reject request. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderFilterChips = () => (
    <View style={styles.filtersRow}>
      {['All', 'pending', 'accepted', 'rejected'].map((label) => {
        const isActive = filter === label;
        return (
          <TouchableOpacity
            key={label}
            onPress={() => setFilter(label)}
            style={[styles.filterChip, isActive && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
              {label === 'All' ? 'All' : label.charAt(0).toUpperCase() + label.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.routeRow}>
          <Ionicons name="location" size={16} color="#003B73" />
          <Text style={styles.routeTitle}>{item.route.from}</Text>
          <Ionicons name="arrow-forward" size={16} color="#64748B" style={{ marginHorizontal: 6 }} />
          <Ionicons name="school" size={16} color="#0074D9" />
          <Text style={styles.routeTitle}>{item.route.to}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}> 
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.requestDetails}>
        <View style={styles.detailRow}> 
          <Text style={styles.detailLabel}>Student</Text>
          <Text style={styles.detailValue}>{item.passengerName}</Text>
        </View>
        <View style={styles.detailRow}> 
          <Text style={styles.detailLabel}>Phone</Text>
          <Text style={styles.detailValue}>{item.passengerPhone}</Text>
        </View>
        <View style={styles.detailRow}> 
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{formatDate(item.departureTime)}</Text>
        </View>
        <View style={styles.detailRow}> 
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailValue}>{formatTime(item.departureTime)}</Text>
        </View>
        <View style={styles.detailRow}> 
          <Text style={styles.detailLabel}>Price</Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
        {item.route?.pickupAddress ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pickup</Text>
            <Text style={styles.detailValue}>{item.route.pickupAddress}</Text>
          </View>
        ) : null}
      </View>

      {item.status === 'pending' ? (
        <View style={styles.requestActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleAcceptRequest(item.id)}
          >
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleRejectRequest(item.id)}
          >
            <Ionicons name="close" size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.acceptedInfo}>
          <Text style={styles.acceptedText}>✓ {getStatusText(item.status)}</Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Alert.alert('Contact', `Call ${item.passengerName}?`)}
          >
            <Ionicons name="call" size={16} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Contact Student</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading requests..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003B73" />
      <LinearGradient
        colors={['#003B73', '#0074D9', '#00BFFF']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Ride Requests</Text>
          <Text style={styles.headerSubtitle}>Manage and respond to student requests</Text>
          {renderFilterChips()}
        </View>
      </LinearGradient>

      {filteredRequests.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="mail-unread-outline" size={56} color="#003B73" style={{ marginBottom: 12 }} />
          <Text style={styles.emptyTitle}>{filter === 'All' ? 'No requests yet' : `No ${filter} requests`}</Text>
          <Text style={styles.emptySubtitle}>
            When students send requests for your rides, they will appear here.
          </Text>
          <TouchableOpacity 
            style={styles.createRideButton} 
            onPress={() => navigation.navigate('DriverSetAvailability')}
          >
            <Text style={styles.createRideButtonText}>Create a Ride</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredRequests}
          keyExtractor={item => item.id}
          renderItem={renderRequest}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    width: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  filtersRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  filterChipActive: {
    backgroundColor: '#FFFFFF',
  },
  filterChipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#003B73',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#003B73',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routeTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#003B73',
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  requestDetails: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  price: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '800',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  acceptButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  acceptedInfo: {
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  acceptedText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '800',
  },
  contactButton: {
    backgroundColor: '#0074D9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#003B73',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 22,
  },
  createRideButton: {
    backgroundColor: '#0074D9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createRideButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
}); 