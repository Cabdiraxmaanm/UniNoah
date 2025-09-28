import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, Dimensions, Animated, TextInput, StatusBar, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ridesAPI } from '../services/api';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function StudentSearchRidesScreen({ navigation }) {
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { user } = useApp();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const loadRides = async () => {
    try {
      const availableRides = await ridesAPI.getAvailableRides();
      setRides(availableRides);
      setFilteredRides(availableRides);
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRides();
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Filter rides based on search and filter
  useEffect(() => {
    let filtered = rides;
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(ride => 
        ride.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.route.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Status filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'available') {
        filtered = filtered.filter(ride => ride.availableSeats > 0);
      } else if (selectedFilter === 'few-seats') {
        filtered = filtered.filter(ride => ride.availableSeats > 0 && ride.availableSeats <= 2);
      } else if (selectedFilter === 'full') {
        filtered = filtered.filter(ride => ride.availableSeats === 0);
      }
    }
    
    setFilteredRides(filtered);
  }, [rides, searchQuery, selectedFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRides();
  };

  const handleFilterPress = () => {
    Alert.alert(
      'Filter Rides',
      'Choose a filter option',
      [
        { text: 'All Rides', onPress: () => setSelectedFilter('all') },
        { text: 'Available Only', onPress: () => setSelectedFilter('available') },
        { text: 'Few Seats Left', onPress: () => setSelectedFilter('few-seats') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
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

  const getStatusColor = (seats) => {
    if (seats === 0) return Colors.error;
    if (seats <= 2) return Colors.warning;
    return Colors.success;
  };

  const getStatusText = (seats) => {
    if (seats === 0) return 'FULL';
    if (seats <= 2) return 'FEW SEATS';
    return 'AVAILABLE';
  };

  const renderRide = ({ item, index }) => (
    <Animated.View 
      style={[
        styles.rideCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Route Header */}
        <View style={styles.routeHeader}>
          <View style={styles.routeInfo}>
            <View style={styles.routeLine}>
              <View style={styles.locationDot}>
                <Ionicons name="location" size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.fromText}>{item.route.from}</Text>
            </View>
            <View style={styles.routeDivider}>
              <View style={styles.dividerLine} />
              <Ionicons name="arrow-down" size={16} color={Colors.primary} />
              <View style={styles.dividerLine} />
            </View>
            <View style={styles.routeLine}>
              <View style={[styles.locationDot, styles.destinationDot]}>
                <Ionicons name="flag" size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.toText}>{item.route.to}</Text>
            </View>
          </View>
          <View style={styles.priceSection}>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.priceLabel}>per seat</Text>
          </View>
        </View>

        {/* Driver Info */}
        <View style={styles.driverCard}>
          <View style={styles.driverInfo}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverInitial}>{item.driverName.charAt(0)}</Text>
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{item.driverName}</Text>
              <View style={styles.vehicleRow}>
                <Ionicons name="car" size={14} color={Colors.textSecondary} />
                <Text style={styles.vehicleText}>{item.vehicle.model} • {item.vehicle.plate}</Text>
              </View>
            </View>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.availableSeats) }
          ]}>
            <Text style={styles.statusText}>{getStatusText(item.availableSeats)}</Text>
          </View>
        </View>

        {/* Trip Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <Ionicons name="time" size={20} color={Colors.primary} />
            <Text style={styles.detailLabel}>Departure</Text>
            <Text style={styles.detailValue}>{formatTime(item.departureTime)}</Text>
          </View>
          <View style={styles.detailCard}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(item.departureTime)}</Text>
          </View>
          <View style={styles.detailCard}>
            <Ionicons name="people" size={20} color={Colors.primary} />
            <Text style={styles.detailLabel}>Seats</Text>
            <Text style={styles.detailValue}>{item.availableSeats} left</Text>
          </View>
        </View>

        {/* Book Button */}
        <TouchableOpacity
          style={[
            styles.bookButton,
            item.availableSeats === 0 && styles.bookButtonDisabled
          ]}
          onPress={() => navigation.navigate('StudentBookRide', { ride: item })}
          disabled={item.availableSeats === 0}
        >
          <LinearGradient
            colors={item.availableSeats === 0 ? ['#9CA3AF', '#6B7280'] : Colors.gradients.primary}
            style={styles.bookButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons 
              name={item.availableSeats === 0 ? "close-circle" : "arrow-forward"} 
              size={20} 
              color="#FFFFFF" 
              style={{ marginRight: 8 }}
            />
            <Text style={styles.bookButtonText}>
              {item.availableSeats === 0 ? 'Fully Booked' : 'Book This Ride'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading available rides..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003B73" />
      
      {/* Header Section */}
      <LinearGradient
        colors={['#003B73', '#0074D9', '#00BFFF']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
        <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
        >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
            <Text style={styles.headerTitle}>Find Rides</Text>
        <TouchableOpacity 
              style={styles.filterButton}
              onPress={handleFilterPress}
        >
              <Ionicons name="options-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
          {/* Search Bar */}
          <Animated.View 
            style={[
              styles.searchContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search rides, drivers, or destinations..."
                placeholderTextColor={Colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          {/* Filter Chips */}
          <Animated.View 
            style={[
              styles.filterContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { key: 'all', label: 'All Rides', icon: 'grid' },
                { key: 'available', label: 'Available', icon: 'checkmark-circle' },
                { key: 'few-seats', label: 'Few Seats', icon: 'warning' },
                { key: 'full', label: 'Full', icon: 'close-circle' },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterChip,
                    selectedFilter === filter.key && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedFilter(filter.key)}
                >
                  <Ionicons 
                    name={filter.icon} 
                    size={16} 
                    color={selectedFilter === filter.key ? '#FFFFFF' : Colors.primary} 
                  />
                  <Text style={[
                    styles.filterChipText,
                    selectedFilter === filter.key && styles.filterChipTextActive
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </LinearGradient>
      
      {/* Content */}
      <View style={styles.content}>
        {filteredRides.length === 0 ? (
          <Animated.View 
            style={[
              styles.emptyState,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.emptyIconContainer}>
              <Ionicons name="car-outline" size={64} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>
              {searchQuery || selectedFilter !== 'all' ? 'No matching rides' : 'No rides available'}
            </Text>
          <Text style={styles.emptySubtitle}>
              {searchQuery || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Check back later for new rides or try refreshing'
              }
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <LinearGradient
              colors={Colors.gradients.primary}
              style={styles.refreshButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </LinearGradient>
          </TouchableOpacity>
          </Animated.View>
      ) : (
        <FlatList
            data={filteredRides}
          keyExtractor={item => item.id}
          renderItem={renderRide}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background,
  },
  
  // Header Styles
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Search Styles
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Shadows.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  
  // Filter Styles
  filterContainer: {
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterChipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  
  // Content Styles
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 150, // Adjusted for floating navigation bar
  },
  
  // Ride Card Styles
  rideCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  cardGradient: {
    padding: 20,
  },
  
  // Route Header
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  routeInfo: {
    flex: 1,
    marginRight: 16,
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...Shadows.sm,
  },
  destinationDot: {
    backgroundColor: Colors.secondary,
  },
  fromText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  toText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  routeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray300,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.success,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  
  // Driver Card
  driverCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...Shadows.sm,
  },
  driverInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    ...Shadows.sm,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  
  // Book Button
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Shadows.md,
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 16,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  refreshButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Shadows.md,
  },
  refreshButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
}); 