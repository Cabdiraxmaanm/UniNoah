import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { useApp } from '../utils/AppContext';
import { requestsAPI } from '../services/api';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem';

export default function StudentRequestsScreen({ navigation }) {
  const { user } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const data = await requestsAPI.getRequestsForPassenger(user.id);
      setRequests(data);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadRequests();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'rejected':
        return Colors.error;
      default:
        return Colors.gray500;
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.route}>{item.route.from} → {item.route.to}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Driver:</Text>
        <Text style={styles.value}>{item.driverName}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>When:</Text>
        <Text style={styles.value}>{new Date(item.departureTime).toLocaleString()}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Price:</Text>
        <Text style={styles.value}>${item.price}</Text>
      </View>
      {item.route?.pickupAddress ? (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Pickup:</Text>
          <Text style={styles.value}>{item.route.pickupAddress}</Text>
        </View>
      ) : null}
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading your requests..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="My Requests" />
      {requests.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No requests yet</Text>
          <Text style={styles.emptySubtitle}>Send a request from a ride to see it here.</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  route: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.md,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: Colors.textInverse,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
  },
  value: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['2xl'],
  },
  emptyTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});


