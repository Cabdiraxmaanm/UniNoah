import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';

export default function StudentRateDriverScreen({ navigation, route }) {
  const { booking } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useApp();

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating before submitting.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Thank You!',
        'Your rating has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('StudentRideHistory'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit rating. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="Submitting rating..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Rate Driver" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.rideCard}>
          <Text style={styles.sectionTitle}>Ride Details</Text>
          
          <View style={styles.rideInfo}>
            <Text style={styles.routeText}>
              {booking.route.from} → {booking.route.to}
            </Text>
            <Text style={styles.dateText}>
              {formatDate(booking.departureTime)} at {formatTime(booking.departureTime)}
            </Text>
            <Text style={styles.priceText}>${booking.price}</Text>
          </View>
        </View>

        <View style={styles.driverCard}>
          <Text style={styles.sectionTitle}>Driver Information</Text>
          
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{booking.driverName}</Text>
            <Text style={styles.vehicleInfo}>
              {booking.vehicle?.model || 'Vehicle'} • {booking.vehicle?.plate || 'Plate'}
            </Text>
          </View>
        </View>

        <View style={styles.ratingCard}>
          <Text style={styles.sectionTitle}>Rate Your Experience</Text>
          
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                style={styles.starButton}
                onPress={() => handleRating(star)}
              >
                <Text style={[
                  styles.star,
                  rating >= star ? styles.starFilled : styles.starEmpty
                ]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.ratingText}>
            {rating === 0 && 'Tap to rate'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </Text>
        </View>

        <View style={styles.commentCard}>
          <Text style={styles.sectionTitle}>Additional Comments (Optional)</Text>
          
          <TextInput
            style={styles.commentInput}
            placeholder="Share your experience with this driver..."
            placeholderTextColor="#aaa"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.categoriesCard}>
          <Text style={styles.sectionTitle}>Rate Specific Aspects</Text>
          
          <View style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>Punctuality</Text>
            <View style={styles.categoryStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} style={styles.categoryStar}>
                  <Text style={styles.categoryStarText}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>Vehicle Cleanliness</Text>
            <View style={styles.categoryStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} style={styles.categoryStar}>
                  <Text style={styles.categoryStarText}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>Communication</Text>
            <View style={styles.categoryStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} style={styles.categoryStar}>
                  <Text style={styles.categoryStarText}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>Safety</Text>
            <View style={styles.categoryStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} style={styles.categoryStar}>
                  <Text style={styles.categoryStarText}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]} 
          onPress={handleSubmitRating}
          disabled={rating === 0}
        >
          <Text style={styles.submitButtonText}>Submit Rating</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#003B73',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003B73',
    marginBottom: 16,
  },
  rideInfo: {
    alignItems: 'center',
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003B73',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 16,
    color: '#2ECC40',
    fontWeight: 'bold',
  },
  driverCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#003B73',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  driverInfo: {
    alignItems: 'center',
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003B73',
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
  },
  ratingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#003B73',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 40,
  },
  starFilled: {
    color: '#F39C12',
  },
  starEmpty: {
    color: '#ddd',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003B73',
  },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#003B73',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  commentInput: {
    backgroundColor: '#f8faff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
  },
  categoriesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#003B73',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  categoryStars: {
    flexDirection: 'row',
  },
  categoryStar: {
    padding: 4,
  },
  categoryStarText: {
    fontSize: 20,
    color: '#ddd',
  },
  submitButton: {
    backgroundColor: '#0074D9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0074D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 