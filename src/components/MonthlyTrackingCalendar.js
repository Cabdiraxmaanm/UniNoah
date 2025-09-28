import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MonthlyTrackingCalendar({ 
  bookings = [], 
  userType = 'student', 
  onDateSelect = () => {},
  selectedDate = null 
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    generateCalendar();
  }, [currentMonth, bookings]);

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: '', isCurrentMonth: false, isToday: false, hasRides: false });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = isSameDay(date, new Date());
      const hasRides = hasRidesOnDate(date);
      const daysRemaining = getDaysRemaining(date);
      
      days.push({
        day,
        date,
        isCurrentMonth: true,
        isToday,
        hasRides,
        daysRemaining,
        rides: getRidesForDate(date)
      });
    }
    
    setCalendarDays(days);
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const hasRidesOnDate = (date) => {
    return bookings.some(booking => {
      const bookingDate = new Date(booking.departureTime);
      return isSameDay(bookingDate, date);
    });
  };

  const getRidesForDate = (date) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.departureTime);
      return isSameDay(bookingDate, date);
    });
  };

  const getDaysRemaining = (date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getMonthName = () => {
    return currentMonth.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (daysRemaining) => {
    if (daysRemaining < 0) return Colors.error; // Past
    if (daysRemaining === 0) return Colors.warning; // Today
    if (daysRemaining <= 3) return Colors.warning; // Soon
    return Colors.success; // Future
  };

  const getStatusText = (daysRemaining) => {
    if (daysRemaining < 0) return 'Past';
    if (daysRemaining === 0) return 'Today';
    if (daysRemaining === 1) return 'Tomorrow';
    return `${daysRemaining} days left`;
  };

  const renderDay = (dayData, index) => {
    if (!dayData.isCurrentMonth) {
      return <View key={index} style={styles.emptyDay} />;
    }

    const isSelected = selectedDate && isSameDay(dayData.date, selectedDate);
    const statusColor = dayData.hasRides ? getStatusColor(dayData.daysRemaining) : Colors.gray300;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayCell,
          dayData.isToday && styles.todayCell,
          isSelected && styles.selectedCell,
          dayData.hasRides && styles.hasRidesCell
        ]}
        onPress={() => onDateSelect(dayData)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dayText,
          dayData.isToday && styles.todayText,
          isSelected && styles.selectedText
        ]}>
          {dayData.day}
        </Text>
        
        {dayData.hasRides && (
          <View style={[styles.rideIndicator, { backgroundColor: statusColor }]}>
            <Text style={styles.rideCount}>
              {dayData.rides.length}
            </Text>
          </View>
        )}
        
        {dayData.hasRides && dayData.daysRemaining >= 0 && (
          <Text style={[styles.daysRemainingText, { color: statusColor }]}>
            {dayData.daysRemaining === 0 ? 'Today' : 
             dayData.daysRemaining === 1 ? '1d' : 
             `${dayData.daysRemaining}d`}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateMonth(-1)}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>{getMonthName()}</Text>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateMonth(1)}
        >
          <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Day Headers */}
      <View style={styles.dayHeaders}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} style={styles.dayHeaderText}>{day}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((dayData, index) => renderDay(dayData, index))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
          <Text style={styles.legendText}>Future rides</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
          <Text style={styles.legendText}>Soon (1-3 days)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.error }]} />
          <Text style={styles.legendText}>Past rides</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  dayHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  dayCell: {
    width: (width - 80) / 7,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    position: 'relative',
  },
  emptyDay: {
    width: (width - 80) / 7,
    height: 60,
    marginBottom: Spacing.sm,
  },
  todayCell: {
    backgroundColor: Colors.primary + '15',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  selectedCell: {
    backgroundColor: Colors.primary,
  },
  hasRidesCell: {
    backgroundColor: Colors.gray50,
  },
  dayText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
  todayText: {
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: Typography.bold,
  },
  rideIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rideCount: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
  },
  daysRemainingText: {
    position: 'absolute',
    bottom: 2,
    fontSize: 8,
    fontWeight: Typography.bold,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.xs,
  },
  legendText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
});
