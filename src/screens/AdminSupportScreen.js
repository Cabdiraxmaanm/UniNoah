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

export default function AdminSupportScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [tickets, setTickets] = useState([
    {
      id: '1',
      user: 'John Doe',
      email: 'john.doe@university.edu',
      subject: 'Payment issue with ride #1234',
      message: 'I was charged twice for the same ride. Please help me get a refund.',
      status: 'open',
      priority: 'high',
      category: 'payment',
      createdAt: '2024-03-15 14:30',
      lastUpdated: '2024-03-15 14:30',
      assignedTo: null,
    },
    {
      id: '2',
      user: 'Jane Smith',
      email: 'jane.smith@university.edu',
      subject: 'Driver was late',
      message: 'My driver was 30 minutes late and didn\'t apologize. Very unprofessional.',
      status: 'in_progress',
      priority: 'medium',
      category: 'service',
      createdAt: '2024-03-15 13:15',
      lastUpdated: '2024-03-15 15:00',
      assignedTo: 'Admin User',
    },
    {
      id: '3',
      user: 'Mike Johnson',
      email: 'mike.johnson@university.edu',
      subject: 'App keeps crashing',
      message: 'The app crashes every time I try to book a ride. This is very frustrating.',
      status: 'resolved',
      priority: 'high',
      category: 'technical',
      createdAt: '2024-03-14 16:45',
      lastUpdated: '2024-03-15 10:30',
      assignedTo: 'Admin User',
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#EF4444';
      case 'in_progress': return '#F59E0B';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return Colors.gray500;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return Colors.gray500;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'payment': return 'card-outline';
      case 'service': return 'car-outline';
      case 'technical': return 'bug-outline';
      case 'account': return 'person-outline';
      default: return 'help-circle-outline';
    }
  };

  const handleTicketAction = (ticketId, action) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this ticket?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log(`${action} ticket ${ticketId}`) },
      ]
    );
  };

  const TicketCard = ({ ticket }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <View style={styles.ticketInfo}>
          <Text style={styles.ticketId}>#{ticket.id}</Text>
          <Text style={styles.ticketSubject}>{ticket.subject}</Text>
          <Text style={styles.ticketUser}>{ticket.user} • {ticket.email}</Text>
        </View>
        <View style={styles.ticketStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
            <Text style={styles.statusText}>{ticket.status.toUpperCase()}</Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) }]}>
            <Text style={styles.priorityText}>{ticket.priority.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.ticketContent}>
        <Text style={styles.ticketMessage} numberOfLines={3}>
          {ticket.message}
        </Text>
      </View>

      <View style={styles.ticketMeta}>
        <View style={styles.metaItem}>
          <Ionicons name={getCategoryIcon(ticket.category)} size={16} color={Colors.gray500} />
          <Text style={styles.metaText}>{ticket.category}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color={Colors.gray500} />
          <Text style={styles.metaText}>{ticket.createdAt}</Text>
        </View>
        {ticket.assignedTo && (
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={16} color={Colors.gray500} />
            <Text style={styles.metaText}>{ticket.assignedTo}</Text>
          </View>
        )}
      </View>

      <View style={styles.ticketActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => console.log('View ticket details', ticket.id)}
        >
          <Ionicons name="eye-outline" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        
        {ticket.status === 'open' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.assignButton]}
            onPress={() => handleTicketAction(ticket.id, 'assign to me')}
          >
            <Ionicons name="person-add-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Assign</Text>
          </TouchableOpacity>
        )}
        
        {ticket.status === 'in_progress' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.resolveButton]}
            onPress={() => handleTicketAction(ticket.id, 'resolve')}
          >
            <Ionicons name="checkmark-outline" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Resolve</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.replyButton]}
          onPress={() => console.log('Reply to ticket', ticket.id)}
        >
          <Ionicons name="chatbubble-outline" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || ticket.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { key: 'all', label: 'All Tickets', count: tickets.length },
    { key: 'open', label: 'Open', count: tickets.filter(t => t.status === 'open').length },
    { key: 'in_progress', label: 'In Progress', count: tickets.filter(t => t.status === 'in_progress').length },
    { key: 'resolved', label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length },
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
          <Text style={styles.headerTitle}>Support Center</Text>
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
              placeholder="Search tickets..."
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

        {/* Tickets List */}
        <ScrollView
          style={styles.ticketsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
          }
        >
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="help-circle-outline" size={64} color={Colors.gray400} />
              <Text style={styles.emptyStateTitle}>No tickets found</Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery ? 'Try adjusting your search terms' : 'No support tickets available'}
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
  ticketsList: {
    flex: 1,
  },
  ticketCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketId: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  ticketSubject: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  ticketUser: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  ticketStatus: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
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
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  priorityText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: '#FFFFFF',
  },
  ticketContent: {
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray100,
  },
  ticketMessage: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  ticketMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
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
  ticketActions: {
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
  resolveButton: {
    backgroundColor: '#10B981',
  },
  replyButton: {
    backgroundColor: '#8B5CF6',
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
