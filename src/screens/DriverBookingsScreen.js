import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { bookingsAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';
import Badge from '../components/Badge';
import { Ionicons } from '@expo/vector-icons';

export default function DriverBookingsScreen({ navigation, route }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState(route?.params?.initialFilter || 'All');
  const { user, logout } = useApp();

  const loadBookings = async () => {
    try {
      const driverBookings = await bookingsAPI.getBookings(user.id, 'driver');
      setBookings(driverBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
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

  const getBadgeVariantForStatus = (status) =>
    status === 'upcoming' ? 'info' : status === 'completed' ? 'success' : status === 'cancelled' ? 'danger' : 'neutral';

  const filters = ['All', 'upcoming', 'completed', 'cancelled'];

  const renderFilterChips = () => (
    <View style={styles.filtersRow}>
      {filters.map((label) => {
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

  const renderBooking = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.routeRow}>
          <Ionicons name="location" size={16} color={Colors.primary} />
              <Text style={styles.routeText}>{item.route.from}</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.gray500} style={{ marginHorizontal: 6 }} />
          <Ionicons name="school" size={16} color={Colors.accent} />
              <Text style={styles.routeText}>{item.route.to}</Text>
            </View>
        <Badge variant={getBadgeVariantForStatus(item.status)} text={item.status} />
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Student</Text>
          <Text style={styles.infoValue}>{item.passengerName}</Text>
          </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date</Text>
          <Text style={styles.infoValue}>{formatDate(item.departureTime)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Time</Text>
          <Text style={styles.infoValue}>{formatTime(item.departureTime)}</Text>
          </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Seats</Text>
          <Text style={styles.infoValue}>{item.seats || 1}</Text>
          </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Price</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        </View>
        
      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.primaryButton]} onPress={() => navigation.navigate('DriverNavigation', { booking: item })}>
          <Ionicons name="map" size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Navigate</Text>
              </TouchableOpacity>
        <TouchableOpacity style={[styles.secondaryButton]} onPress={() => Alert.alert('Contact', `Call ${item.passengerName}?`)}>
          <Ionicons name="call" size={18} color={Colors.primary} />
          <Text style={styles.secondaryButtonText}>Contact</Text>
            </TouchableOpacity>
        </View>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading bookings..." />;
  }

  const visibleBookings = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

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
          <Text style={styles.headerTitle}>Bookings</Text>
          <Text style={styles.headerSubtitle}>Manage your confirmed and past rides</Text>
          {renderFilterChips()}
      </View>
      </LinearGradient>

      {visibleBookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="list-outline" size={56} color={Colors.primary} style={{ marginBottom: 12 }} />
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptySubtitle}>
            Your confirmed bookings will appear here once students book your rides
          </Text>
          <TouchableOpacity 
            style={styles.ctaButton} 
            onPress={() => navigation.navigate('DriverSetAvailability')}
          >
            <LinearGradient
              colors={Colors.gradients.primary}
              style={styles.ctaButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.ctaButtonText}>Create a Ride</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={visibleBookings}
          keyExtractor={item => item.id}
          renderItem={renderBooking}
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
  card: {
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
  cardHeader: {
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
  routeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003B73',
    marginLeft: 6,
  },
  infoBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  price: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0074D9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  secondaryButtonText: {
    color: '#003B73',
    fontSize: 15,
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
  ctaButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
}); 